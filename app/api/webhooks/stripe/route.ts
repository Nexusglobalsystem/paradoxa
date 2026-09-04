/**
 * POST /api/webhooks/stripe — assemble les briques déjà écrites et testées
 * séparément (verifier-signature, construire-commande, decrementer-stock,
 * idempotence, envoyer-email-confirmation, stock-repository-supabase) en un
 * vrai handler Next.js. Ce fichier lui-même n'a pas de test unitaire — il
 * n'orchestre que des fonctions déjà couvertes, dans le style déjà établi
 * par stock-repository-supabase.ts ("exerce le client réel, pas testé isolément").
 *
 * `runtime = "nodejs"` : nécessaire pour lire le corps brut de la requête
 * (`request.text()`) avant tout parsing JSON — la vérification de signature
 * Stripe porte sur les octets exacts envoyés, voir verifier-signature.ts.
 */
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

import { construireCommandeDepuisSession, extraireLignesProduits, genererNumeroCommande } from "./construire-commande";
import { decrementerStock } from "./decrementer-stock";
import { envoyerEmailConfirmation } from "./envoyer-email-confirmation";
import { interpreterErreurConflit } from "./idempotence";
import { creerStockRepositorySupabase } from "./stock-repository-supabase";
import { verifierEvenementWebhook } from "./verifier-signature";

export const runtime = "nodejs";

const TENTATIVES_NUMERO_MAX = 5;

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("webhook.stripe.config_manquante", { variable: "STRIPE_WEBHOOK_SECRET" });
    return NextResponse.json({ erreur: "Webhook non configuré." }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ erreur: "En-tête stripe-signature manquant." }, { status: 400 });
  }

  const payload = await request.text();

  let evenement: Stripe.Event;
  try {
    evenement = verifierEvenementWebhook(payload, signature, secret);
  } catch (erreur) {
    console.error("webhook.stripe.signature_invalide", {
      erreur: erreur instanceof Error ? erreur.message : String(erreur),
    });
    return NextResponse.json({ erreur: "Signature invalide." }, { status: 400 });
  }

  console.log(
    JSON.stringify({ evenement: "webhook.stripe.recu", type: evenement.type, id: evenement.id }),
  );

  if (evenement.type !== "checkout.session.completed") {
    // Tout autre évènement (payment_intent.*, etc.) : acquitté sans
    // traitement, on n'écoute que la confirmation de paiement Checkout.
    return NextResponse.json({ recu: true }, { status: 200 });
  }

  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete) {
    console.error("webhook.stripe.config_manquante", { variable: "STRIPE_SECRET_KEY" });
    return NextResponse.json({ erreur: "Paiement non configuré." }, { status: 500 });
  }

  const session = evenement.data.object as Stripe.Checkout.Session;
  const stripe = new Stripe(cleSecrete);
  const supabase = createServiceRoleClient();

  // Les lignes produit ne sont pas dans le payload de l'évènement : il faut
  // les redemander à Stripe, avec le produit associé développé pour
  // retrouver produit_id (posé en métadonnée Product par construire-payload-stripe.ts).
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });
  const lignesProduits = extraireLignesProduits(lineItems.data);

  let commandeId: string | null = null;
  let dernierNumero = "";

  for (let tentative = 0; tentative < TENTATIVES_NUMERO_MAX; tentative += 1) {
    dernierNumero = genererNumeroCommande();
    const commandeAPersister = construireCommandeDepuisSession(session, dernierNumero);

    const { data, error } = await supabase
      .from("commandes")
      .insert(commandeAPersister)
      .select("id")
      .single();

    if (!error && data) {
      commandeId = data.id;
      break;
    }

    const interpretation = interpreterErreurConflit(error);
    if (interpretation === "session_deja_traitee") {
      // Idempotence : cet évènement a déjà été traité (retentative Stripe
      // après un ack manqué, ou double livraison). Rien à refaire — surtout
      // pas redécrémenter le stock une seconde fois.
      console.log(
        JSON.stringify({ evenement: "webhook.stripe.deja_traite", sessionId: session.id }),
      );
      return NextResponse.json({ recu: true, dejaTraite: true }, { status: 200 });
    }
    if (interpretation === "numero_collision") {
      continue; // relance la boucle avec un nouveau numéro généré
    }

    console.error("webhook.stripe.erreur_insertion_commande", {
      sessionId: session.id,
      erreur: error?.message,
    });
    return NextResponse.json({ erreur: "Échec de l'enregistrement de la commande." }, { status: 500 });
  }

  if (!commandeId) {
    console.error("webhook.stripe.echec_generation_numero", { sessionId: session.id });
    return NextResponse.json({ erreur: "Impossible de générer un numéro de commande unique." }, { status: 500 });
  }

  if (lignesProduits.length > 0) {
    const { error: erreurLignes } = await supabase.from("commande_lignes").insert(
      lignesProduits.map((ligne) => ({
        commande_id: commandeId,
        produit_id: ligne.produitId,
        nom_produit: ligne.nom,
        prix_unitaire: ligne.prixUnitaire,
        quantite: ligne.quantite,
        sous_total: ligne.sousTotal,
      })),
    );
    if (erreurLignes) {
      // La commande existe déjà (payée) : on journalise sans faire échouer
      // la réponse — un webhook en échec serait retenté par Stripe et
      // redéclencherait un conflit d'idempotence sur stripe_session_id,
      // sans jamais pouvoir corriger cette écriture partielle. Signalé pour
      // suivi manuel plutôt que boucle de retry infinie.
      console.error("webhook.stripe.erreur_insertion_lignes", {
        commandeId,
        erreur: erreurLignes.message,
      });
    }

    const depotStock = creerStockRepositorySupabase(supabase);
    for (const ligne of lignesProduits) {
      const resultat = await decrementerStock(depotStock, ligne.produitId, ligne.quantite);
      if (!resultat.ok) {
        console.error("webhook.stripe.echec_decrement_stock", {
          commandeId,
          produitId: ligne.produitId,
          raison: resultat.raison,
        });
      }
    }
  }

  try {
    const commandeComplete = construireCommandeDepuisSession(session, dernierNumero);
    await envoyerEmailConfirmation(commandeComplete, lignesProduits);
  } catch (erreur) {
    // Défense en profondeur : envoyerEmailConfirmation n'est pas censée
    // lever (voir son propre commentaire d'en-tête), ce try/catch ne doit
    // donc normalement jamais s'exécuter.
    console.error("webhook.stripe.erreur_email_inattendue", {
      commandeId,
      erreur: erreur instanceof Error ? erreur.message : String(erreur),
    });
  }

  console.log(
    JSON.stringify({ evenement: "webhook.stripe.commande_enregistree", commandeId, numero: dernierNumero }),
  );

  return NextResponse.json({ recu: true, commandeId }, { status: 200 });
}

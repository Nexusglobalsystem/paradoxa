/**
 * POST /api/commande/creer-session — crée une session Stripe Checkout à
 * partir du panier envoyé par le client (app/(vitrine)/commande/tunnel-commande.tsx).
 *
 * Le client n'envoie QUE des `produitId` + `quantite` (jamais un prix) : ce
 * handler relit `produits.prix` / `produits.stock` / `produits.statut` en
 * base pour chaque ligne avant tout calcul (CLAUDE.md règle n°4 — le prix
 * affiché côté client n'est qu'un cache d'affichage optimiste, jamais une
 * source de vérité). Le paiement lui-même reste géré entièrement par Stripe
 * Checkout hébergé (.claude/agents/api-paiement.md) : ce handler ne fait que
 * demander une URL de session et la renvoyer, il ne voit jamais de données
 * de carte.
 *
 * Limite connue, documentée plutôt que masquée : le stock n'est vérifié
 * qu'ici, au moment de créer la session — il n'est ni réservé ni décrémenté
 * avant le paiement effectif (décrément réel dans
 * app/api/webhooks/stripe/route.ts, sur checkout.session.completed
 * uniquement). Entre la création de session et le paiement, deux acheteurs
 * concurrents pourraient en théorie survendre un article à stock unitaire
 * très bas. Une réservation temporaire de stock résoudrait ça mais exige un
 * mécanisme (colonne "stock réservé" + tâche d'expiration) hors périmètre
 * de cette vague — signalé pour arbitrage produit.
 */
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { calculerFraisLivraison, calculerSousTotal, calculerTotal, verifierDeviseUniforme } from "../calculs";
import { CreerSessionSchema, type CreerSessionReponseErreur, type CreerSessionReponseSucces } from "./schema";
import { PaymentProviderIndisponibleError, StripeProvider } from "./stripe-provider";
import { verifierEtConstruireLignes, type ProduitDisponible } from "./verifier-disponibilite";

export const runtime = "nodejs";

function erreurJson(erreur: string, status: number, details?: string[]) {
  const corps: CreerSessionReponseErreur = details ? { erreur, details } : { erreur };
  return NextResponse.json(corps, { status });
}

export async function POST(request: Request) {
  let corpsBrut: unknown;
  try {
    corpsBrut = await request.json();
  } catch {
    return erreurJson("Corps de requête JSON invalide.", 400);
  }

  const parseEntree = CreerSessionSchema.safeParse(corpsBrut);
  if (!parseEntree.success) {
    return erreurJson(
      "Requête invalide.",
      400,
      parseEntree.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    );
  }
  const { articles, livraison } = parseEntree.data;

  // Client publishable (pas service_role) : la lecture de `produits` passe
  // par la policy RLS publique "statut = 'actif' or is_admin()" — voir
  // supabase/migrations/20260903193617_produits.sql. Aucun besoin de
  // service_role pour ce SELECT, contrairement à l'écriture de `commandes`
  // (webhook uniquement).
  const supabase = await createClient();

  // Optionnel : si un client est connecté (compte, écran 17), sa commande
  // lui est liée automatiquement — voir payment-provider.ts et
  // ../../webhooks/stripe/construire-commande.ts. Absent (checkout invité),
  // clientId reste null, comportement inchangé.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const clientId = user?.id ?? null;

  const idsProduits = [...new Set(articles.map((a) => a.produitId))];

  const { data: produitsBruts, error: erreurProduits } = await supabase
    .from("produits")
    .select("id, nom, prix, devise, stock, statut")
    .in("id", idsProduits);

  if (erreurProduits) {
    console.error("commande.creer_session.erreur_lecture_produits", erreurProduits);
    return erreurJson("Impossible de vérifier le panier pour le moment. Réessayez.", 500);
  }

  const produits = new Map<string, ProduitDisponible>(
    (produitsBruts ?? []).map((p) => [
      p.id,
      { id: p.id, nom: p.nom, prix: Number(p.prix), devise: p.devise, stock: p.stock, statut: p.statut },
    ]),
  );

  const verification = verifierEtConstruireLignes(articles, produits);
  if (!verification.ok) {
    return NextResponse.json(
      {
        erreur:
          "Un ou plusieurs articles de votre panier ne sont plus disponibles tels quels. Merci de mettre à jour votre panier.",
        problemes: verification.problemes,
      },
      { status: 422 },
    );
  }
  const { lignes } = verification;

  const devisesLignes = lignes.map((l) => produits.get(l.produitId)!.devise);
  const devise = verifierDeviseUniforme(devisesLignes);
  if (!devise) {
    // Le catalogue actuel est 100 % EUR (voir produits.devise) ; ce garde-fou
    // protège contre un futur ajout XOF mélangé dans un même panier, que
    // Stripe Checkout ne sait pas facturer en une session unique.
    return erreurJson(
      "Votre panier mélange plusieurs devises, ce qui n'est pas pris en charge pour le règlement. " +
        "Merci de commander séparément les articles concernés.",
      422,
    );
  }

  const sousTotal = calculerSousTotal(lignes.map((l) => ({ prixUnitaire: l.prixUnitaire, quantite: l.quantite })));
  const fraisLivraison = calculerFraisLivraison(sousTotal);
  const total = calculerTotal(sousTotal, fraisLivraison);

  const origine = new URL(request.url).origin;
  const urlSucces = `${origine}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`;
  const urlAnnulation = `${origine}/commande`;

  try {
    const provider = new StripeProvider();
    const session = await provider.creerSession({
      lignes,
      sousTotal,
      fraisLivraison,
      total,
      devise,
      livraison,
      urlSucces,
      urlAnnulation,
      clientId,
    });

    return NextResponse.json({ url: session.url } satisfies CreerSessionReponseSucces, { status: 201 });
  } catch (error) {
    if (error instanceof PaymentProviderIndisponibleError) {
      console.error("commande.creer_session.provider_indisponible", error.message);
      return erreurJson(
        "Le règlement en ligne est momentanément indisponible. Notre atelier a été notifié.",
        500,
      );
    }
    console.error("commande.creer_session.erreur_inattendue", error);
    return erreurJson("Impossible de préparer le règlement pour le moment. Réessayez dans un instant.", 500);
  }
}

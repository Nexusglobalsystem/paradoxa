import { Resend } from "resend";

import type { CommandeAPersister, LigneProduitExtraite } from "./construire-commande";

/**
 * Email de confirmation — STRICTEMENT best-effort (gap d'environnement
 * documenté : aucune RESEND_API_KEY dans .env.local pour cette tâche).
 * Ni l'enregistrement de la commande ni le décrément de stock ne doivent
 * jamais dépendre du succès de cet envoi : route.ts n'attend de cette
 * fonction qu'elle ne lève jamais, seulement qu'elle journalise. Voir
 * l'appel dans route.ts, volontairement enveloppé dans un try/catch propre
 * même si cette fonction avale déjà ses propres erreurs — défense en
 * profondeur, pas une garantie qu'on retire d'ici.
 */
export async function envoyerEmailConfirmation(
  commande: CommandeAPersister,
  lignes: readonly LigneProduitExtraite[],
): Promise<void> {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.log(
      JSON.stringify({
        evenement: "webhook.stripe.email_non_envoye",
        raison: "RESEND_API_KEY absente",
        numeroCommande: commande.numero_commande,
      }),
    );
    return;
  }

  try {
    const resend = new Resend(cle);
    await resend.emails.send({
      // Nécessite un domaine d'envoi vérifié dans Resend avant tout envoi
      // réel — à configurer en même temps que RESEND_API_KEY (voir le
      // rapport de tâche). Placeholder documenté, pas une valeur à
      // considérer opérationnelle telle quelle.
      from: "LA PARADOXA <commandes@laparadoxa.fr>",
      to: commande.email,
      subject: `Votre commande ${commande.numero_commande} est confirmée`,
      html: construireHtmlEmail(commande, lignes),
    });
  } catch (erreur) {
    console.error(
      JSON.stringify({
        evenement: "webhook.stripe.erreur_email",
        numeroCommande: commande.numero_commande,
        erreur: erreur instanceof Error ? erreur.message : String(erreur),
      }),
    );
  }
}

function construireHtmlEmail(commande: CommandeAPersister, lignes: readonly LigneProduitExtraite[]): string {
  const lignesHtml = lignes
    .map(
      (l) =>
        `<tr><td>${l.nom}</td><td style="text-align:right">${l.quantite}</td><td style="text-align:right">${l.sousTotal.toFixed(2)} ${commande.devise}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family: sans-serif; color:#1B2A23;">
      <h1 style="font-weight:300;">Merci, ${commande.nom_complet.split(" ")[0] || ""} !</h1>
      <p>Votre commande <strong>${commande.numero_commande}</strong> est confirmée.</p>
      <table style="width:100%; border-collapse:collapse;">
        ${lignesHtml}
      </table>
      <p>Sous-total : ${commande.sous_total.toFixed(2)} ${commande.devise}<br/>
      Livraison : ${commande.frais_livraison.toFixed(2)} ${commande.devise}<br/>
      <strong>Total : ${commande.total.toFixed(2)} ${commande.devise}</strong></p>
      <p>Livraison à : ${commande.adresse_ligne1}, ${commande.code_postal} ${commande.ville}, ${commande.pays}</p>
    </div>
  `.trim();
}

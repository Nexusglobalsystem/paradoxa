"use server";

export interface EtatContact {
  erreur?: string;
  succes?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action placeholder : valide les champs et confirme la réception de
 * la demande visuellement. Aucun envoi réel n'est effectué — ni email
 * (Resend), ni écriture Supabase — c'est hors périmètre de cette vague.
 * À brancher sur une vraie route d'envoi (Resend + table `demandes_contact`)
 * lorsque le backend de conciergerie sera construit.
 */
export async function envoyerMessage(
  _etatPrecedent: EtatContact,
  formData: FormData,
): Promise<EtatContact> {
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const sujet = String(formData.get("sujet") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!nom) {
    return { erreur: "Merci d'indiquer votre nom." };
  }
  if (!EMAIL_RE.test(email)) {
    return { erreur: "Merci d'indiquer une adresse email valide." };
  }
  if (!sujet) {
    return { erreur: "Merci de préciser l'objet de votre demande." };
  }
  if (message.length < 10) {
    return { erreur: "Merci de détailler votre demande (10 caractères minimum)." };
  }

  // Placeholder : simule la latence d'un envoi réel pour un feedback UI cohérent.
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { succes: true };
}

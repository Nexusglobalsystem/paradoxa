import type { Metadata } from "next";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact & conciergerie — LA PARADOXA",
  description:
    "Écrivez à la conciergerie LA PARADOXA : adresses des ateliers de Paris et Dakar, horaires et formulaire de contact pour vos commandes, échantillons et demandes de sourcing.",
};

const ADRESSES = [
  {
    ville: "Paris",
    maison: "Atelier SHÉA — Rive Gauche",
    adresse: "42, rue de Grenelle, 75007 Paris",
    horaires: ["Mardi – Samedi", "11h00 — 19h30"],
    contact: "paris@laparadoxa.com",
  },
  {
    ville: "Dakar",
    maison: "Officine ÉCLORÉE — Plateau",
    adresse: "18, avenue Léopold Sédar Senghor, Dakar-Plateau",
    horaires: ["Lundi – Vendredi", "10h00 — 18h00"],
    contact: "dakar@laparadoxa.com",
  },
];

const FAQS = [
  {
    q: "Quels sont les délais de livraison entre Dakar et Paris ?",
    a: "Les commandes expédiées depuis notre atelier parisien partent sous 48 heures ouvrées et arrivent en 2 à 4 jours en France métropolitaine. Pour Dakar et la sous-région, comptez 5 à 8 jours ouvrés : nos flacons et baumes voyagent sous température régulée pour préserver leurs actifs.",
  },
  {
    q: "Comment fonctionnent les retours et le droit de rétractation ?",
    a: "Vous disposez de 14 jours à réception de votre commande pour changer d'avis. Pour des raisons d'hygiène, les flacons et baumes descellés ne peuvent être repris : seuls les produits dont le cachet de cire ou l'opercule restent intacts sont éligibles à un remboursement.",
  },
  {
    q: "Vos parfums et soins sont-ils adaptés aux peaux sensibles ?",
    a: "Toutes nos formules respectent les seuils IFRA en vigueur et la réglementation cosmétique européenne. Chaque nouvelle formule fait l'objet d'un test de tolérance cutanée avant sa mise en vente, et la liste des allergènes réglementés figure sur chaque fiche produit.",
  },
  {
    q: "D'où proviennent le karité et le moringa de la Maison ÉCLORÉE ?",
    a: "Notre karité est cueilli à l'état sauvage par une coopérative d'une quarantaine d'artisanes dans la région de Kédougou, au Sénégal, et notre moringa est cultivé en agriculture biologique près de Louga. Le détail de cette filière est présenté en intégralité sur notre page Engagements.",
  },
  {
    q: "Comment conserver au mieux mes parfums et baumes ?",
    a: "Nos extraits et baumes, sans stabilisateur de synthèse, préfèrent une température stable entre 18°C et 22°C, à l'abri de la lumière directe. Un léger changement de texture des beurres selon la saison est normal et n'altère jamais leur efficacité.",
  },
  {
    q: "Proposez-vous une personnalisation ou une gravure de flacon ?",
    a: "Sur demande auprès de la conciergerie, nos flacons d'exception peuvent recevoir une gravure d'initiales ou un court message, réalisée à la main dans notre atelier parisien. Comptez une dizaine de jours supplémentaires pour ce service.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Bandeau d'introduction */}
      <section className="w-full bg-ivoire-bouye px-space-lg py-space-xl lg:px-space-2xl">
        <div className="mx-auto flex max-w-desktop-max flex-col gap-space-md md:flex-row md:items-end md:justify-between">
          <div>
            {/* text-or-karite-strong, pas text-or-karite : bandeau sur fond clair
                (bg-ivoire-bouye) — confirmé par axe-core (Vague 5). */}
            <div className="flex items-center gap-space-xs font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite-strong">
              <span className="h-1.5 w-1.5 rounded-full bg-or-karite" aria-hidden="true" />
              Conciergerie
            </div>
            <h1 className="mt-space-xxs font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
              Contact &amp; conciergerie
            </h1>
          </div>
          <p className="reading-max font-interface text-body-reading text-on-surface-variant">
            De Paris à Dakar, nos ateliers accueillent vos questions, vos envies sur-mesure et vos
            demandes de sourcing avec la même attention portée à chaque flacon.
          </p>
        </div>
      </section>

      {/* Colonnes adresses / formulaire */}
      <section className="w-full px-space-lg py-space-xl lg:px-space-2xl">
        <div className="mx-auto grid max-w-desktop-max grid-cols-1 gap-space-2xl lg:grid-cols-12">
          {/* Colonne gauche : adresses, horaires, carte décorative */}
          <div className="flex flex-col gap-space-lg lg:col-span-5">
            {ADRESSES.map((a) => (
              <div
                key={a.ville}
                className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-space-lg"
              >
                {/* text-or-karite-strong, pas text-or-karite : carte sur fond clair
                    (bg-surface-container-low) — confirmé par axe-core (Vague 5). */}
                <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite-strong">
                  {a.maison}
                </span>
                <p className="mt-space-xxs font-display text-title-editorial text-encre-baobab">
                  {a.adresse}
                </p>
                <div className="mt-space-md grid grid-cols-2 gap-space-md font-interface text-body-ui text-on-surface-variant">
                  <div>
                    {/* text-or-karite-strong : même carte fond clair, cf. ci-dessus. */}
                    <span className="block text-caption-meta uppercase tracking-wider text-or-karite-strong">
                      Horaires
                    </span>
                    <span>{a.horaires[0]}</span>
                    <span className="block text-on-surface-variant/80">{a.horaires[1]}</span>
                  </div>
                  <div>
                    {/* text-or-karite-strong : même carte fond clair, cf. ci-dessus. */}
                    <span className="block text-caption-meta uppercase tracking-wider text-or-karite-strong">
                      Écrire
                    </span>
                    <a
                      href={`mailto:${a.contact}`}
                      className="font-medium text-encre-baobab transition-colors duration-300 ease-out hover:text-or-karite"
                    >
                      {a.contact}
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Bloc décoratif Paris — Dakar : pas de carte interactive, pas de
                dépendance externe, juste un tracé stylisé sur la palette
                de marque. */}
            <div className="rounded-xl bg-encre-baobab p-space-lg text-ivoire-bouye">
              <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
                Deux maisons, un seul atelier
              </span>
              <svg
                viewBox="0 0 400 180"
                className="mt-space-md h-36 w-full text-or-karite/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                aria-hidden="true"
              >
                <circle cx="90" cy="45" r="4" fill="#D9B26A" />
                <circle cx="90" cy="45" r="14" stroke="#D9B26A" strokeDasharray="2 2" strokeWidth="0.5" />
                <text x="105" y="49" fill="#F4EFE3" fontSize="11" letterSpacing="1.5">
                  PARIS
                </text>
                <path
                  d="M90 45 Q 180 110, 310 135"
                  stroke="#C98A2E"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <circle cx="310" cy="135" r="4" fill="#D9B26A" />
                <circle cx="310" cy="135" r="14" stroke="#D9B26A" strokeDasharray="2 2" strokeWidth="0.5" />
                <text x="255" y="152" fill="#F4EFE3" fontSize="11" letterSpacing="1.5">
                  DAKAR
                </text>
              </svg>
              <p className="font-interface text-caption-meta text-sable">
                Réponse personnalisée sous 48 heures ouvrées.
              </p>
            </div>
          </div>

          {/* Colonne droite : formulaire */}
          <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-space-lg lg:col-span-7 lg:p-space-2xl">
            <div className="mb-space-lg space-y-space-xxs border-b border-sable/60 pb-space-md">
              <h2 className="font-display text-headline-md text-encre-baobab">
                Écrire à la conciergerie
              </h2>
              <p className="font-interface text-body-reading text-on-surface-variant">
                Chaque message est lu par notre équipe : commande sur-mesure, échantillon,
                sourcing ou simple curiosité.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full border-t border-sable bg-surface-container px-space-lg py-space-3xl lg:px-space-2xl">
        <div className="mx-auto max-w-desktop-max space-y-space-2xl">
          <div className="flex flex-col gap-space-md border-b border-sable pb-space-lg md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
              Questions fréquentes
            </h2>
            <p className="reading-max font-interface text-body-ui text-on-surface-variant">
              Livraison, retours, allergènes, sourcing : nos réponses aux questions les plus
              posées à la conciergerie.
            </p>
          </div>
          <Accordion className="grid grid-cols-1 gap-space-lg divide-y-0 lg:grid-cols-2 lg:items-start">
            {FAQS.map((item) => (
              <AccordionItem
                key={item.q}
                className="rounded-lg bg-surface-container-low px-space-lg"
              >
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../legal-template";

export const metadata: Metadata = {
  title: "Conditions générales de vente — LA PARADOXA",
  description:
    "Conditions générales de vente LA PARADOXA : tarification, livraison, droit de rétractation, garanties et règlement des litiges pour les Maisons SHÉA et ÉCLORÉE.",
};

const sections: LegalSection[] = [
  {
    id: "champ-application",
    numeral: "I.",
    title: "Champ d'application",
    content: (
      <p>
        Les présentes conditions générales de vente régissent toute commande passée sur
        laparadoxa.com auprès de la société LA PARADOXA SAS, pour les produits des Maisons SHÉA
        (parfumerie) et ÉCLORÉE (soin naturel). Elles s&apos;appliquent à l&apos;exclusion de
        toute autre condition, sauf dérogation expresse et écrite.
      </p>
    ),
  },
  {
    id: "prix-paiement",
    numeral: "II.",
    title: "Prix et paiement",
    content: (
      <>
        <p>
          Les prix sont indiqués en euros (€) toutes taxes comprises pour les livraisons en
          France et dans l&apos;Union européenne, et en francs CFA (XOF) pour les livraisons au
          Sénégal et dans l&apos;espace UEMOA. LA PARADOXA se réserve le droit de modifier ses
          prix à tout moment, les produits étant facturés sur la base du tarif en vigueur au
          moment de la validation de la commande.
        </p>
        <p>
          Le règlement s&apos;effectue par carte bancaire, ou selon les moyens de paiement
          locaux proposés au Sénégal (Wave, Orange Money), au moment de la commande. La
          commande n&apos;est confirmée qu&apos;après encaissement effectif du paiement.
        </p>
      </>
    ),
  },
  {
    id: "livraison",
    numeral: "III.",
    title: "Livraison",
    content: (
      <div className="space-y-space-sm rounded-lg bg-surface-container p-space-lg">
        <div className="grid grid-cols-1 gap-space-md font-interface text-body-ui sm:grid-cols-2">
          {/* text-or-karite-strong, pas text-or-karite : encart sur fond clair
              (bg-surface-container), même motif que /mentions-legales, confirmé
              par axe-core (Vague 5). */}
          <div>
            <span className="block text-caption-meta uppercase tracking-wider text-or-karite-strong">
              France métropolitaine
            </span>
            <p className="mt-space-xxs text-encre-baobab">2 à 4 jours ouvrés, sous température régulée</p>
          </div>
          {/* text-or-karite-strong : même encart fond clair, cf. ci-dessus. */}
          <div>
            <span className="block text-caption-meta uppercase tracking-wider text-or-karite-strong">
              Sénégal & UEMOA
            </span>
            <p className="mt-space-xxs text-encre-baobab">5 à 8 jours ouvrés, dédouanement inclus</p>
          </div>
        </div>
        <p className="pt-space-sm font-interface text-body-ui text-on-surface-variant">
          Les expéditions vers l&apos;Union européenne et l&apos;espace CEDEAO sont réalisées
          sous incoterm DDP (Delivered Duty Paid) : aucun frais d&apos;importation
          supplémentaire ne peut être réclamé au destinataire à réception.
        </p>
      </div>
    ),
  },
  {
    id: "retractation",
    numeral: "IV.",
    title: "Droit de rétractation",
    content: (
      <>
        <p>
          Conformément à l&apos;article L. 221-18 du Code de la consommation, le client dispose
          d&apos;un délai de quatorze (14) jours calendaires à compter de la réception de sa
          commande pour exercer son droit de rétractation, sans avoir à justifier de motif.
        </p>
        <div className="space-y-space-xs rounded-lg bg-surface-container-high p-space-lg">
          <p className="font-display text-title-editorial text-encre-baobab">
            Condition d&apos;hygiène et d&apos;intégrité
          </p>
          <p className="font-interface text-body-ui text-on-surface-variant">
            En application de l&apos;article L. 221-28 5° du Code de la consommation, les
            flacons de parfum et les soins cosmétiques descellés ne peuvent être repris que si
            leur cachet de cire ou leur opercule d&apos;origine reste intact.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "garanties",
    numeral: "V.",
    title: "Garanties légales",
    content: (
      <p>
        Tous les produits vendus bénéficient de la garantie légale de conformité (articles
        L. 217-3 et suivants du Code de la consommation) et de la garantie contre les vices
        cachés (articles 1641 et suivants du Code civil), indépendamment de toute garantie
        commerciale complémentaire.
      </p>
    ),
  },
  {
    id: "coffret-decouverte",
    numeral: "VI.",
    title: "Crédit Coffret Découverte",
    content: (
      <p>
        L&apos;acquisition d&apos;un Coffret Découverte, olfactif ou botanique, donne lieu à un
        crédit nominatif équivalent à 100 % de son montant, déductible sur l&apos;achat
        ultérieur d&apos;un format complet réalisé dans un délai de 60 jours suivant la
        commande initiale.
      </p>
    ),
  },
  {
    id: "litiges",
    numeral: "VII.",
    title: "Règlement amiable des litiges",
    content: (
      <p>
        En cas de désaccord persistant n&apos;ayant pu trouver de solution auprès de notre
        conciergerie, le client peut recourir gratuitement à un médiateur de la consommation
        agréé, conformément aux articles L. 612-1 et suivants du Code de la consommation, ou à
        la plateforme européenne de règlement en ligne des litiges.
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <LegalPage
      eyebrow="Cadre juridique"
      title="Conditions générales de vente"
      intro="Tarification, livraison, rétractation et garanties applicables à toute commande passée auprès des Maisons SHÉA et ÉCLORÉE."
      reference="PAR-CGV-2026/V1"
      sections={sections}
    />
  );
}

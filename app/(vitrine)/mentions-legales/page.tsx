import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../legal-template";

export const metadata: Metadata = {
  title: "Mentions légales — LA PARADOXA",
  description:
    "Mentions légales du site LA PARADOXA : édition, hébergement, propriété intellectuelle et coordonnées de contact des Maisons SHÉA et ÉCLORÉE.",
};

const sections: LegalSection[] = [
  {
    id: "editeur",
    numeral: "I.",
    title: "Édition du site",
    content: (
      <>
        <p>
          Le site accessible à l&apos;adresse laparadoxa.com est édité par la société{" "}
          <strong>LA PARADOXA SAS</strong>, société par actions simplifiée au capital de
          150 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris.
        </p>
        <div className="space-y-space-sm rounded-lg bg-surface-container p-space-lg">
          <div className="grid grid-cols-1 gap-space-md font-interface text-body-ui sm:grid-cols-2">
            {/* text-or-karite-strong, pas text-or-karite : encart sur fond clair
                (bg-surface-container) — confirmé par axe-core (Vague 5). */}
            <div>
              <span className="block text-caption-meta uppercase tracking-wider text-or-karite-strong">
                Siège social
              </span>
              <p className="mt-space-xxs text-encre-baobab">
                42, rue de Grenelle
                <br />
                75007 Paris — France
              </p>
            </div>
            {/* text-or-karite-strong : même encart fond clair, cf. Siège social. */}
            <div>
              <span className="block text-caption-meta uppercase tracking-wider text-or-karite-strong">
                Atelier de formulation
              </span>
              <p className="mt-space-xxs text-encre-baobab">
                18, avenue Léopold Sédar Senghor
                <br />
                Dakar-Plateau — Sénégal
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-space-sm pt-space-sm font-label-tabular text-label-tabular text-on-surface-variant sm:grid-cols-3">
            <div>
              <span className="block text-caption-meta text-on-surface-variant">RCS Paris</span>
              <span className="text-encre-baobab">B 912 345 678</span>
            </div>
            <div>
              <span className="block text-caption-meta text-on-surface-variant">TVA intracom.</span>
              <span className="text-encre-baobab">FR 45 912345678</span>
            </div>
            <div>
              <span className="block text-caption-meta text-on-surface-variant">
                Directeur de la publication
              </span>
              <span className="text-encre-baobab">Direction Générale</span>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "hebergement",
    numeral: "II.",
    title: "Hébergement",
    content: (
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
        États-Unis, sur une infrastructure répliquée au sein de l&apos;Union européenne. Les
        données de commande et de compte client sont stockées séparément chez Supabase Inc.,
        conformément à notre politique de confidentialité.
      </p>
    ),
  },
  {
    id: "propriete-intellectuelle",
    numeral: "III.",
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          L&apos;ensemble des éléments du site — textes, formulations olfactives et
          cosmétiques, dénominations « Maison SHÉA », « Maison ÉCLORÉE » et « LA PARADOXA »,
          photographies, illustrations et matrices typographiques — relève de la propriété
          exclusive de LA PARADOXA SAS ou de ses partenaires, et est protégé par le Code de la
          propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, extraction ou réutilisation, totale ou partielle, sans
          autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée
          par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </>
    ),
  },
  {
    id: "liens-tiers",
    numeral: "IV.",
    title: "Liens hypertextes et sites tiers",
    content: (
      <p>
        Le site peut contenir des liens vers des sites tiers (réseaux sociaux, partenaires de
        paiement, plateformes de médiation). LA PARADOXA n&apos;exerce aucun contrôle sur le
        contenu de ces sites et décline toute responsabilité quant à leur disponibilité ou à
        leur conformité réglementaire.
      </p>
    ),
  },
  {
    id: "contact-legal",
    numeral: "V.",
    title: "Nous contacter",
    content: (
      <p>
        Pour toute question relative aux présentes mentions légales, notre secrétariat général
        est joignable à l&apos;adresse{" "}
        <a
          href="mailto:legal@laparadoxa.com"
          className="font-medium text-encre-baobab underline decoration-or-karite/60 underline-offset-2 transition-colors duration-300 ease-out hover:text-terre-de-dakar"
        >
          legal@laparadoxa.com
        </a>{" "}
        ou via notre page de contact.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      eyebrow="Cadre juridique"
      title="Mentions légales"
      intro="Édition du site, hébergement et propriété intellectuelle des Maisons SHÉA et ÉCLORÉE, réunies sous LA PARADOXA SAS."
      reference="PAR-LEG-2026/V1"
      sections={sections}
    />
  );
}

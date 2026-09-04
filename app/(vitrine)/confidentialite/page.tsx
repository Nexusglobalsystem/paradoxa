import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../legal-template";

export const metadata: Metadata = {
  title: "Confidentialité — LA PARADOXA",
  description:
    "Politique de confidentialité LA PARADOXA : données collectées, finalités, durée de conservation, droits RGPD et cookies pour les Maisons SHÉA et ÉCLORÉE.",
};

const sections: LegalSection[] = [
  {
    id: "donnees-collectees",
    numeral: "I.",
    title: "Données collectées",
    content: (
      <p>
        LA PARADOXA applique un principe de sobriété numérique : seules les données
        nécessaires à la gestion de votre commande, de votre compte client ou de votre demande
        auprès de la conciergerie sont collectées — identité, coordonnées postales et
        électroniques, historique de commande, et préférences olfactives si vous choisissez de
        les renseigner.
      </p>
    ),
  },
  {
    id: "finalites",
    numeral: "II.",
    title: "Finalités du traitement",
    content: (
      <ul className="list-disc space-y-space-xs pl-space-lg">
        <li>Traitement et acheminement des commandes</li>
        <li>Gestion de la relation client et de la conciergerie</li>
        <li>Réponse aux demandes de sourcing et de partenariat</li>
        <li>Envoi de la newsletter, sur consentement explicite uniquement</li>
        <li>Obligations comptables et légales de conservation</li>
      </ul>
    ),
  },
  {
    id: "base-legale",
    numeral: "III.",
    title: "Base légale & absence de cession",
    content: (
      <p>
        Chaque traitement repose sur l&apos;exécution du contrat de vente, le consentement
        explicite (newsletter) ou une obligation légale (facturation). Vos données ne font
        l&apos;objet d&apos;aucune cession, revente ni profilage publicitaire auprès de tiers.
      </p>
    ),
  },
  {
    id: "conservation",
    numeral: "IV.",
    title: "Durée de conservation",
    content: (
      <p>
        Les données de compte client sont conservées pendant la durée de la relation
        commerciale, augmentée de trois ans à compter de la dernière interaction. Les pièces
        comptables sont archivées pendant dix ans, conformément à l&apos;article L. 123-22 du
        Code de commerce.
      </p>
    ),
  },
  {
    id: "droits",
    numeral: "V.",
    title: "Vos droits",
    content: (
      <>
        <p>
          Conformément au Règlement général sur la protection des données (RGPD), vous
          disposez d&apos;un droit d&apos;accès, de rectification, de portabilité, de
          limitation et d&apos;effacement de vos données, ainsi que du droit de retirer votre
          consentement à tout moment.
        </p>
        <p>
          Ces droits s&apos;exercent en écrivant à notre délégué à la protection des données à
          l&apos;adresse{" "}
          <a
            href="mailto:dpo@laparadoxa.com"
            className="font-medium text-encre-baobab underline decoration-or-karite/60 underline-offset-2 transition-colors duration-300 ease-out hover:text-terre-de-dakar"
          >
            dpo@laparadoxa.com
          </a>
          . Vous pouvez également introduire une réclamation auprès de la Commission Nationale
          de l&apos;Informatique et des Libertés (CNIL).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    numeral: "VI.",
    title: "Cookies & traceurs",
    content: (
      <p>
        Le site utilise des cookies strictement nécessaires à son fonctionnement (panier,
        session, préférences d&apos;affichage) et, sous réserve de votre consentement, des
        cookies de mesure d&apos;audience anonymisée. Aucun cookie publicitaire tiers
        n&apos;est déposé sans consentement préalable.
      </p>
    ),
  },
  {
    id: "contact-dpo",
    numeral: "VII.",
    title: "Contact du délégué à la protection des données",
    content: (
      <p>
        Pour toute question relative au traitement de vos données personnelles, notre délégué
        à la protection des données reste à votre disposition à l&apos;adresse{" "}
        <a
          href="mailto:dpo@laparadoxa.com"
          className="font-medium text-encre-baobab underline decoration-or-karite/60 underline-offset-2 transition-colors duration-300 ease-out hover:text-terre-de-dakar"
        >
          dpo@laparadoxa.com
        </a>
        .
      </p>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Cadre juridique"
      title="Confidentialité"
      intro="Nature des données collectées, finalités, durées de conservation et droits RGPD applicables sur laparadoxa.com."
      reference="PAR-RGPD-2026/V1"
      sections={sections}
    />
  );
}

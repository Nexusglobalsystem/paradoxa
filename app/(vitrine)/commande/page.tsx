import type { Metadata } from "next";

import { TunnelCommande } from "./tunnel-commande";

export const metadata: Metadata = {
  title: "Commande — LA PARADOXA",
  robots: { index: false }, // page transactionnelle, jamais indexée
};

export default function CommandePage() {
  return <TunnelCommande />;
}

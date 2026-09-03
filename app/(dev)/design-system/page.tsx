import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Système de design — LA PARADOXA",
  robots: { index: false, follow: false },
};

// Chaque entrée porte le nom de classe Tailwind en toutes lettres (jamais
// construit par interpolation) : le scanner de Tailwind a besoin de voir la
// chaîne littérale dans le fichier pour générer l'utilitaire correspondant.
const brandColors = [
  {
    name: "Encre Baobab",
    hex: "#1B2A23",
    usage: "Primaire sombre — gouvernance groupe, admin, densité",
    bg: "bg-encre-baobab",
    fg: "text-ivoire-bouye",
  },
  {
    name: "Terre de Dakar",
    hex: "#A94E2B",
    usage: "Accent principal SHÉA — actions commerce, terracotta",
    bg: "bg-terre-de-dakar",
    fg: "text-ivoire-bouye",
  },
  {
    name: "Ocre Solaire",
    hex: "#C98A2E",
    usage: "SHÉA secondaire — hover, chaleur solaire",
    bg: "bg-ocre-solaire",
    fg: "text-encre-baobab",
  },
  {
    name: "Or Karité",
    hex: "#D9B26A",
    usage: "Détail métallique — filets, icônes, accent, jamais en aplat large",
    bg: "bg-or-karite",
    fg: "text-encre-baobab",
  },
  {
    name: "Vert Moringa",
    hex: "#4F7F46",
    usage: "Accent principal ÉCLORÉE — états valides, botanique",
    bg: "bg-vert-moringa",
    fg: "text-ivoire-bouye",
  },
  {
    name: "Sauge Claire",
    hex: "#8CA37B",
    usage: "ÉCLORÉE secondaire",
    bg: "bg-sauge-claire",
    fg: "text-encre-baobab",
  },
  {
    name: "Rouge Bissap",
    hex: "#8E2C3B",
    usage: "Alertes, non-conformité IFRA, rupture de stock",
    bg: "bg-rouge-bissap",
    fg: "text-ivoire-bouye",
  },
  {
    name: "Ivoire Bouye",
    hex: "#F4EFE3",
    usage: "Fond principal — chaleur, jamais de blanc clinique",
    bg: "bg-ivoire-bouye",
    fg: "text-encre-baobab",
  },
  {
    name: "Sable",
    hex: "#E3DACA",
    usage: "Surface secondaire, structure, dividers",
    bg: "bg-sable",
    fg: "text-encre-baobab",
  },
] as const;

const surfaceColors = [
  { name: "surface-container-lowest", bg: "bg-surface-container-lowest" },
  { name: "surface-container-low", bg: "bg-surface-container-low" },
  { name: "surface-container", bg: "bg-surface-container" },
  { name: "surface-container-high", bg: "bg-surface-container-high" },
  { name: "surface-container-highest", bg: "bg-surface-container-highest" },
  { name: "surface-dim", bg: "bg-surface-dim" },
] as const;

const maisons = [
  {
    key: "groupe",
    label: "Groupe",
    description: "Portail, manifeste, admin, pages légales — encre profonde et or.",
  },
  {
    key: "shea",
    label: "Maison SHÉA",
    description: "Haute parfumerie — nocturne, dense, terracotta.",
  },
  {
    key: "ecloree",
    label: "Maison ÉCLORÉE",
    description: "Soin naturel — clair, aéré, karité et moringa.",
  },
] as const;

const typeScale = [
  { name: "display-hero", family: "font-display", cls: "text-display-hero", spec: "56 / 64 · 300" },
  { name: "headline-lg", family: "font-display", cls: "text-headline-lg", spec: "40 / 48 · 300" },
  { name: "headline-md", family: "font-display", cls: "text-headline-md", spec: "28 / 36 · 300" },
  { name: "headline-sm", family: "font-display", cls: "text-headline-sm", spec: "22 / 30 · 300" },
  { name: "title-editorial", family: "font-display", cls: "text-title-editorial", spec: "18 / 26 · 300" },
  { name: "body-reading", family: "font-interface", cls: "text-body-reading", spec: "16 / 28 · 400" },
  { name: "body-ui", family: "font-interface", cls: "text-body-ui", spec: "14 / 22 · 400" },
  { name: "label-tabular", family: "font-interface", cls: "text-label-tabular", spec: "13 / 18 · 500 · tabular" },
  { name: "caption-meta", family: "font-interface", cls: "text-caption-meta", spec: "12 / 16 · 400" },
] as const;

const spacingScale = [
  { name: "space-xxs", value: "0.25rem", cls: "w-space-xxs" },
  { name: "space-xs", value: "0.5rem", cls: "w-space-xs" },
  { name: "space-sm", value: "0.75rem", cls: "w-space-sm" },
  { name: "space-md", value: "1rem", cls: "w-space-md" },
  { name: "space-lg", value: "1.5rem", cls: "w-space-lg" },
  { name: "space-xl", value: "2.5rem", cls: "w-space-xl" },
  { name: "space-2xl", value: "4rem", cls: "w-space-2xl" },
  { name: "space-3xl", value: "6rem", cls: "w-space-3xl" },
  { name: "space-plinth", value: "8rem", cls: "w-space-plinth" },
] as const;

const radiusScale = [
  { name: "rounded", value: "0.25rem", cls: "rounded" },
  { name: "rounded-lg", value: "0.5rem", cls: "rounded-lg" },
  { name: "rounded-xl", value: "0.75rem", cls: "rounded-xl" },
  { name: "rounded-full", value: "9999px", cls: "rounded-full" },
] as const;

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="reading-max flex flex-col gap-space-xxs">
      <span className="font-interface text-caption-meta text-maison-primary-strong">{eyebrow}</span>
      <h2 className="font-display text-headline-md text-encre-baobab">{title}</h2>
      {description ? (
        <p className="font-interface text-body-reading text-on-surface-variant">{description}</p>
      ) : null}
    </div>
  );
}

function PrimitivesShowcase() {
  return (
    <div className="flex flex-col gap-space-xl">
      {/* Boutons */}
      <div className="flex flex-col gap-space-sm">
        <span className="font-interface text-caption-meta text-on-surface-variant">Boutons</span>
        <div className="flex flex-wrap items-center gap-space-sm">
          <Button variant="primary">Action primaire</Button>
          <Button variant="outline">Action secondaire</Button>
          <Button variant="ghost">Action discrète</Button>
          <Button variant="danger">Rompre le stock</Button>
          <Button variant="primary" disabled>
            Désactivé
          </Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-col gap-space-sm">
        <span className="font-interface text-caption-meta text-on-surface-variant">Badges</span>
        <div className="flex flex-wrap items-center gap-space-sm">
          <Badge variant="neutral">En préparation</Badge>
          <Badge variant="accent">Édition limitée</Badge>
          <Badge variant="success">Conforme IFRA</Badge>
          <Badge variant="danger">Rupture de stock</Badge>
          <Badge variant="outline">Origine Sénégal</Badge>
        </div>
      </div>

      {/* Carte + table + accordéon */}
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bois de Shéa — Extrait Pur</CardTitle>
            <CardDescription>Archive de formulation n° 4702 · Lot 084-B</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-interface text-body-ui text-on-surface-variant">
              Trois strates olfactives réparties selon la proportion d’or (19 % tête,
              31 % cœur, 50 % fond).
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="primary" size="sm">
              Ouvrir la formule
            </Button>
            <Button variant="ghost" size="sm">
              Dupliquer
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conciergerie — questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem open>
                <AccordionTrigger>Quel est le délai de livraison ?</AccordionTrigger>
                <AccordionContent>
                  Dakar et Paris sous 48 h ; reste du monde sous 5 à 8 jours ouvrés.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem>
                <AccordionTrigger>Puis-je faire graver mon flacon ?</AccordionTrigger>
                <AccordionContent>
                  Oui, la gravure est offerte sur les éditions numérotées SHÉA.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem>
                <AccordionTrigger>Les formules sont-elles conformes IFRA ?</AccordionTrigger>
                <AccordionContent>
                  Chaque formule est vérifiée au 51ᵉ amendement avant mise en lot.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Table dense avec chiffres tabulaires */}
      <div className="flex flex-col gap-space-sm">
        <span className="font-interface text-caption-meta text-on-surface-variant">
          Table — formulation (chiffres tabulaires obligatoires)
        </span>
        <Card className="overflow-hidden">
          <Table>
            <TableCaption>Extrait de la fiche de pesée — Bois de Shéa, lot 084-B.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Strate</TableHead>
                <TableHead>Matière première</TableHead>
                <TableHead numeric>Part %</TableHead>
                <TableHead numeric>Coût</TableHead>
                <TableHead>IFRA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge variant="accent">Tête</Badge>
                </TableCell>
                <TableCell>Mandarine sanguine</TableCell>
                <TableCell numeric>7.50 %</TableCell>
                <TableCell numeric>0.56 €</TableCell>
                <TableCell>
                  <Badge variant="success">Conforme</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="accent">Cœur</Badge>
                </TableCell>
                <TableCell>Absolue de jasmin de nuit</TableCell>
                <TableCell numeric>18.20 %</TableCell>
                <TableCell numeric>4.12 €</TableCell>
                <TableCell>
                  <Badge variant="success">Conforme</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="accent">Fond</Badge>
                </TableCell>
                <TableCell>Beurre de karité sauvage</TableCell>
                <TableCell numeric>32.00 %</TableCell>
                <TableCell numeric>2.88 €</TableCell>
                <TableCell>
                  <Badge variant="danger">À vérifier</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Champs de formulaire */}
      <div className="flex flex-col gap-space-sm">
        <span className="font-interface text-caption-meta text-on-surface-variant">
          Champs de formulaire
        </span>
        <Card>
          <CardContent className="grid grid-cols-1 gap-space-lg md:grid-cols-2">
            <Field id="demo-nom" label="Nom du destinataire" required>
              <Input placeholder="Aïcha Diallo" />
            </Field>
            <Field id="demo-prix" label="Prix flacon (100 ml)" helperText="Chiffres tabulaires forcés.">
              <Input numeric defaultValue="420,00 €" />
            </Field>
            <Field
              id="demo-lot"
              label="Numéro de lot"
              errorText="Format attendu : LP-AAAA-NOM-000."
            >
              <Input defaultValue="LP2025FERLO" invalid />
            </Field>
            <Field id="demo-message" label="Demande particulière de sillage" className="md:col-span-2">
              <Textarea placeholder="Ex. macération prolongée pour climat chaud…" />
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="paper-grain flex flex-col gap-space-3xl bg-ivoire-bouye px-space-lg py-space-2xl lg:px-space-2xl">
      <header className="reading-max flex flex-col gap-space-sm">
        <span className="font-interface text-caption-meta text-maison-primary-strong">
          Page de développement — hors navigation publique
        </span>
        <h1 className="font-display text-display-hero-mobile text-encre-baobab lg:text-display-hero">
          Système de design
        </h1>
        <p className="font-interface text-body-reading text-on-surface-variant">
          Vague 0 : tokens et primitives câblés dans Tailwind v4 (CSS-first), source de vérité{" "}
          <code className="font-label-tabular text-label-tabular text-terre-de-dakar">
            /design/tokens.json
          </code>
          . Un seul jeu de composants ; la bascule visuelle par maison se fait par l’attribut{" "}
          <code className="font-label-tabular text-label-tabular text-terre-de-dakar">
            data-maison
          </code>{" "}
          sur un conteneur, jamais par duplication.
        </p>
      </header>

      {/* ── Couleurs de marque ─────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="01 — Couleur"
          title="Palette de marque"
          description="Les 9 couleurs de marque, telles que définies dans tokens.json → color.brand. Le thème Material 3 résiduel de Stitch (~25-30 tokens surface-tint / primary-fixed-* / error-container) a été élagué : voir le rapport de l'agent."
        />
        <div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 lg:grid-cols-5">
          {brandColors.map((c) => (
            <div key={c.name} className="flex flex-col gap-space-xs">
              <div
                className={`${c.bg} ${c.fg} flex h-24 flex-col justify-end rounded-lg p-space-sm shadow-ambient`}
              >
                <span className="font-label-tabular text-label-tabular">{c.hex}</span>
              </div>
              <span className="font-interface text-body-ui text-encre-baobab">{c.name}</span>
              <span className="font-interface text-caption-meta text-on-surface-variant">
                {c.usage}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Surfaces ───────────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="01 — Couleur"
          title="Surfaces"
          description="Fonds neutres, invariants par maison : le canevas Ivoire Bouye reste le même partout, seul l'accent change."
        />
        <div className="grid grid-cols-3 gap-space-md sm:grid-cols-6">
          {surfaceColors.map((s) => (
            <div key={s.name} className="flex flex-col gap-space-xs">
              <div className={`${s.bg} h-16 rounded-lg border border-outline-variant/40`} />
              <span className="font-interface text-caption-meta text-on-surface-variant">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rôles de maison ────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="02 — Thème"
          title="Trois maisons, un seul jeu de composants"
          description="Chaque bloc ci-dessous porte data-maison sur son conteneur. Les primitives (Button, Badge, Input, Accordion…) lisent --color-maison-primary / -primary-strong / -accent : leur code ne change jamais."
        />
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-3">
          {maisons.map((m) => (
            <div
              key={m.key}
              data-maison={m.key}
              className="flex flex-col gap-space-md rounded-xl border border-outline-variant/40 bg-surface-container-low p-space-lg"
            >
              <div className="flex flex-col gap-space-xxs">
                <span className="font-display text-title-editorial text-encre-baobab">
                  {m.label}
                </span>
                <span className="font-interface text-caption-meta text-on-surface-variant">
                  {m.description}
                </span>
              </div>
              <div className="flex gap-space-xs">
                <div className="h-10 flex-1 rounded bg-maison-primary" title="maison-primary" />
                <div
                  className="h-10 flex-1 rounded bg-maison-primary-strong"
                  title="maison-primary-strong"
                />
                <div className="h-10 flex-1 rounded bg-maison-accent" title="maison-accent" />
              </div>
              <div className="flex flex-wrap gap-space-xs">
                <Button variant="primary" size="sm">
                  Action
                </Button>
                <Button variant="outline" size="sm">
                  Découvrir
                </Button>
                <Badge variant="accent">Accent</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Typographie ────────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="03 — Typographie"
          title="Fraunces 300 & Inter"
          description="Fraunces en display (poids 300 exclusivement), Inter en interface. Sentence case partout : jamais de tout-majuscule ni d'eyebrow espacé au-dessus des titres."
        />
        <div className="flex flex-col divide-y divide-outline-variant/40">
          {typeScale.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-space-xxs py-space-md sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className={`${t.family} ${t.cls} text-encre-baobab`}>
                {t.name === "label-tabular" ? "1 250,40 € · 32 % · 18,5 g" : "Bois de Shéa"}
              </span>
              <span className="font-label-tabular text-label-tabular text-on-surface-variant">
                {t.name} · {t.spec}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Espacement ─────────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="04 — Structure"
          title="Échelle d'espacement"
          description="Utilitaires p-/m-/gap-space-* — noms alignés sur les classes réellement dessinées par Stitch."
        />
        <div className="flex flex-col gap-space-xs">
          {spacingScale.map((s) => (
            <div key={s.name} className="flex items-center gap-space-md">
              <span className="w-28 shrink-0 font-label-tabular text-label-tabular text-on-surface-variant">
                {s.name}
              </span>
              <div className={`${s.cls} h-3 rounded-full bg-terre-de-dakar`} />
              <span className="font-label-tabular text-label-tabular text-on-surface-variant">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rayons ─────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="04 — Structure"
          title="Rayons de bordure"
          description="Coins doux, pas d'aplomb strict — décision Phase 0 validée. L'échelle par défaut de Tailwind v4 correspond déjà exactement à design/tokens.json → radius, aucune surcharge n'a été nécessaire."
        />
        <div className="flex flex-wrap items-end gap-space-lg">
          {radiusScale.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-space-xs">
              <div className={`${r.cls} h-20 w-20 bg-encre-baobab`} />
              <span className="font-label-tabular text-label-tabular text-on-surface-variant">
                {r.name} · {r.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proportions φ ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="04 — Structure"
          title="Proportions du nombre d'or (φ)"
          description="19 % tête / 31 % cœur / 50 % fond — strates olfactives du composeur de parfum. Largeurs réelles dérivées de la formule ; valeurs par défaut exposées via --phi-top / --phi-heart / --phi-base."
        />
        <div className="flex h-6 w-full overflow-hidden rounded-full">
          <div className="h-full bg-sauge-claire" style={{ width: "var(--phi-top)" }} />
          <div className="h-full bg-ocre-solaire" style={{ width: "var(--phi-heart)" }} />
          <div className="h-full bg-encre-baobab" style={{ width: "var(--phi-base)" }} />
        </div>
      </section>

      {/* ── Mouvement & élévation ──────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="05 — Mouvement"
          title="Durées, easing, élévation"
          description="duration-300 (transition de couleur), duration-500 (révélation d'image), duration-700 (expansion au survol) — toutes ease-out, jamais de rebond. Survolez le panneau : prefers-reduced-motion neutralise la transition."
        />
        <div className="flex flex-wrap items-center gap-space-lg">
          <div className="group h-24 w-40 overflow-hidden rounded-lg bg-surface-container-high">
            <div className="h-full w-full origin-left scale-x-75 bg-terre-de-dakar transition-transform duration-700 ease-out group-hover:scale-x-100" />
          </div>
          <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-surface-container-lowest shadow-ambient">
            <span className="font-label-tabular text-label-tabular text-on-surface-variant">
              shadow-ambient
            </span>
          </div>
        </div>
      </section>

      {/* ── Primitives ─────────────────────────────────────────────── */}
      <section className="flex flex-col gap-space-lg">
        <SectionTitle
          eyebrow="06 — Primitives"
          title="Composants de /components/ui"
          description="Button, Badge, Card, Accordion, Table, Field/Input/Textarea — Server Components par défaut (l'accordéon est un <details> natif, sans JavaScript)."
        />
        <PrimitivesShowcase />
      </section>
    </main>
  );
}

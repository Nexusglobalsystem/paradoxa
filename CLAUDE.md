# LA PARADOXA

Groupe de beauté. Deux maisons : SHÉA (parfum de niche, récit de voyage africain) et
ÉCLORÉE (soin naturel, karité et moringa). Le site est à la fois vitrine, boutique
et laboratoire de formulation privé.

## Stack

- Next.js 16, App Router, React 19, TypeScript strict
- Tailwind CSS v4 + shadcn/ui, tokens issus de /design/tokens.json
- Supabase : Postgres, Auth, Storage, RLS, Edge Functions
- Stripe Checkout (+ Wave / Orange Money pour le Sénégal)
- Zod pour toute validation, TanStack Query côté client
- Vitest (unitaire), Playwright (e2e), axe-core (accessibilité)
- Déploiement Vercel

## Structure

/app
  /(vitrine)        pages publiques et éditoriales
  /(boutique)       collection, produit, panier, checkout, compte
  /(admin)          back-office, protégé par rôle
    /laboratoire    composeurs parfum et cosmétique
/api                route handlers
/packages
  /formulation      moteur φ, IFRA, INCI — TypeScript pur, zéro dépendance UI
/components
  /ui               primitives shadcn adaptées aux tokens
  /vitrine /boutique /admin
/supabase
  /migrations       SQL versionné
  /functions        edge functions
/design
  INVENTAIRE.md     correspondance écran Stitch → route (Phase 0, validé)
  tokens.json       source de vérité visuelle (Phase 0, validé)

## Règles non négociables

1. **Le moteur de formulation est du TypeScript pur.** Il vit dans /packages/formulation,
   il est testé unitairement à 100 %, il n'importe rien de React. Les formules sont l'actif
   le plus précieux du groupe.
2. **RLS sur toutes les tables.** Les tables du laboratoire (matieres, formules,
   formule_lignes, lots) ne sont accessibles qu'au rôle admin. Aucune formule ne transite
   jamais vers un client public.
3. **Server Components par défaut.** `use client` seulement quand il y a état ou interaction.
4. **Aucune valeur visuelle en dur.** Les couleurs, tailles et espacements viennent des tokens.
   Un hex écrit à la main dans un composant est un bug.
5. **Le français est la langue du produit.** Interface, contenu, messages d'erreur. Le code et
   les commentaires sont en anglais.
6. **Pas de secret côté client.** Clé service Supabase, clé Stripe, clé Anthropic : serveur
   uniquement, via route handlers ou edge functions.
7. **Accessibilité au niveau AA.** Contraste, focus visible, navigation clavier, `prefers-reduced-motion`
   respecté. C'est un critère d'acceptation, pas une amélioration.

## Direction artistique

Chaleureuse, texturée, cinématographique — l'atelier d'un parfumeur à Dakar à l'heure dorée.
SHÉA est sombre, dense, terracotta. ÉCLORÉE est claire, aérée, ivoire et verte. Le groupe est
encre profonde et or. Typographie Fraunces en display, Inter en interface, chiffres tabulaires.
Mouvement lent, révélations à l'encre, jamais de rebond.

**Rayons de bordure : coins doux, pas d'aplomb strict.** Les 40 maquettes Stitch utilisent
`rounded-lg` / `rounded-xl` / `rounded-full` de façon cohérente (cartes, panneaux labo, pills,
avatars) — c'est le parti pris visuel réel malgré une description texte contradictoire dans
l'export Stitch. On suit la maquette, pas le texte. Échelle dans `design/tokens.json → radius`.

Avant tout travail d'interface : invoquer la skill frontend-design.

## Commandes

- `pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint`
- `pnpm test` (Vitest) · `pnpm e2e` (Playwright)
- `pnpm db:migrate` · `pnpm db:types` (régénère les types Supabase)

## Définition de « terminé »

Typecheck vert, lint vert, tests verts, build vert, accessibilité vérifiée,
et l'écran comparé visuellement à sa maquette Stitch (`/stitch_la_paradoxa/<écran>/screen.png`,
correspondance dans `/design/INVENTAIRE.md`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

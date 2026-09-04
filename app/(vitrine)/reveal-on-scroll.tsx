"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Révélation douce au défilement (fade + léger déplacement vertical) pour
 * les sections qui n'ont pas déjà leur propre mouvement — voir l'usage dans
 * app/(vitrine)/page.tsx (manifeste, éditions signatures, newsletter ; le
 * hero deux-portes a déjà son propre jeu d'expansion au survol et n'est pas
 * enveloppé ici).
 *
 * IntersectionObserver minimal plutôt qu'une librairie d'animation : un seul
 * déclenchement par section (l'observer se déconnecte après la première
 * intersection), jamais de rejoue en repassant devant la section — cohérent
 * avec la direction artistique ("mouvement lent, révélations à l'encre,
 * jamais de rebond", CLAUDE.md).
 *
 * ── prefers-reduced-motion ───────────────────────────────────────────────
 * Déjà neutralisé globalement par app/design-tokens.css, qui force
 * `transition-duration: 0.01ms !important` sur tout le document sous cette
 * préférence. On s'appuie entièrement sur cette règle existante plutôt que
 * de la redupliquer ici : les classes ci-dessous sont de simples utilitaires
 * Tailwind (`duration-700`, jamais de valeur en dur type `style={{transition:
 * "700ms"}}` qui pourrait contourner une règle !important de feuille de
 * style) — la transition est donc automatiquement instantanée pour les
 * utilisateurs qui demandent moins de mouvement, sans code additionnel.
 */
export function RevealOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Repli défensif : un environnement sans IntersectionObserver ne doit
    // jamais laisser la section invisible indéfiniment. setVisible est
    // différé d'une frame (plutôt qu'appelé en synchrone dans le corps de
    // l'effet) pour rester un déclenchement asynchrone comme celui de
    // l'observer plus bas — react-hooks/set-state-in-effect proscrit un
    // setState synchrone direct dans un effet.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

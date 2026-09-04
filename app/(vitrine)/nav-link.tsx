"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Seule partie du header qui a besoin d'être Client Component : connaître
 * l'URL courante pour souligner le lien actif (état "hover:text-encre-baobab
 * font-medium border-b border-or-karite" de la maquette). Le reste de
 * app/(vitrine)/layout.tsx reste un Server Component.
 */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const actif = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={cn(
        "font-interface text-body-ui tracking-wide transition-colors duration-300 ease-out",
        actif
          ? "border-b border-or-karite pb-1 font-medium text-encre-baobab"
          : "text-on-surface-variant hover:text-encre-baobab",
      )}
    >
      {children}
    </Link>
  );
}

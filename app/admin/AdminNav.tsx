"use client";

import { usePathname } from "next/navigation";
import type { Role } from "@/lib/admin-session";
import styles from "./admin.module.css";

const LINKS: { href: string; label: string; adminOnly?: boolean }[] = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/parametres", label: "Paramètres", adminOnly: true },
];

export default function AdminNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const links = LINKS.filter((link) => !link.adminOnly || role === "admin");

  return (
    <nav className={styles.nav} aria-label="Administration">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
          aria-current={pathname === link.href ? "page" : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

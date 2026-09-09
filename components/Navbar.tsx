"use client";

import { useState } from "react";
import Image from "next/image";
import { siteInfo } from "@/lib/data";
import { logoUrl } from "@/lib/images";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "#apropos", label: "À propos" },
  { href: "#prestations", label: "Prestations" },
  { href: "#processus", label: "Processus" },
  { href: "#galerie", label: "Galerie" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={styles.navbar}>
      <a href="#accueil" className={styles.brand} onClick={closeMenu}>
        <Image
          src={logoUrl}
          alt={`${siteInfo.name} - ${siteInfo.tagline}`}
          width={110}
          height={75}
          className={styles.brandLogo}
          priority
        />
      </a>

      <div className={styles.links}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
        <a href="#contact" className={styles.contactButton}>
          Contact
        </a>
      </div>

      <button
        type="button"
        className={`${styles.burger} ${isOpen ? styles.burgerOpen : ""}`}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.mobileLink}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
        <a href="#contact" className={styles.mobileContactButton} onClick={closeMenu}>
          Contact
        </a>
      </div>
    </nav>
  );
}

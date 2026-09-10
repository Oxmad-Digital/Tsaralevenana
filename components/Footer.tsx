import FloralSprig from "./FloralSprig";
import { siteInfo } from "@/lib/data";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.ornament}>
        <span className={styles.lineLeft} />
        <FloralSprig className={styles.icon} />
        <span className={styles.lineRight} />
      </div>
      <div className={styles.eyebrow}>{siteInfo.tagline}</div>
      <div className={styles.name}>{siteInfo.name}</div>
      <p className={styles.slogan}>{siteInfo.slogan}</p>
      <p className={styles.copyright}>
        © {year} {siteInfo.tagline} {siteInfo.name} — Tous droits réservés.
        {" — "}
        <a href="/mentions-legales" className={styles.legalLink}>
          Mentions légales
        </a>
      </p>
      <p className={styles.credit}>
        Réalisé par{" "}
        <a
          href="https://www.oxmad-digital.mg/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={styles.creditLink}
        >
          Oxmad Digital
        </a>
      </p>
    </footer>
  );
}

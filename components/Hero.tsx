import Image from "next/image";
import FloralSprig from "./FloralSprig";
import { siteInfo } from "@/lib/data";
import { heroUrl } from "@/lib/images";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="accueil" className={styles.hero}>
      <Image
        src={heroUrl}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className={styles.backgroundImage}
      />
      <div aria-hidden="true" className={styles.backgroundGradient} />
      <div className={styles.content}>
        <div className={styles.ornament}>
          <span className={styles.ornamentLineLeft} />
          <FloralSprig className={styles.ornamentIcon} />
          <span className={styles.ornamentLineRight} />
        </div>
        <p className={styles.eyebrow}>
          {siteInfo.tagline} · {siteInfo.city}
        </p>
        <h1 className={styles.title}>{siteInfo.name}</h1>
        <p className={styles.slogan}>{siteInfo.slogan}</p>
        <div className={styles.actions}>
          <a href="#prestations" className={styles.primaryButton}>
            Nos prestations
          </a>
          <a href="#contact" className={styles.secondaryButton}>
            Nous contacter
          </a>
        </div>
        <a href="#apropos" className={styles.scrollHint}>
          Découvrir
          <span className={styles.scrollLine} />
        </a>
      </div>
    </section>
  );
}

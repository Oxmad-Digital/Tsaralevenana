"use client";

import { useState } from "react";
import { mapConfigs, siteInfo } from "@/lib/data";
import styles from "./MapSection.module.css";

export default function MapSection() {
  const [activeMapIndex, setActiveMapIndex] = useState(0);

  const activeMap = mapConfigs[activeMapIndex];
  const otherMapIndex = activeMapIndex === 0 ? 1 : 0;
  const otherMap = mapConfigs[otherMapIndex];

  return (
    <section className={styles.mapSection}>
      <div className={styles.grid}>
        <div className={styles.panel}>
          <p className="eyebrow">Où nous trouver</p>
          <h2 className={styles.title}>
            {siteInfo.city},
            <br />
            {siteInfo.country}
          </h2>
          <div className={styles.rule} />
          <p className={styles.description}>
            Nous intervenons dans toute la région d&apos;{siteInfo.city}.
            Prenez rendez-vous ou rendez-nous visite pour échanger en toute
            sérénité.
          </p>
          <div className={styles.actions}>
            <a
              href={activeMap.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              Ouvrir dans Google Maps
            </a>
            <button
              type="button"
              onClick={() => setActiveMapIndex(otherMapIndex)}
              className={styles.switchButton}
            >
              ↺ {otherMap.name}
            </button>
          </div>
        </div>
        <div className={styles.mapWrapper}>
          <iframe
            title={`Carte ${siteInfo.city}`}
            src={activeMap.embedUrl}
            loading="lazy"
            className={styles.iframe}
          />
        </div>
      </div>
    </section>
  );
}

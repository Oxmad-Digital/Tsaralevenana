"use client";

import { useState } from "react";
import { images } from "@/lib/images";
import PhotoFrame from "./PhotoFrame";
import styles from "./Gallery.module.css";

const extraPhotos = [
  {
    src: images.IMG_2217,
    key: "IMG_2217",
    alt: "Aménagement de la tente de réception pour les proches",
  },
  {
    src: images.MG_1797_DxO,
    key: "MG_1797_DxO",
    alt: "Table du service traiteur avec boissons pour les invités",
  },
  {
    src: images.MG_1835_DxO,
    key: "MG_1835_DxO",
    alt: "Personnel de Tsaralevenana préparant la table de cérémonie",
  },
];

export default function Gallery() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="galerie" className={styles.gallery}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">En images</p>
          <h2 className="sectionTitle">Galerie photos</h2>
        </div>
        <div className={styles.grid}>
          <PhotoFrame
            src={images["450A0185"]}
            alt="Façade extérieure de la Maison Funéraire Tsaralevenana à Antananarivo"
            className={styles.tall}
          />
          <PhotoFrame
            src={images["450A9857"]}
            alt="Salle de veillée avec sièges à la Maison Funéraire Tsaralevenana"
            className={styles.square}
          />
          <PhotoFrame
            src={images["450A9885_1"]}
            alt="Intérieur de la salle de cérémonie avec éclairage d'ambiance"
            className={styles.square}
          />
          <PhotoFrame
            src={images.MG_1665_DxO_1}
            alt="Véhicules de transport funéraire de Tsaralevenana"
            className={styles.square}
          />
          <PhotoFrame
            src={images.IMG_2217_1}
            alt="Espace traiteur sous tente avec tables dressées pour la réception"
            className={styles.wide}
          />
          {showMore &&
            extraPhotos.map((photo) => (
              <PhotoFrame
                key={photo.key}
                src={photo.src}
                alt={photo.alt}
                className={styles.square}
              />
            ))}
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className={styles.more}
            aria-label={showMore ? "Voir moins de photos" : "Voir plus de photos"}
          >
            <span className={styles.morePlus}>{showMore ? "−" : "+"}</span>
            <span className={styles.moreLabel}>
              {showMore ? "Voir moins" : "Voir plus"}
            </span>
          </button>
        </div>
        <p className={styles.hint}>
          Glissez vos photos directement dans les cadres pour personnaliser
          la galerie.
        </p>
      </div>
    </section>
  );
}

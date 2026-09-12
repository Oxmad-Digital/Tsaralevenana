import { processSteps } from "@/lib/data";
import { images } from "@/lib/images";
import PhotoFrame from "./PhotoFrame";
import styles from "./Process.module.css";

export default function Process() {
  return (
    <section id="processus" className={styles.process}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">Étape par étape</p>
          <h2 className="sectionTitle">Notre processus</h2>
        </div>
        <div className={styles.grid}>
          <div className={styles.steps}>
            {processSteps.map((step) => (
              <div key={step.numeral} className={styles.step}>
                <div className={styles.stepNumeral}>{step.numeral}</div>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
            <div className={styles.stepDivider} />
          </div>
          <div className={styles.imageWrapper}>
            <div className={styles.cornerTopRight} />
            <div className={styles.cornerBottomLeft} />
            <PhotoFrame
              src={images.miseEnBiere}
              alt="Étapes d'accompagnement de la Maison Funéraire Tsaralevenana"
              className={styles.photo}
              sizes="(max-width: 800px) 100vw, 570px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

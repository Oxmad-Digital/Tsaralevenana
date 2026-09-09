import PhotoFrame from "./PhotoFrame";
import { images } from "../lib/images";
import styles from "./About.module.css";

const stats = [
  { value: "24/7", label: "Disponibilité" },
  { value: "7", label: "Prestations" },
  { value: "100%", label: "Sur mesure" },
];

export default function About() {
  return (
    <section id="apropos" className={styles.about}>
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          <div className={styles.cornerTopRight} />
          <div className={styles.cornerBottomLeft} />
          <PhotoFrame
            src={images.MG_1931_DxO}
            alt="L'équipe de la Maison Funéraire Tsaralevenana"
            className={styles.photo}
          />
        </div>
        <div>
          <p className="eyebrow">Qui sommes-nous</p>
          <h2 className="sectionTitle">
            Un accompagnement
            <br />
            digne et bienveillant
          </h2>
          <div className={styles.rule} />
          <p className={styles.paragraph}>
            La Maison Funéraire Tsaralevenana accompagne les familles
            d&apos;Antananarivo avec respect, discrétion et un soin du détail
            irréprochable. Dans les moments les plus difficiles, notre équipe
            se tient à vos côtés pour organiser chaque hommage avec dignité.
          </p>
          <p className={styles.paragraph}>
            De l&apos;organisation des obsèques au rapatriement, nous prenons
            en charge l&apos;ensemble des démarches afin que vous puissiez
            vous consacrer pleinement à la mémoire de votre proche.
          </p>
          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

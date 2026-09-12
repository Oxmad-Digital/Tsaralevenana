import { locations } from "@/lib/data";
import { images } from "@/lib/images";
import PhotoFrame from "./PhotoFrame";
import styles from "./Locations.module.css";

const locationPhotos: Record<string, string> = {
  "Premier emplacement": images.emplacement1,
  "Deuxième emplacement": images.emplacement2,
};

const locationPhotoAlts: Record<string, string> = {
  "Premier emplacement":
    "Façade du premier emplacement de la Maison Funéraire Tsaralevenana, Antananarivo",
  "Deuxième emplacement":
    "Façade du deuxième emplacement de la Maison Funéraire Tsaralevenana, Antananarivo",
};

export default function Locations() {
  return (
    <section id="emplacements" className={styles.locations}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">Où nous trouver</p>
          <h2 className="sectionTitle">Nos emplacements</h2>
        </div>
        <div className={styles.grid}>
          {locations.map((location) => (
            <div key={location.name} className={styles.card}>
              <PhotoFrame
                src={locationPhotos[location.name]}
                alt={locationPhotoAlts[location.name]}
                placeholder="Photo de l'emplacement"
                className={styles.photo}
                sizes="(max-width: 800px) 78vw, 460px"
              />
              <div className={styles.details}>
                <div className={styles.tag}>{location.tag}</div>
                <h3 className={styles.name}>{location.name}</h3>
                <div className={styles.rule} />
                <p className={styles.address}>{location.address}</p>
                <p className={styles.phone}>{location.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

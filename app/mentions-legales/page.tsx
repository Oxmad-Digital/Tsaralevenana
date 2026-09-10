import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/components/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Mentions légales | Maison Funéraire Tsaralevenana",
  description: "Mentions légales du site de la Maison Funéraire Tsaralevenana.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={`sectionTitle ${styles.title}`}>Mentions légales</h1>
        <p className={styles.updated}>Dernière mise à jour : 10 septembre 2026</p>

        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Éditeur du site</h2>
          <p>
            Nom de l&apos;entreprise : Maison Funéraire Tsaralevenana
            <br />
            Forme juridique :{" "}
            <span className={styles.placeholder}>à compléter</span>
            <br />
            Siège social :{" "}
            <span className={styles.placeholder}>à compléter</span>
            <br />
            NIF :{" "}
            <span className={styles.placeholder}>à compléter</span>
            <br />
            STAT :{" "}
            <span className={styles.placeholder}>à compléter</span>
            <br />
            Téléphone : +261 33 09 760 96
            <br />
            Email : Tsaralevenana.tana@gmail.com
            <br />
            Directeur de publication : My&apos;Tamby Zafindrakoto
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            <br />
            Site web : vercel.com
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Propriété intellectuelle</h2>
          <p className={styles.placeholder}>
            Informations à compléter concernant les droits sur les contenus,
            textes, images et éléments graphiques du site.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Données personnelles</h2>
          <p className={styles.placeholder}>
            Informations à compléter concernant la collecte et le traitement
            des données transmises via le formulaire de contact.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Contact</h2>
          <p>
            Pour toute question relative au site ou à ces mentions légales,
            vous pouvez nous contacter au +261 33 09 760 96 ou par email à
            Tsaralevenana.tana@gmail.com.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { siteInfo } from "@/lib/data";
import { logoUrl } from "@/lib/images";
import { getMaintenanceSettings } from "@/lib/settings";
import styles from "./maintenance.module.css";

export const metadata: Metadata = {
  title: "Site en travaux",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const DEFAULT_MESSAGE =
  "Notre site est en cours de mise à jour et sera de nouveau disponible très prochainement.";

// Served by the middleware in place of any public page while maintenance is on.
export default async function MaintenancePage() {
  noStore();
  const { message } = await getMaintenanceSettings();

  return (
    <main className={styles.page} id="contenu">
      <div className={styles.card}>
        <Image src={logoUrl} alt={siteInfo.name} width={76} height={52} className={styles.logo} />
        <p className={styles.eyebrow}>
          {siteInfo.tagline} {siteInfo.name}
        </p>
        <h1 className={styles.title}>Site en travaux</h1>
        <p className={styles.message}>{message || DEFAULT_MESSAGE}</p>
        <div className={styles.contact}>
          <span className={styles.contactLabel}>Nous restons joignables 24h/24</span>
          <a href={siteInfo.phoneHref} className={styles.phone}>
            {siteInfo.phone}
          </a>
          <a href={`mailto:${siteInfo.email}`} className={styles.email}>
            {siteInfo.email}
          </a>
        </div>
      </div>
    </main>
  );
}

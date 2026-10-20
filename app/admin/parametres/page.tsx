import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-session";
import { getMaintenanceSettings, MAINTENANCE_MESSAGE_MAX_LENGTH } from "@/lib/settings";
import styles from "../admin.module.css";
import MaintenanceSettings from "./MaintenanceSettings";
import UsersPanel from "./UsersPanel";

export const metadata: Metadata = {
  title: "Paramètres",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  noStore();
  // Members only see the dashboard; the API routes enforce the same rule on their own.
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    redirect("/admin");
  }
  const maintenance = await getMaintenanceSettings();

  return (
    <div className={styles.dashboard}>
      <div>
        <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
          <a href="/admin">Admin</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Paramètres</span>
        </nav>
        <h1 className={styles.pageTitle}>Paramètres</h1>
      </div>

      <MaintenanceSettings initial={maintenance} maxLength={MAINTENANCE_MESSAGE_MAX_LENGTH} />

      <UsersPanel />
    </div>
  );
}

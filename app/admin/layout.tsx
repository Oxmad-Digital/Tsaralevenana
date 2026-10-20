import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-session";
import { siteInfo } from "@/lib/data";
import { logoUrl } from "@/lib/images";
import AdminNav from "./AdminNav";
import LogoutButton from "./LogoutButton";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware only checks the cookie signature; here the account must still exist.
  // "session=expired" stops the middleware from bouncing a still-signed cookie back to /admin.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?session=expired");
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src={logoUrl} alt={siteInfo.name} width={40} height={28} />
          <span>Administration</span>
        </div>
        <AdminNav role={user.role} />
        <div className={styles.headerActions}>
          <a href="/" className={styles.backLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M11 18l-6-6 6-6" />
            </svg>
            Retour au site
          </a>
          <LogoutButton />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { siteInfo } from "@/lib/data";
import { logoUrl } from "@/lib/images";
import LogoutButton from "./LogoutButton";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src={logoUrl} alt={siteInfo.name} width={40} height={28} />
          <span>Administration</span>
        </div>
        <LogoutButton />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button type="button" className={styles.logoutButton} onClick={handleLogout}>
      Déconnexion
    </button>
  );
}

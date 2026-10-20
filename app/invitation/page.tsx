import type { Metadata } from "next";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@/lib/db";
import { siteInfo } from "@/lib/data";
import { logoUrl } from "@/lib/images";
import { hashInvitationToken, isWellFormedToken, PASSWORD_MIN_LENGTH } from "@/lib/invitations";
import styles from "../login/login.module.css";
import InvitationForm from "./InvitationForm";

export const metadata: Metadata = {
  title: "Invitation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const dynamic = "force-dynamic";

async function findPendingInvitation(token: unknown) {
  if (!isWellFormedToken(token)) return null;
  const rows = (await sql`
    SELECT email FROM admin_users
    WHERE invitation_token_hash = ${hashInvitationToken(token)}
      AND invitation_expires_at > now()
      AND password_hash IS NULL
    LIMIT 1
  `) as { email: string }[];
  return rows[0] ?? null;
}

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: { token?: string | string[] };
}) {
  noStore();
  const token = searchParams.token;
  const invitation = await findPendingInvitation(token);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Image src={logoUrl} alt={siteInfo.name} width={76} height={52} className={styles.logo} />
        {invitation && typeof token === "string" ? (
          <>
            <h1 className={styles.title}>Choisir votre mot de passe</h1>
            <p className={styles.subtitle}>
              Compte : <strong>{invitation.email}</strong>
            </p>
            <InvitationForm token={token} minLength={PASSWORD_MIN_LENGTH} />
          </>
        ) : (
          <>
            <h1 className={styles.title}>Lien invalide ou expiré</h1>
            <p className={styles.subtitle}>
              Ce lien d&apos;invitation a déjà été utilisé ou n&apos;est plus valable. Demandez à un
              administrateur de vous envoyer une nouvelle invitation.
            </p>
            <a href="/login" className={styles.backLink}>
              Aller à la connexion
            </a>
          </>
        )}
      </div>
    </div>
  );
}

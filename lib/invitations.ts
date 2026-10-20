import { createHash, randomBytes } from "node:crypto";
import { Resend } from "resend";
import { siteInfo } from "@/lib/data";
import type { Role } from "@/lib/admin-session";

export const INVITATION_TTL_HOURS = 48;
export const PASSWORD_MIN_LENGTH = 10;

const TOKEN_PATTERN = /^[0-9a-f]{64}$/;

// The raw token only ever appears in the emailed link; the database keeps its SHA-256.
// A random 256-bit token cannot be guessed, so a fast hash is enough and stays searchable.
export function generateInvitationToken() {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: hashInvitationToken(token) };
}

export function hashInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isWellFormedToken(token: unknown): token is string {
  return typeof token === "string" && TOKEN_PATTERN.test(token);
}

export function getSiteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  return configured || new URL(request.url).origin;
}

const ROLE_LABELS: Record<Role, string> = {
  admin: "administrateur",
  member: "membre",
};

export async function sendInvitationEmail({
  to,
  role,
  link,
}: {
  to: string;
  role: Role;
  link: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY manquant.");
  }

  const roleLabel = ROLE_LABELS[role];
  const text = [
    "Bonjour,",
    "",
    `Vous êtes invité(e) à rejoindre l'administration du site ${siteInfo.tagline} ${siteInfo.name} en tant que ${roleLabel}.`,
    "",
    "Pour choisir votre mot de passe, ouvrez ce lien :",
    link,
    "",
    `Ce lien n'est valable qu'une seule fois, pendant ${INVITATION_TTL_HOURS} heures.`,
    "Si vous n'attendiez pas cette invitation, ignorez simplement cet email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2c2720; line-height: 1.6;">
      <p>Bonjour,</p>
      <p>Vous êtes invité(e) à rejoindre l'administration du site
        <strong>${siteInfo.tagline} ${siteInfo.name}</strong> en tant que <strong>${roleLabel}</strong>.</p>
      <p>
        <a href="${link}" style="display: inline-block; padding: 12px 22px; background: #a07d34; color: #ffffff; text-decoration: none;">
          Choisir mon mot de passe
        </a>
      </p>
      <p style="font-size: 13px; color: #6a6253;">
        Ce lien n'est valable qu'une seule fois, pendant ${INVITATION_TTL_HOURS} heures.<br />
        Si vous n'attendiez pas cette invitation, ignorez simplement cet email.
      </p>
    </div>
  `;

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: "Tsaralevenana <no-reply@maison-funeraire-tsaralevenana.com>",
    to,
    subject: "Invitation à l'administration du site",
    text,
    html,
  });
  if (error) {
    throw new Error(error.message || "Échec de l'envoi de l'email.");
  }
}

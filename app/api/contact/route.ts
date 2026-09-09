import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_RECIPIENT = process.env.CONTACT_EMAIL as string;

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Configuration serveur manquante." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nom, email et message sont requis." },
      { status: 400 }
    );
  }

  const resend = new Resend(resendApiKey);

  const fields = [
    { label: "Nom", value: name },
    { label: "Email", value: email },
    { label: "Téléphone", value: phone },
    { label: "Objet", value: type },
  ].filter((field) => field.value);

  const textBody = [
    ...fields.map((field) => `${field.label} : ${field.value}`),
    "",
    "Message :",
    message,
  ].join("\n");

  const htmlBody = `
    <div>
      ${fields
        .map(
          (field) =>
            `<p><strong>${field.label} :</strong> ${field.value}</p>`
        )
        .join("")}
      <p><strong>Message :</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Tsaralevenana <contact@maison-funeraire-tsaralevenana.com>",
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: type
        ? `Nouveau message : ${type}`
        : "Nouveau message depuis le site",
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Échec de l'envoi du message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Échec de l'envoi du message." },
      { status: 500 }
    );
  }
}

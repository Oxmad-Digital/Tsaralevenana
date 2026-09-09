"use client";

import { useState } from "react";
import FloralSprig from "./FloralSprig";
import { contactFormOptions, siteInfo } from "@/lib/data";
import styles from "./Contact.module.css";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
};

const initialForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  type: contactFormOptions[0],
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField =
    (field: keyof ContactFormData) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi");
      }

      setSubmitted(true);
    } catch {
      setError(
        "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter par téléphone."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.grid}>
        <div>
          <p className="eyebrow">Nous écrire</p>
          <h2 className="sectionTitle">
            Parlons-en
            <br />
            ensemble
          </h2>
          <p className={styles.intro}>
            Notre équipe est joignable à toute heure. Laissez-nous un message
            ou contactez-nous directement, nous vous répondrons dans les
            plus brefs délais.
          </p>
          <div className={styles.contactList}>
            <a href={siteInfo.phoneHref} className={styles.contactRow}>
              <span className={styles.contactLabel}>Tél.</span>
              <span className={styles.contactValue}>{siteInfo.phone}</span>
            </a>
            <a
              href={`mailto:${siteInfo.email}`}
              className={styles.contactRow}
            >
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValueBreak}>
                {siteInfo.email}
              </span>
            </a>
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Adresse</span>
              <span className={styles.contactValue}>
                {siteInfo.city}, {siteInfo.country}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          {submitted ? (
            <div className={styles.confirmation}>
              <FloralSprig className={styles.confirmationIcon} />
              <h3 className={styles.confirmationTitle}>Message envoyé</h3>
              <p className={styles.confirmationText}>
                Merci de votre confiance. Notre équipe vous recontactera
                dans les plus brefs délais.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Nom complet</label>
                <input
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="Votre nom"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="email@exemple.com"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Téléphone</label>
                  <input
                    value={form.phone}
                    onChange={updateField("phone")}
                    placeholder="+261 ..."
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Objet de la demande</label>
                <select
                  value={form.type}
                  onChange={updateField("type")}
                  className={styles.input}
                >
                  {contactFormOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea
                  value={form.message}
                  onChange={updateField("message")}
                  rows={4}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className={styles.textarea}
                  required
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

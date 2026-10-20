"use client";

import { useState } from "react";
import type { MaintenanceSettings as Settings } from "@/lib/settings";
import styles from "../admin.module.css";

async function saveSettings(update: {
  maintenanceEnabled?: boolean;
  maintenanceMessage?: string;
}): Promise<Settings> {
  const response = await fetch("/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "L'enregistrement a échoué. Réessayez.");
  }
  return data as Settings;
}

export default function MaintenanceSettings({
  initial,
  maxLength,
}: {
  initial: Settings;
  maxLength: number;
}) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [message, setMessage] = useState(initial.message);
  const [savedMessage, setSavedMessage] = useState(initial.message);
  const [isToggling, setIsToggling] = useState(false);
  const [isSavingMessage, setIsSavingMessage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleToggle() {
    setIsToggling(true);
    setFeedback(null);
    try {
      const settings = await saveSettings({ maintenanceEnabled: !enabled });
      setEnabled(settings.enabled);
      setFeedback({
        type: "success",
        text: settings.enabled
          ? "Maintenance activée. Les visiteurs voient la page de travaux (sous 5 secondes)."
          : "Maintenance désactivée. Le site est de nouveau visible (sous 5 secondes).",
      });
    } catch (error) {
      setFeedback({ type: "error", text: (error as Error).message });
    } finally {
      setIsToggling(false);
    }
  }

  async function handleSaveMessage() {
    setIsSavingMessage(true);
    setFeedback(null);
    try {
      const settings = await saveSettings({ maintenanceMessage: message });
      setMessage(settings.message);
      setSavedMessage(settings.message);
      setFeedback({ type: "success", text: "Message enregistré." });
    } catch (error) {
      setFeedback({ type: "error", text: (error as Error).message });
    } finally {
      setIsSavingMessage(false);
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Écran de maintenance</h2>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Activer l'écran de maintenance"
          className={`${styles.switch} ${enabled ? styles.switchOn : ""}`}
          onClick={handleToggle}
          disabled={isToggling}
        >
          <span className={styles.switchThumb} />
        </button>
      </div>

      <p className={styles.siteStatus}>
        <span
          className={`${styles.statusDot} ${enabled ? styles.statusDotMaintenance : styles.statusDotOnline}`}
          aria-hidden="true"
        />
        {enabled ? "Site en maintenance" : "Site en ligne"}
      </p>

      <label className={styles.fieldLabel} htmlFor="maintenance-message">
        Message affiché aux visiteurs (optionnel)
      </label>
      <textarea
        id="maintenance-message"
        className={styles.textarea}
        rows={4}
        maxLength={maxLength}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ex. : Notre site est en cours de mise à jour. Nous restons joignables par téléphone 24h/24."
      />

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleSaveMessage}
          disabled={isSavingMessage || message.trim() === savedMessage}
        >
          {isSavingMessage ? "Enregistrement..." : "Enregistrer le message"}
        </button>
        {feedback && (
          <p
            className={feedback.type === "error" ? styles.feedbackError : styles.feedbackSuccess}
            role="status"
          >
            {feedback.text}
          </p>
        )}
      </div>
    </section>
  );
}

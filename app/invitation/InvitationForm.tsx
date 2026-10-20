"use client";

import { useState } from "react";
import styles from "../login/login.module.css";

export default function InvitationForm({ token, minLength }: { token: string; minLength: number }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < minLength) {
      setError(`Le mot de passe doit contenir au moins ${minLength} caractères.`);
      return;
    }
    if (password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmation }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        setIsSubmitting(false);
        return;
      }
      // Full navigation so the new session cookie is sent with the first /admin request.
      window.location.assign("/admin");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
      <label className={styles.label} htmlFor="password">
        Mot de passe ({minLength} caractères minimum)
      </label>
      <div className={styles.passwordField}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete="new-password"
          className={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l18 18" />
              <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-3.1 4.1M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4.4-1" />
              <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </svg>
          )}
        </button>
      </div>

      <label className={styles.label} htmlFor="confirmation">
        Confirmer le mot de passe
      </label>
      <input
        id="confirmation"
        type={showPassword ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete="new-password"
        className={styles.input}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Créer mon mot de passe"}
      </button>
    </form>
  );
}

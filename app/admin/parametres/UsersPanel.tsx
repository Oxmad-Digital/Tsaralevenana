"use client";

import { useState } from "react";
import type { Role } from "@/lib/admin-session";
import type { UserListItem } from "@/app/api/admin/users/route";
import styles from "../admin.module.css";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur",
  member: "Membre",
};

type Feedback = { type: "success" | "error"; text: string } | null;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Une erreur est survenue. Réessayez.");
  }
  return data as T;
}

export default function UsersPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<UserListItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [isInviting, setIsInviting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<Role>("member");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await request<{ users: UserListItem[] }>("/api/admin/users");
      setUsers(data.users);
    } catch (error) {
      setFeedback({ type: "error", text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }

  function open() {
    setIsOpen(true);
    setFeedback(null);
    loadUsers();
  }

  function close() {
    setIsOpen(false);
    setEditingId(null);
    setFeedback(null);
  }

  async function handleInvite(event: React.FormEvent) {
    event.preventDefault();
    setIsInviting(true);
    setFeedback(null);
    const invitedEmail = email.trim().toLowerCase();
    try {
      await request("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ email: invitedEmail, role }),
      });
      setEmail("");
      setRole("member");
      setFeedback({ type: "success", text: `Invitation envoyée à ${invitedEmail}.` });
      await loadUsers();
    } catch (error) {
      setFeedback({ type: "error", text: (error as Error).message });
    } finally {
      setIsInviting(false);
    }
  }

  function startEditing(user: UserListItem) {
    setEditingId(user.id);
    setEditingRole(user.role);
    setFeedback(null);
  }

  async function saveRole(user: UserListItem) {
    if (editingRole === user.role) {
      setEditingId(null);
      return;
    }
    setBusyId(user.id);
    setFeedback(null);
    try {
      await request(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: editingRole }),
      });
      setEditingId(null);
      setFeedback({ type: "success", text: `Rôle de ${user.email} mis à jour.` });
      await loadUsers();
    } catch (error) {
      setFeedback({ type: "error", text: (error as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(user: UserListItem) {
    const question =
      user.status === "active"
        ? `Supprimer le compte ${user.email} ? Cette personne n'aura plus accès à l'administration.`
        : `Annuler l'invitation de ${user.email} ?`;
    if (!window.confirm(question)) return;

    setBusyId(user.id);
    setFeedback(null);
    try {
      await request(`/api/admin/users/${user.id}`, { method: "DELETE" });
      setFeedback({
        type: "success",
        text: user.status === "active" ? `Compte ${user.email} supprimé.` : "Invitation annulée.",
      });
      await loadUsers();
    } catch (error) {
      setFeedback({ type: "error", text: (error as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  if (!isOpen) {
    return (
      <div>
        <button type="button" className={styles.secondaryButton} onClick={open}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Utilisateurs
        </button>
      </div>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="users-panel-title">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle} id="users-panel-title">
          Utilisateurs
        </h2>
        <button type="button" className={styles.secondaryButton} onClick={close}>
          Fermer
        </button>
      </div>

      <form className={styles.inviteForm} onSubmit={handleInvite}>
        <div className={styles.inviteField}>
          <label className={styles.fieldLabel} htmlFor="invite-email">
            Email
          </label>
          <input
            id="invite-email"
            type="email"
            required
            className={styles.textInput}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="prenom.nom@exemple.com"
          />
        </div>
        <div>
          <label className={styles.fieldLabel} htmlFor="invite-role">
            Rôle
          </label>
          <select
            id="invite-role"
            className={styles.select}
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            <option value="member">{ROLE_LABELS.member}</option>
            <option value="admin">{ROLE_LABELS.admin}</option>
          </select>
        </div>
        <button type="submit" className={styles.primaryButton} disabled={isInviting}>
          {isInviting ? "Envoi..." : "Envoyer l'invitation"}
        </button>
      </form>
      <p className={styles.helpText}>
        Membre : consultation du tableau de bord. Administrateur : accès complet, paramètres
        compris. Le lien d&apos;invitation est valable 48 heures et ne sert qu&apos;une fois.
      </p>

      {feedback && (
        <p
          className={feedback.type === "error" ? styles.feedbackError : styles.feedbackSuccess}
          role="status"
        >
          {feedback.text}
        </p>
      )}

      {users === null ? (
        <p className={styles.emptyState}>{isLoading ? "Chargement..." : "Aucun compte."}</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Rôle</th>
                <th>
                  <span className={styles.visuallyHidden}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isEditing = editingId === user.id;
                const isBusy = busyId === user.id;
                return (
                  <tr key={user.id}>
                    <td data-label="Email">
                      {user.email}
                      {user.isCurrentUser && <span className={styles.youTag}> (vous)</span>}
                      {user.status !== "active" && (
                        <span
                          className={`${styles.badge} ${
                            user.status === "invited" ? styles.badgePending : styles.badgeExpired
                          }`}
                        >
                          {user.status === "invited" ? "Invitation en attente" : "Invitation expirée"}
                        </span>
                      )}
                    </td>
                    <td data-label="Rôle">
                      {isEditing ? (
                        <select
                          className={styles.select}
                          aria-label={`Rôle de ${user.email}`}
                          value={editingRole}
                          onChange={(event) => setEditingRole(event.target.value as Role)}
                          disabled={isBusy}
                        >
                          <option value="member">{ROLE_LABELS.member}</option>
                          <option value="admin">{ROLE_LABELS.admin}</option>
                        </select>
                      ) : (
                        <span
                          className={`${styles.badge} ${
                            user.role === "admin" ? styles.badgeAdmin : styles.badgeMember
                          }`}
                        >
                          {ROLE_LABELS[user.role]}
                        </span>
                      )}
                    </td>
                    <td data-label="Actions">
                      {user.isCurrentUser ? null : isEditing ? (
                        <div className={styles.rowActions}>
                          <button
                            type="button"
                            className={styles.textButton}
                            onClick={() => saveRole(user)}
                            disabled={isBusy}
                          >
                            Enregistrer
                          </button>
                          <button
                            type="button"
                            className={styles.textButton}
                            onClick={() => setEditingId(null)}
                            disabled={isBusy}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className={styles.rowActions}>
                          <button
                            type="button"
                            className={styles.textButton}
                            onClick={() => startEditing(user)}
                            disabled={isBusy}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => handleDelete(user)}
                            disabled={isBusy}
                            aria-label={
                              user.status === "active"
                                ? `Supprimer ${user.email}`
                                : `Annuler l'invitation de ${user.email}`
                            }
                            title={user.status === "active" ? "Supprimer" : "Annuler l'invitation"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

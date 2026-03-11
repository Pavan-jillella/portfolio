/**
 * User roles utility.
 *
 * Roles:
 * - "owner"  — the site owner (email from OWNER_EMAIL env var). Full access.
 * - "admin"  — same as owner for now; can be extended to support multiple admins.
 * - "user"   — any authenticated user. Limited access (own data only).
 *
 * All data access is still scoped by user_id via the sync API and RLS.
 * This module only controls UI-level feature gating.
 */

export type UserRole = "owner" | "admin" | "user" | "anonymous";

function getOwnerEmail(): string {
  return process.env.NEXT_PUBLIC_OWNER_EMAIL || process.env.OWNER_EMAIL || "";
}

export function getUserRole(email: string | null | undefined): UserRole {
  if (!email) return "anonymous";
  const ownerEmail = getOwnerEmail();
  if (ownerEmail && email === ownerEmail) return "owner";
  return "user";
}

export function isOwner(email: string | null | undefined): boolean {
  return getUserRole(email) === "owner";
}

export function isAdmin(email: string | null | undefined): boolean {
  const role = getUserRole(email);
  return role === "owner" || role === "admin";
}

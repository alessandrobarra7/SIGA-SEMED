import { and, eq, gt, or } from "drizzle-orm";
import { parse } from "cookie";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { semedDomainSessions, semedDomainUserPermissions, semedDomainUsers } from "../drizzle/schema";
import { getDb } from "./db";

export const SEMED_DOMAIN_SESSION_COOKIE = "siga_domain_session";
export const SEMED_DOMAIN_SESSION_DAYS = 7;

export type SemedDomainSessionActor = {
  id: string;
  username: string;
  registration: string;
  displayName: string;
  profile: string;
  active: boolean;
  mustChangePassword: boolean;
  permissions: string[];
};

export function hashDomainSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createDomainPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { passwordHash: `scrypt$${salt}$${hash}`, passwordSalt: salt, passwordIterations: 210000 };
}

export function verifyDomainPassword(password: string, stored: string) {
  const [scheme, salt, expectedHex] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !expectedHex || !/^[a-f0-9]+$/i.test(expectedHex)) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const candidate = scryptSync(password, salt, expected.length);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function createDomainSessionSecret() {
  return randomBytes(32).toString("base64url");
}

function domainSessionCookieFromRequest(req: Request) {
  const values = parse(req.headers.cookie ?? "");
  return values[SEMED_DOMAIN_SESSION_COOKIE] ?? "";
}

export async function getDomainSessionActor(req: Request): Promise<SemedDomainSessionActor | null> {
  const sessionSecret = domainSessionCookieFromRequest(req);
  if (!sessionSecret) return null;
  const database = await getDb();
  if (!database) return null;

  const rows = await database
    .select({
      id: semedDomainUsers.id,
      username: semedDomainUsers.username,
      registration: semedDomainUsers.registration,
      displayName: semedDomainUsers.displayName,
      profile: semedDomainUsers.profile,
      active: semedDomainUsers.active,
      mustChangePassword: semedDomainUsers.mustChangePassword,
    })
    .from(semedDomainSessions)
    .innerJoin(semedDomainUsers, eq(semedDomainSessions.userId, semedDomainUsers.id))
    .where(and(eq(semedDomainSessions.tokenHash, hashDomainSecret(sessionSecret)), gt(semedDomainSessions.expiresAt, new Date()), eq(semedDomainUsers.active, true)))
    .limit(1);

  const actor = rows[0];
  if (!actor) return null;
  const permissions = await database
    .select({ moduleKey: semedDomainUserPermissions.moduleKey })
    .from(semedDomainUserPermissions)
    .where(and(eq(semedDomainUserPermissions.userId, actor.id), eq(semedDomainUserPermissions.granted, true)));
  return { ...actor, permissions: permissions.map((permission) => permission.moduleKey) };
}

export async function findDomainUserForLogin(identifier: string) {
  const database = await getDb();
  if (!database) return null;
  const normalized = identifier.trim().toLowerCase();
  const numericCpf = identifier.replace(/\D/g, "");
  const rows = await database
    .select()
    .from(semedDomainUsers)
    .where(or(eq(semedDomainUsers.username, normalized), eq(semedDomainUsers.registration, identifier.trim()), eq(semedDomainUsers.cpf, numericCpf)))
    .limit(1);
  return rows[0] ?? null;
}

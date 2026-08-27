import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { semedDomainSessions, semedDomainUsers } from "../../drizzle/schema";
import { getDb } from "../db";
import {
  createDomainSessionSecret,
  findDomainUserForLogin,
  getDomainSessionActor,
  hashDomainSecret,
  SEMED_DOMAIN_SESSION_COOKIE,
  SEMED_DOMAIN_SESSION_DAYS,
  verifyDomainPassword,
} from "../semedDomainAuth";
import { getSessionCookieOptions } from "../_core/cookies";
import { domainProcedure, publicProcedure, router } from "../_core/trpc";

const loginInput = z.object({
  identifier: z.string().trim().min(1).max(96),
  password: z.string().min(1).max(256),
});

function publicActor(user: NonNullable<Awaited<ReturnType<typeof findDomainUserForLogin>>>) {
  return {
    id: user.id,
    username: user.username,
    registration: user.registration,
    displayName: user.displayName,
    profile: user.profile,
    loginType: user.loginType,
    mustChangePassword: user.mustChangePassword,
    active: user.active,
  };
}

export const semedDomainRouter = router({
  availability: publicProcedure.query(async () => {
    const database = await getDb();
    if (!database) return { enabled: false } as const;
    try {
      const domainUsers = await database.select({ id: semedDomainUsers.id }).from(semedDomainUsers).where(and(eq(semedDomainUsers.active, true))).limit(1);
      return { enabled: Boolean(domainUsers[0]) } as const;
    } catch {
      return { enabled: false } as const;
    }
  }),
  login: publicProcedure.input(loginInput).mutation(async ({ ctx, input }) => {
    const database = await getDb();
    if (!database) return { mode: "local" as const, user: null };
    const user = await findDomainUserForLogin(input.identifier);
    if (!user || !user.active || !verifyDomainPassword(input.password, user.passwordHash)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Identificador ou senha inválidos." });
    }

    const secret = createDomainSessionSecret();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SEMED_DOMAIN_SESSION_DAYS * 24 * 60 * 60 * 1000);
    await database.insert(semedDomainSessions).values({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashDomainSecret(secret),
      expiresAt,
      createdAt: now,
      lastActivityAt: now,
    });
    await database.update(semedDomainSessions).set({ lastActivityAt: now }).where(eq(semedDomainSessions.userId, user.id));
    ctx.res.cookie(SEMED_DOMAIN_SESSION_COOKIE, secret, { ...getSessionCookieOptions(ctx.req), maxAge: SEMED_DOMAIN_SESSION_DAYS * 24 * 60 * 60 * 1000 });
    return { mode: "domain" as const, user: publicActor(user) };
  }),
  me: domainProcedure.query(({ ctx }) => ({ ...ctx.domainUser })),
  directory: domainProcedure.query(async () => {
    const database = await getDb();
    if (!database) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Diretório de domínio indisponível; o modo local permanece ativo." });
    return database
      .select({ id: semedDomainUsers.id, displayName: semedDomainUsers.displayName, profile: semedDomainUsers.profile, active: semedDomainUsers.active })
      .from(semedDomainUsers)
      .where(eq(semedDomainUsers.active, true));
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const actor = await getDomainSessionActor(ctx.req);
    if (actor) {
      const database = await getDb();
      if (database) await database.delete(semedDomainSessions).where(eq(semedDomainSessions.userId, actor.id));
    }
    ctx.res.clearCookie(SEMED_DOMAIN_SESSION_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
    return { success: true } as const;
  }),
});

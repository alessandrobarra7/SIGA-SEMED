import { and, desc, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  semedAgendaEvents,
  semedMasterRecords,
  semedUserMessageReads,
  semedUserMessages,
  semedUserNotes,
  semedDomainUsers,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { domainProcedure, router } from "../_core/trpc";
import { semedDomainRouter } from "./semedDomain";
import { semedSchoolsRouter } from "./semedSchools";

const idInput = z.object({ id: z.string().trim().min(1).max(64) });
const priorityInput = z.enum(["Baixa", "Média", "Alta"]);

const masterRecordInput = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  recordType: z.string().trim().min(1).max(96),
  code: z.string().trim().min(1).max(96),
  name: z.string().trim().min(1).max(255),
  document: z.string().trim().max(96).default(""),
  email: z.string().trim().max(320).default(""),
  phone: z.string().trim().max(64).default(""),
  department: z.string().trim().max(160).default(""),
  position: z.string().trim().max(160).default(""),
  address: z.string().trim().default(""),
  notes: z.string().trim().default(""),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
});

const agendaEventInput = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  type: z.string().trim().max(96).default("Compromisso"),
  title: z.string().trim().min(1).max(255),
  eventDate: z.string().trim().min(10).max(10),
  startTime: z.string().trim().max(8).default(""),
  priority: priorityInput.default("Média"),
  reminderDays: z.number().int().min(0).max(365).default(0),
  notes: z.string().trim().default(""),
  status: z.enum(["Agendado", "Concluído", "Cancelado"]).default("Agendado"),
});

const messageInput = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  recipientUserId: z.string().trim().min(1).max(64),
  subject: z.string().trim().min(1).max(255),
  message: z.string().trim().min(1),
  priority: priorityInput.default("Média"),
  expiresAt: z.string().trim().max(40).default(""),
});

const noteInput = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  content: z.string().trim().min(1),
});

const iso = (value: Date) => value.toISOString();
async function requireDatabase() {
  const database = await getDb();
  if (!database) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "A persistência de negócio não está disponível neste ambiente. O modo local permanece ativo.",
    });
  }
  return database;
}

function toMasterRecord(row: typeof semedMasterRecords.$inferSelect) {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

function toAgendaEvent(row: typeof semedAgendaEvents.$inferSelect) {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

function toMessage(row: typeof semedUserMessages.$inferSelect) {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

function toNote(row: typeof semedUserNotes.$inferSelect) {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

export const semedInitialRouter = router({
  domain: semedDomainRouter,
  schools: semedSchoolsRouter,
  masters: router({
    list: domainProcedure.query(async () => {
      const database = await requireDatabase();
      const rows = await database.select().from(semedMasterRecords).orderBy(desc(semedMasterRecords.updatedAt));
      return rows.map(toMasterRecord);
    }),
    save: domainProcedure.input(masterRecordInput).mutation(async ({ ctx, input }) => {
      if (ctx.domainUser.profile !== "Administrador") throw new TRPCError({ code: "FORBIDDEN", message: "Usuário sem permissão para alterar cadastros gerais." });
      const database = await requireDatabase();
      const code = input.code.toUpperCase();
      const duplicate = await database.select({ id: semedMasterRecords.id }).from(semedMasterRecords).where(eq(semedMasterRecords.code, code)).limit(1);
      if (duplicate[0] && duplicate[0].id !== input.id) throw new TRPCError({ code: "CONFLICT", message: "Já existe um cadastro institucional com este código." });

      const now = new Date();
      const id = input.id ?? crypto.randomUUID();
      const values = { ...input, id, code, updatedAt: now };
      if (input.id) await database.update(semedMasterRecords).set(values).where(eq(semedMasterRecords.id, id));
      else await database.insert(semedMasterRecords).values({ ...values, createdAt: now });
      const row = (await database.select().from(semedMasterRecords).where(eq(semedMasterRecords.id, id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível confirmar o cadastro salvo." });
      return toMasterRecord(row);
    }),
    remove: domainProcedure.input(idInput).mutation(async ({ ctx, input }) => {
      if (ctx.domainUser.profile !== "Administrador") throw new TRPCError({ code: "FORBIDDEN", message: "Usuário sem permissão para excluir cadastros gerais." });
      const database = await requireDatabase();
      await database.delete(semedMasterRecords).where(eq(semedMasterRecords.id, input.id));
      return { success: true } as const;
    }),
  }),
  agenda: router({
    list: domainProcedure.query(async ({ ctx }) => {
      const database = await requireDatabase();
      const rows = await database.select().from(semedAgendaEvents).where(eq(semedAgendaEvents.userId, ctx.domainUser.id)).orderBy(desc(semedAgendaEvents.eventDate));
      return rows.map(toAgendaEvent);
    }),
    save: domainProcedure.input(agendaEventInput).mutation(async ({ ctx, input }) => {
      const database = await requireDatabase();
      const userId = ctx.domainUser.id;
      const now = new Date();
      const id = input.id ?? crypto.randomUUID();
      const current = input.id ? (await database.select().from(semedAgendaEvents).where(eq(semedAgendaEvents.id, id)).limit(1))[0] : undefined;
      if (current && current.userId !== userId) throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode alterar eventos da sua própria agenda." });
      const completedAt = input.status === "Concluído" ? current?.completedAt || now.toISOString() : "";
      const values = { ...input, id, userId, completedAt, updatedAt: now };
      if (current) await database.update(semedAgendaEvents).set(values).where(eq(semedAgendaEvents.id, id));
      else await database.insert(semedAgendaEvents).values({ ...values, createdAt: now });
      const row = (await database.select().from(semedAgendaEvents).where(eq(semedAgendaEvents.id, id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível confirmar o evento salvo." });
      return toAgendaEvent(row);
    }),
  }),
  messages: router({
    list: domainProcedure.query(async ({ ctx }) => {
      const database = await requireDatabase();
      const userId = ctx.domainUser.id;
      const [messages, reads] = await Promise.all([
        database.select().from(semedUserMessages).where(or(eq(semedUserMessages.senderUserId, userId), eq(semedUserMessages.recipientUserId, userId))).orderBy(desc(semedUserMessages.createdAt)),
        database.select().from(semedUserMessageReads).where(eq(semedUserMessageReads.userId, userId)),
      ]);
      return { messages: messages.map(toMessage), reads: reads.map(read => ({ ...read })) };
    }),
    save: domainProcedure.input(messageInput).mutation(async ({ ctx, input }) => {
      const database = await requireDatabase();
      const senderUserId = ctx.domainUser.id;
      const recipient = await database.select({ id: semedDomainUsers.id }).from(semedDomainUsers).where(and(eq(semedDomainUsers.id, input.recipientUserId), eq(semedDomainUsers.active, true))).limit(1);
      if (!recipient[0]) throw new TRPCError({ code: "BAD_REQUEST", message: "Informe um destinatário ativo para a mensagem." });
      const now = new Date();
      const id = input.id ?? crypto.randomUUID();
      const current = input.id ? (await database.select().from(semedUserMessages).where(eq(semedUserMessages.id, id)).limit(1))[0] : undefined;
      if (current && current.senderUserId !== senderUserId) throw new TRPCError({ code: "FORBIDDEN", message: "Somente o remetente pode alterar esta mensagem." });
      const values = { ...input, id, senderUserId, senderName: ctx.domainUser.displayName, updatedAt: now };
      if (current) await database.update(semedUserMessages).set(values).where(eq(semedUserMessages.id, id));
      else await database.insert(semedUserMessages).values({ ...values, createdAt: now });
      const row = (await database.select().from(semedUserMessages).where(eq(semedUserMessages.id, id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível confirmar a mensagem salva." });
      return toMessage(row);
    }),
    markRead: domainProcedure.input(idInput).mutation(async ({ ctx, input }) => {
      const database = await requireDatabase();
      const userId = ctx.domainUser.id;
      const message = (await database.select().from(semedUserMessages).where(eq(semedUserMessages.id, input.id)).limit(1))[0];
      if (!message || message.recipientUserId !== userId) throw new TRPCError({ code: "FORBIDDEN", message: "Somente o destinatário pode confirmar a leitura." });
      await database.insert(semedUserMessageReads).values({ id: crypto.randomUUID(), messageId: input.id, userId, readAt: new Date().toISOString() }).onDuplicateKeyUpdate({ set: { readAt: new Date().toISOString() } });
      return { success: true } as const;
    }),
  }),
  notes: router({
    list: domainProcedure.query(async ({ ctx }) => {
      const database = await requireDatabase();
      const rows = await database.select().from(semedUserNotes).where(eq(semedUserNotes.userId, ctx.domainUser.id)).orderBy(desc(semedUserNotes.updatedAt));
      return rows.map(toNote);
    }),
    save: domainProcedure.input(noteInput).mutation(async ({ ctx, input }) => {
      const database = await requireDatabase();
      const userId = ctx.domainUser.id;
      const now = new Date();
      const id = input.id ?? crypto.randomUUID();
      const current = input.id ? (await database.select().from(semedUserNotes).where(eq(semedUserNotes.id, id)).limit(1))[0] : undefined;
      if (current && current.userId !== userId) throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode alterar os seus próprios lembretes." });
      const values = { ...input, id, userId, updatedAt: now };
      if (current) await database.update(semedUserNotes).set(values).where(eq(semedUserNotes.id, id));
      else await database.insert(semedUserNotes).values({ ...values, createdAt: now });
      const row = (await database.select().from(semedUserNotes).where(eq(semedUserNotes.id, id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível confirmar o lembrete salvo." });
      return toNote(row);
    }),
    remove: domainProcedure.input(idInput).mutation(async ({ ctx, input }) => {
      const database = await requireDatabase();
      await database.delete(semedUserNotes).where(and(eq(semedUserNotes.id, input.id), eq(semedUserNotes.userId, ctx.domainUser.id)));
      return { success: true } as const;
    }),
  }),
});

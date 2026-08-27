import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cadastros institucionais do SIGA SEMED. O identificador string preserva a
 * compatibilidade com os registros que o preview já mantém localmente.
 */
export const semedMasterRecords = mysqlTable(
  "semed_master_records",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    recordType: varchar("record_type", { length: 96 }).notNull(),
    code: varchar("code", { length: 96 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    document: varchar("document", { length: 96 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 64 }).notNull(),
    department: varchar("department", { length: 160 }).notNull(),
    position: varchar("position", { length: 160 }).notNull(),
    address: text("address").notNull(),
    notes: text("notes").notNull(),
    status: mysqlEnum("status", ["Ativo", "Inativo"]).notNull().default("Ativo"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  table => [uniqueIndex("semed_master_records_code_uq").on(table.code), index("semed_master_records_type_idx").on(table.recordType)],
);

/** Eventos individuais da agenda interna. Datas e horários seguem o contrato textual já usado pelas telas. */
export const semedAgendaEvents = mysqlTable(
  "semed_agenda_events",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    type: varchar("type", { length: 96 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    eventDate: varchar("event_date", { length: 10 }).notNull(),
    startTime: varchar("start_time", { length: 8 }).notNull(),
    priority: mysqlEnum("priority", ["Baixa", "Média", "Alta"]).notNull().default("Média"),
    reminderDays: int("reminder_days").notNull().default(0),
    notes: text("notes").notNull(),
    status: mysqlEnum("status", ["Agendado", "Concluído", "Cancelado"]).notNull().default("Agendado"),
    completedAt: varchar("completed_at", { length: 40 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  table => [index("semed_agenda_events_user_date_idx").on(table.userId, table.eventDate)],
);

/** Mensagens internas, separadas de suas confirmações de leitura por destinatário. */
export const semedUserMessages = mysqlTable(
  "semed_user_messages",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    senderUserId: varchar("sender_user_id", { length: 64 }).notNull(),
    senderName: varchar("sender_name", { length: 255 }).notNull(),
    recipientUserId: varchar("recipient_user_id", { length: 64 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    priority: mysqlEnum("priority", ["Baixa", "Média", "Alta"]).notNull().default("Média"),
    expiresAt: varchar("expires_at", { length: 40 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  table => [index("semed_user_messages_recipient_idx").on(table.recipientUserId), index("semed_user_messages_sender_idx").on(table.senderUserId)],
);

export const semedUserMessageReads = mysqlTable(
  "semed_user_message_reads",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    messageId: varchar("message_id", { length: 64 }).notNull(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    readAt: varchar("read_at", { length: 40 }).notNull(),
  },
  table => [uniqueIndex("semed_message_reads_message_user_uq").on(table.messageId, table.userId)],
);

/** Lembretes pertencem ao usuário que os criou e nunca são compartilhados por padrão. */
export const semedUserNotes = mysqlTable(
  "semed_user_notes",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  table => [index("semed_user_notes_user_idx").on(table.userId)],
);

/**
 * Identidades do domínio SIGA, independentes da tabela de OAuth do template.
 * Senhas são armazenadas exclusivamente como hash e podem ser migradas de
 * forma controlada em etapa administrativa posterior.
 */
export const semedDomainUsers = mysqlTable(
  "semed_domain_users",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    username: varchar("username", { length: 96 }).notNull(),
    registration: varchar("registration", { length: 32 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    profile: varchar("profile", { length: 96 }).notNull(),
    loginType: mysqlEnum("login_type", ["matricula", "cpf"]).notNull().default("matricula"),
    cpf: varchar("cpf", { length: 32 }).notNull(),
    schoolUnitId: varchar("school_unit_id", { length: 64 }).notNull(),
    serverRegistrationId: varchar("server_registration_id", { length: 64 }).notNull(),
    passwordHash: varchar("password_hash", { length: 512 }).notNull(),
    passwordSalt: varchar("password_salt", { length: 256 }).notNull(),
    passwordIterations: int("password_iterations").notNull().default(210000),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    active: boolean("active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at"),
    lastActivityAt: timestamp("last_activity_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  table => [
    uniqueIndex("semed_domain_users_username_uq").on(table.username),
    uniqueIndex("semed_domain_users_registration_uq").on(table.registration),
    uniqueIndex("semed_domain_users_cpf_uq").on(table.cpf),
  ],
);

export const semedDomainUserPermissions = mysqlTable(
  "semed_domain_user_permissions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    moduleKey: varchar("module_key", { length: 96 }).notNull(),
    granted: boolean("granted").notNull().default(false),
    grantedBy: varchar("granted_by", { length: 64 }).notNull(),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
  },
  table => [uniqueIndex("semed_domain_permissions_user_module_uq").on(table.userId, table.moduleKey), index("semed_domain_permissions_user_idx").on(table.userId)],
);

export const semedDomainSessions = mysqlTable(
  "semed_domain_sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at").notNull().defaultNow(),
  },
  table => [uniqueIndex("semed_domain_sessions_token_hash_uq").on(table.tokenHash), index("semed_domain_sessions_user_idx").on(table.userId)],
);

export type SemedMasterRecordRow = typeof semedMasterRecords.$inferSelect;
export type SemedAgendaEventRow = typeof semedAgendaEvents.$inferSelect;
export type SemedUserMessageRow = typeof semedUserMessages.$inferSelect;
export type SemedUserMessageReadRow = typeof semedUserMessageReads.$inferSelect;
export type SemedUserNoteRow = typeof semedUserNotes.$inferSelect;
export type SemedDomainUserRow = typeof semedDomainUsers.$inferSelect;
export type SemedDomainPermissionRow = typeof semedDomainUserPermissions.$inferSelect;
export type SemedDomainSessionRow = typeof semedDomainSessions.$inferSelect;

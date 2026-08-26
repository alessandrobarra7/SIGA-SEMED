import { useMemo, useRef, useState } from "react";

export type SemedRecordKind = "Contrato" | "Processo";
export type SemedFinancialCategory = "Sem controle" | "Contrato geral" | "Aluguel";
export type SemedDocumentKind = "Ofício" | "Memorando" | "Despacho";

export const SEMED_USER_PROFILES = [
  "Administrador",
  "Técnico",
  "Gestor Escolar",
  "Secretário Escolar",
  "Auditoria Externa",
  "Contadora Municipal",
] as const;
export type SemedUserProfile = (typeof SEMED_USER_PROFILES)[number];
export type SemedLoginType = "matricula" | "cpf";

export const SEMED_MODULE_KEYS = [
  "inicio",
  "gestao",
  "cadastros_gerais",
  "contratos",
  "documentos",
  "financeiro",
  "unidades_escolares",
  "unidades.mapa",
  "unidades.uex",
  "unidades.turmas",
  "educa_paco",
  "rh",
  "rh.cadastro_servidores",
  "rh.ficha_financeira",
  "rh.holerite",
  "rh.frequencia",
  "rh.relatorios",
  "nutricao",
  "nutricao.planejamento_semanal",
  "nutricao.planejamento_anual",
  "estoque",
  "estoque.industrializado",
  "estoque.agricultura_familiar",
  "estoque.kit_aluno",
  "estoque.categorias",
  "estoque.relatorios",
  "frota",
  "frota.veiculos",
  "frota.abastecimento",
  "frota.manutencao",
  "frota.ocorrencias",
  "frota.relatorios",
  "usuarios",
] as const;
export type SemedModuleKey = (typeof SEMED_MODULE_KEYS)[number];

export type SemedUserAuditAction =
  | "usuario.criado"
  | "usuario.editado"
  | "usuario.ativado"
  | "usuario.desativado"
  | "usuario.permissoes"
  | "usuario.senha_provisoria";

/** Estrutura local compatível com semed_users; nunca contém senhas ou hashes da referência. */
export type SemedLocalUser = {
  id: string;
  username: string;
  registration: string;
  displayName: string;
  role: SemedUserProfile;
  profile: SemedUserProfile;
  loginType: SemedLoginType;
  cpf: string;
  schoolUnitId: string;
  serverRegistrationId: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  mustChangePassword: boolean;
  provisionalPasswordIssuedAt: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  lastActivityAt: string;
};

export type SemedLocalUserPermission = {
  id: string;
  userId: string;
  moduleKey: SemedModuleKey;
  granted: boolean;
  grantedBy: string;
  grantedAt: string;
};

export type SemedLocalUserAudit = {
  id: string;
  userId: string;
  action: SemedUserAuditAction;
  changedFields: string[];
  summary: string;
  actorUserId: string;
  createdAt: string;
};

export type SemedLocalUserInput = {
  displayName: string;
  registration: string;
  cpf: string;
  profile: SemedUserProfile;
  active: boolean;
  schoolUnitId: string;
  serverRegistrationId: string;
  moduleKeys: SemedModuleKey[];
};

export type SemedLocalUserOperation = {
  error: string | null;
  user: SemedLocalUser | null;
  provisionalPassword?: string;
};

/** Estrutura local compatível com semed_sessions; tokenHash é apenas um identificador simulado. */
export type SemedLocalSession = {
  tokenHash: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};

export type SemedRecordPayment = {
  id: string;
  recordId: string;
  paymentDate: string;
  amount: number;
  notes: string;
  createdAt: string;
};

export type SemedRecord = {
  id: string;
  kind: SemedRecordKind;
  number: string;
  object: string;
  party: string;
  department: string;
  responsible: string;
  amount: number;
  financialCategory: SemedFinancialCategory;
  paymentDueDate: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string;
  alertDays: number;
  payments: SemedRecordPayment[];
  paidAmount: number;
  balanceAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type SemedRecordInput = Omit<SemedRecord, "id" | "payments" | "paidAmount" | "balanceAmount" | "createdAt" | "updatedAt">;
export type SemedRecordPaymentInput = Omit<SemedRecordPayment, "id" | "createdAt"> & { nextPaymentDueDate?: string };

export type SemedDocument = {
  id: string;
  kind: SemedDocumentKind;
  number: string;
  templateKey: string;
  subject: string;
  destination: string;
  recipient: string;
  relatedRecord: string;
  responsible: string;
  documentDate: string;
  dueDate: string;
  status: string;
  summary: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type SemedDocumentInput = Omit<SemedDocument, "id" | "createdAt" | "updatedAt">;

export const SEMED_NUTRITION_MODALITIES = ["Creche", "Pré-Escola", "Ensino Fundamental", "EJA"] as const;
export type SemedNutritionModality = (typeof SEMED_NUTRITION_MODALITIES)[number];
export const SEMED_NUTRITION_WEEKLY_STATUSES = ["Em análise", "Ajustado", "Aprovado para guia", "Arquivado"] as const;
export type SemedNutritionWeeklyStatus = (typeof SEMED_NUTRITION_WEEKLY_STATUSES)[number];
export const SEMED_NUTRITION_ANNUAL_STATUSES = ["Em elaboração", "Em análise", "Aprovado", "Arquivado"] as const;
export type SemedNutritionAnnualStatus = (typeof SEMED_NUTRITION_ANNUAL_STATUSES)[number];
export type SemedNutritionSource = "Industrializado" | "Agricultura Familiar";
export type SemedNutritionBasis = "Por oferta" | "Mensal consolidado";
export type SemedNutritionConsumptionUnit = "g" | "ml" | "un";
export type SemedNutritionSupplyUnit = "KG" | "L" | "UN";

export type SemedNutritionSchool = { id: string; name: string; inep: string };
export type SemedNutritionContractProduct = { id: string; name: string; unit: SemedNutritionSupplyUnit; contractedQuantity: number; committedQuantity: number };
export type SemedNutritionContract = { id: string; number: string; entityName: string; status: "Ativo" | "Encerrado"; schoolIds: string[]; products: SemedNutritionContractProduct[] };
export type SemedNutritionWeeklyItem = { productId: string; weeklyQuantities: number[] };
export type SemedNutritionWeeklyPlan = {
  id: string; contractId: string; schoolId: string; referenceMonth: string; educationModality: SemedNutritionModality;
  status: SemedNutritionWeeklyStatus; weekDates: string[]; items: SemedNutritionWeeklyItem[]; notes: string; createdAt: string; updatedAt: string;
};
export type SemedNutritionWeeklyInput = Omit<SemedNutritionWeeklyPlan, "id" | "weekDates" | "createdAt" | "updatedAt"> & { id?: string };

export type SemedNutritionStage = { name: string; modality: string; totalStudents: number };
export type SemedNutritionCatalogItem = { key: string; name: string; source: SemedNutritionSource; category: string; supplyUnit: SemedNutritionSupplyUnit; availableQuantity: number };
export type SemedNutritionAnnualItem = {
  id: string; name: string; source: SemedNutritionSource; category: string; catalogKey: string; basis: SemedNutritionBasis;
  consumptionUnit: SemedNutritionConsumptionUnit; supplyUnit: SemedNutritionSupplyUnit; perCapita: number; monthlyOffers: number[];
};
export type SemedNutritionAnnualPlan = {
  id: string; name: string; referenceYear: number; modality: string; educationStage: string; periodStart: number; periodEnd: number;
  monthDays: number[]; items: SemedNutritionAnnualItem[]; status: SemedNutritionAnnualStatus; notes: string;
  enrollmentSnapshot: { totalStudents: number; capturedAt: string }; createdAt: string; updatedAt: string;
};
export type SemedNutritionAnnualInput = Omit<SemedNutritionAnnualPlan, "id" | "enrollmentSnapshot" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedNutritionAnnualResult = SemedNutritionAnnualItem & { monthlyNeeds: number[]; monthlyEffectiveOffers: number[]; totalNeed: number; coverage: number; toAcquire: number };

export type SemedLocalDatabase = {
  schemaVersion: 2;
  semedUsers: SemedLocalUser[];
  semedSessions: SemedLocalSession[];
  semedUserPermissions: SemedLocalUserPermission[];
  semedUserAuditLog: SemedLocalUserAudit[];
  semedRecords: Omit<SemedRecord, "payments" | "paidAmount" | "balanceAmount">[];
  semedRecordPayments: SemedRecordPayment[];
  semedDocuments: SemedDocument[];
  semedNutritionSchools: SemedNutritionSchool[];
  semedNutritionContracts: SemedNutritionContract[];
  semedNutritionWeeklyPlans: SemedNutritionWeeklyPlan[];
  semedNutritionStages: SemedNutritionStage[];
  semedNutritionCatalog: SemedNutritionCatalogItem[];
  semedNutritionAnnualPlans: SemedNutritionAnnualPlan[];
};

const STORAGE_KEY = "siga-semed-local-schema-v1";

function now() { return new Date().toISOString(); }
function localId(prefix: string) { return `${prefix}-${crypto.randomUUID()}`; }
function upper(value: string) { return value.trim().toLocaleUpperCase("pt-BR"); }
function normalizeCpf(value: string) { return value.replace(/\D/g, ""); }
function normalizeRegistration(value: string) { return value.trim().toLocaleLowerCase("pt-BR").replace(/\s+/g, ""); }
function provisionalPassword() { return `Siga-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}!`; }
function localPasswordDigest(value: string) {
  let hash = 2166136261;
  for (const character of value) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return `LOCAL:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

const DEFAULT_REGISTRATION_BY_USER_ID: Record<string, string> = {
  "u-admin": "00000000-0",
  "u-tecnico1": "00000001-9",
  "u-tecnico2": "00000002-7",
};

const SCHOOL_READ_KEYS: SemedModuleKey[] = ["inicio", "unidades_escolares", "unidades.mapa", "unidades.uex", "unidades.turmas"];
const LEGACY_TECHNICIAN_KEYS: SemedModuleKey[] = ["inicio", "contratos", "documentos"];

export function isSemedUserProfile(value: unknown): value is SemedUserProfile {
  return typeof value === "string" && (SEMED_USER_PROFILES as readonly string[]).includes(value);
}

export function isSemedModuleKey(value: unknown): value is SemedModuleKey {
  return typeof value === "string" && (SEMED_MODULE_KEYS as readonly string[]).includes(value);
}

export function profileLoginType(profile: SemedUserProfile): SemedLoginType {
  return profile === "Auditoria Externa" || profile === "Contadora Municipal" ? "cpf" : "matricula";
}

export function defaultModuleKeysForProfile(profile: SemedUserProfile, technicianKeys: SemedModuleKey[] = []): SemedModuleKey[] {
  if (profile === "Administrador") return [...SEMED_MODULE_KEYS];
  if (profile === "Técnico") return Array.from(new Set(technicianKeys.filter(isSemedModuleKey)));
  if (profile === "Gestor Escolar" || profile === "Secretário Escolar") return [...SCHOOL_READ_KEYS];
  return SEMED_MODULE_KEYS.filter((key) => key !== "usuarios");
}

export function buildLocalUserPermissions(userId: string, profile: SemedUserProfile, grantedBy: string, grantedAt: string, technicianKeys: SemedModuleKey[] = []): SemedLocalUserPermission[] {
  return defaultModuleKeysForProfile(profile, technicianKeys).map((moduleKey) => ({
    id: `permission-${userId}-${moduleKey.replace(/\./g, "-")}`,
    userId,
    moduleKey,
    granted: true,
    grantedBy,
    grantedAt,
  }));
}

function hasGrantedPermission(database: SemedLocalDatabase, userId: string, moduleKey: SemedModuleKey) {
  const direct = database.semedUserPermissions.some((permission) => permission.userId === userId && permission.moduleKey === moduleKey && permission.granted);
  if (direct) return true;
  if (!moduleKey.includes(".")) {
    return database.semedUserPermissions.some((permission) => permission.userId === userId && permission.granted && permission.moduleKey.startsWith(`${moduleKey}.`));
  }
  return false;
}

export function canReadLocalModule(database: SemedLocalDatabase, user: Pick<SemedLocalUser, "id" | "profile" | "active">, moduleKey: SemedModuleKey) {
  if (!user.active) return false;
  if (user.profile === "Administrador") return true;
  if (user.profile === "Auditoria Externa" || user.profile === "Contadora Municipal") return moduleKey !== "usuarios";
  return hasGrantedPermission(database, user.id, moduleKey);
}

export function canWriteLocalModule(database: SemedLocalDatabase, user: Pick<SemedLocalUser, "id" | "profile" | "active">, moduleKey: SemedModuleKey) {
  if (!canReadLocalModule(database, user, moduleKey)) return false;
  if (user.profile === "Administrador") return true;
  if (user.profile === "Auditoria Externa" || user.profile === "Gestor Escolar" || user.profile === "Secretário Escolar") return false;
  if (user.profile === "Contadora Municipal") return moduleKey === "financeiro" || moduleKey.startsWith("financeiro.");
  return hasGrantedPermission(database, user.id, moduleKey);
}

export function canManageLocalUsers(user: Pick<SemedLocalUser, "profile" | "active">) {
  return user.active && user.profile === "Administrador";
}

export function canAccessLocalSchoolUnit(user: Pick<SemedLocalUser, "profile" | "schoolUnitId" | "active">, schoolUnitId: string) {
  if (!user.active) return false;
  if (user.profile === "Gestor Escolar" || user.profile === "Secretário Escolar") return Boolean(user.schoolUnitId) && user.schoolUnitId === schoolUnitId;
  return true;
}

export function recordLocalUserAudit(database: SemedLocalDatabase, input: Omit<SemedLocalUserAudit, "id" | "createdAt">, timestamp = now()) {
  const entry: SemedLocalUserAudit = {
    ...input,
    id: localId("user-audit"),
    changedFields: Array.from(new Set(input.changedFields)).filter((field) => !/password|senha|cpf/i.test(field)),
    summary: input.summary.replace(/\b\d{11}\b/g, "CPF PROTEGIDO"),
    createdAt: timestamp,
  };
  database.semedUserAuditLog.unshift(entry);
  return entry;
}

function validateLocalUserInput(database: SemedLocalDatabase, input: SemedLocalUserInput, currentUserId = "") {
  const displayName = input.displayName.trim();
  const registration = normalizeRegistration(input.registration);
  const cpf = normalizeCpf(input.cpf);
  const loginType = profileLoginType(input.profile);
  if (!displayName) return "Informe o nome completo.";
  if (loginType === "matricula" && !registration) return "Informe a matrícula do usuário.";
  if (loginType === "cpf" && cpf.length !== 11) return "Informe um CPF com 11 dígitos para o perfil externo.";
  if ((input.profile === "Gestor Escolar" || input.profile === "Secretário Escolar") && !input.schoolUnitId.trim()) return "Selecione a unidade escolar vinculada.";
  if (registration && database.semedUsers.some((user) => user.id !== currentUserId && normalizeRegistration(user.registration || user.username) === registration)) return "Já existe um usuário com esta matrícula.";
  if (cpf && database.semedUsers.some((user) => user.id !== currentUserId && normalizeCpf(user.cpf) === cpf)) return "Já existe um usuário com este CPF.";
  return "";
}

function normalizedLocalUserInput(input: SemedLocalUserInput) {
  const loginType = profileLoginType(input.profile);
  const registration = loginType === "matricula" ? normalizeRegistration(input.registration) : "";
  const cpf = normalizeCpf(input.cpf);
  return {
    displayName: input.displayName.trim(),
    registration,
    cpf,
    profile: input.profile,
    role: input.profile,
    loginType,
    schoolUnitId: input.profile === "Gestor Escolar" || input.profile === "Secretário Escolar" ? input.schoolUnitId.trim() : "",
    serverRegistrationId: input.serverRegistrationId.trim(),
  };
}

export function createLocalUser(database: SemedLocalDatabase, input: SemedLocalUserInput, actorUserId: string, timestamp = now()): SemedLocalUserOperation {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canManageLocalUsers(actor)) return { error: "Usuário sem permissão para administrar acessos.", user: null };
  const error = validateLocalUserInput(database, input);
  if (error) return { error, user: null };
  const normalized = normalizedLocalUserInput(input);
  const password = provisionalPassword();
  const user: SemedLocalUser = {
    id: localId("user"),
    username: normalized.loginType === "cpf" ? normalized.cpf : normalized.registration,
    registration: normalized.registration,
    displayName: normalized.displayName,
    role: normalized.role,
    profile: normalized.profile,
    loginType: normalized.loginType,
    cpf: normalized.cpf,
    schoolUnitId: normalized.schoolUnitId,
    serverRegistrationId: normalized.serverRegistrationId,
    passwordHash: localPasswordDigest(password),
    passwordSalt: "",
    passwordIterations: 100000,
    mustChangePassword: true,
    provisionalPasswordIssuedAt: timestamp,
    active: input.active,
    createdAt: timestamp,
    updatedAt: timestamp,
    lastLoginAt: "",
    lastActivityAt: "",
  };
  database.semedUsers.push(user);
  database.semedUserPermissions.push(...buildLocalUserPermissions(user.id, user.profile, actorUserId, timestamp, input.moduleKeys));
  recordLocalUserAudit(database, { userId: user.id, action: "usuario.criado", changedFields: ["displayName", "registration", "profile", "active", "schoolUnitId", "serverRegistrationId", "permissions"], summary: `Usuário local criado com perfil ${user.profile}.`, actorUserId }, timestamp);
  return { error: null, user, provisionalPassword: password };
}

export function updateLocalUser(database: SemedLocalDatabase, userId: string, input: SemedLocalUserInput, actorUserId: string, timestamp = now()): SemedLocalUserOperation {
  const actor = database.semedUsers.find((candidate) => candidate.id === actorUserId);
  if (!actor || !canManageLocalUsers(actor)) return { error: "Usuário sem permissão para administrar acessos.", user: null };
  const user = database.semedUsers.find((candidate) => candidate.id === userId);
  if (!user) return { error: "Usuário não encontrado.", user: null };
  const error = validateLocalUserInput(database, input, userId);
  if (error) return { error, user: null };
  const normalized = normalizedLocalUserInput(input);
  const wasActive = user.active;
  Object.assign(user, normalized, { username: normalized.loginType === "cpf" ? normalized.cpf : normalized.registration, active: input.active, updatedAt: timestamp });
  if (!user.active) database.semedSessions = database.semedSessions.filter((session) => session.userId !== user.id);
  replaceLocalUserPermissions(database, user.id, user.profile, actorUserId, input.moduleKeys, timestamp);
  recordLocalUserAudit(database, {
    userId: user.id,
    action: wasActive === user.active ? "usuario.editado" : user.active ? "usuario.ativado" : "usuario.desativado",
    changedFields: ["displayName", "registration", "profile", "active", "schoolUnitId", "serverRegistrationId"],
    summary: `Cadastro local atualizado com perfil ${user.profile}.`,
    actorUserId,
  }, timestamp);
  return { error: null, user };
}

export function setLocalUserActive(database: SemedLocalDatabase, userId: string, active: boolean, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((candidate) => candidate.id === actorUserId);
  if (!actor || !canManageLocalUsers(actor) || (actorUserId === userId && !active)) return false;
  const user = database.semedUsers.find((candidate) => candidate.id === userId);
  if (!user) return false;
  user.active = active;
  user.updatedAt = timestamp;
  if (!active) database.semedSessions = database.semedSessions.filter((session) => session.userId !== userId);
  recordLocalUserAudit(database, { userId, action: active ? "usuario.ativado" : "usuario.desativado", changedFields: ["active"], summary: `Usuário local ${active ? "ativado" : "desativado"}.`, actorUserId }, timestamp);
  return true;
}

export function issueLocalProvisionalPassword(database: SemedLocalDatabase, userId: string, actorUserId: string, timestamp = now()): SemedLocalUserOperation {
  const actor = database.semedUsers.find((candidate) => candidate.id === actorUserId);
  if (!actor || !canManageLocalUsers(actor)) return { error: "Usuário sem permissão para administrar acessos.", user: null };
  const user = database.semedUsers.find((candidate) => candidate.id === userId);
  if (!user) return { error: "Usuário não encontrado.", user: null };
  const password = provisionalPassword();
  user.mustChangePassword = true;
  user.passwordHash = localPasswordDigest(password);
  user.passwordSalt = "";
  user.provisionalPasswordIssuedAt = timestamp;
  user.updatedAt = timestamp;
  database.semedSessions = database.semedSessions.filter((session) => session.userId !== userId);
  recordLocalUserAudit(database, { userId, action: "usuario.senha_provisoria", changedFields: ["mustChangePassword", "provisionalPasswordIssuedAt"], summary: "Nova senha provisória local emitida; o valor não foi registrado na auditoria.", actorUserId }, timestamp);
  return { error: null, user, provisionalPassword: password };
}

export function terminateLocalUserSessions(database: SemedLocalDatabase, userId: string, actorUserId: string) {
  const actor = database.semedUsers.find((candidate) => candidate.id === actorUserId);
  if (!actor || !canManageLocalUsers(actor)) return 0;
  const initial = database.semedSessions.length;
  database.semedSessions = database.semedSessions.filter((session) => session.userId !== userId);
  return initial - database.semedSessions.length;
}

export function listLocalUserAudit(database: SemedLocalDatabase, userId: string) {
  return database.semedUserAuditLog.filter((entry) => entry.userId === userId).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function replaceLocalUserPermissions(database: SemedLocalDatabase, userId: string, profile: SemedUserProfile, grantedBy: string, moduleKeys: SemedModuleKey[], timestamp = now()) {
  database.semedUserPermissions = database.semedUserPermissions.filter((permission) => permission.userId !== userId);
  const permissions = buildLocalUserPermissions(userId, profile, grantedBy, timestamp, moduleKeys);
  database.semedUserPermissions.push(...permissions);
  recordLocalUserAudit(database, { userId, action: "usuario.permissoes", changedFields: ["permissions"], summary: `${permissions.length} permissão(ões) local(is) definida(s).`, actorUserId: grantedBy }, timestamp);
  return permissions;
}
function normalizeCategory(input: Pick<SemedRecordInput, "kind" | "financialCategory" | "department" | "object">): SemedFinancialCategory {
  if (input.kind !== "Contrato") return "Sem controle";
  if (/ALUGUEL|ARRENDAMENTO/.test(`${input.department} ${input.object}`.toLocaleUpperCase("pt-BR"))) return "Aluguel";
  return input.financialCategory === "Aluguel" ? "Aluguel" : "Contrato geral";
}

function normalizeRecord(input: SemedRecordInput) {
  return {
    ...input,
    number: upper(input.number), object: upper(input.object), party: upper(input.party), department: upper(input.department),
    responsible: upper(input.responsible), notes: upper(input.notes), financialCategory: normalizeCategory(input),
    amount: Math.max(0, Number(input.amount) || 0), alertDays: Math.max(1, Number(input.alertDays) || 30),
  };
}

function normalizeDocument(input: SemedDocumentInput) {
  return {
    ...input,
    number: upper(input.number), subject: upper(input.subject), destination: upper(input.destination), recipient: upper(input.recipient),
    relatedRecord: upper(input.relatedRecord), responsible: upper(input.responsible), summary: upper(input.summary), notes: upper(input.notes),
  };
}

const localUsers: SemedLocalUser[] = [
  { id: "u-admin", username: "admin", registration: "00000000-0", displayName: "Administrador", role: "Administrador", profile: "Administrador", loginType: "matricula", cpf: "", schoolUnitId: "", serverRegistrationId: "", passwordHash: "", passwordSalt: "", passwordIterations: 100000, mustChangePassword: true, provisionalPasswordIssuedAt: "2026-01-01T12:00:00.000Z", active: true, createdAt: "2026-01-01T12:00:00.000Z", updatedAt: "2026-01-01T12:00:00.000Z", lastLoginAt: "", lastActivityAt: "" },
  { id: "u-tecnico1", username: "tecnico1", registration: "00000001-9", displayName: "Técnico SEMED 1", role: "Técnico", profile: "Técnico", loginType: "matricula", cpf: "", schoolUnitId: "", serverRegistrationId: "", passwordHash: "", passwordSalt: "", passwordIterations: 100000, mustChangePassword: true, provisionalPasswordIssuedAt: "2026-01-01T12:00:00.000Z", active: true, createdAt: "2026-01-01T12:00:00.000Z", updatedAt: "2026-01-01T12:00:00.000Z", lastLoginAt: "", lastActivityAt: "" },
  { id: "u-tecnico2", username: "tecnico2", registration: "00000002-7", displayName: "Técnico SEMED 2", role: "Técnico", profile: "Técnico", loginType: "matricula", cpf: "", schoolUnitId: "", serverRegistrationId: "", passwordHash: "", passwordSalt: "", passwordIterations: 100000, mustChangePassword: true, provisionalPasswordIssuedAt: "2026-01-01T12:00:00.000Z", active: true, createdAt: "2026-01-01T12:00:00.000Z", updatedAt: "2026-01-01T12:00:00.000Z", lastLoginAt: "", lastActivityAt: "" },
];

export function createLocalSemedDatabase(): SemedLocalDatabase {
  const createdAt = "2026-01-10T12:00:00.000Z";
  return {
    schemaVersion: 2,
    semedUsers: localUsers.map((user) => ({ ...user })),
    semedSessions: [],
    semedUserPermissions: localUsers.flatMap((user) => buildLocalUserPermissions(user.id, user.profile, "u-admin", createdAt, user.profile === "Técnico" ? LEGACY_TECHNICIAN_KEYS : [])),
    semedUserAuditLog: [],
    semedRecords: [
      { id: "r12", kind: "Contrato", number: "012/2026", object: "FORNECIMENTO DE MERENDA ESCOLAR", party: "COOPERATIVA VALE VERDE", department: "ALIMENTAÇÃO ESCOLAR", responsible: "EQUIPE TÉCNICA SEMED", amount: 348500, financialCategory: "Contrato geral", paymentDueDate: "2026-03-15", startDate: "2025-11-08", endDate: "2026-04-08", status: "Vigente", notes: "PREPARAR ANÁLISE PARA POSSÍVEL PRORROGAÇÃO.", alertDays: 30, createdAt, updatedAt: createdAt },
      { id: "r189", kind: "Processo", number: "189/2026", object: "AQUISIÇÃO DE KITS ESCOLARES", party: "SETOR DE COMPRAS", department: "ADMINISTRATIVO", responsible: "TÉCNICO RESPONSÁVEL", amount: 0, financialCategory: "Sem controle", paymentDueDate: "", startDate: "2026-02-11", endDate: "2026-05-12", status: "Em andamento", notes: "AGUARDANDO CONSOLIDAÇÃO DAS DEMANDAS DAS ESCOLAS.", alertDays: 45, createdAt, updatedAt: createdAt },
      { id: "r44", kind: "Contrato", number: "044/2025", object: "TRANSPORTE ESCOLAR RURAL", party: "TRANSEDU SERVIÇOS", department: "TRANSPORTE ESCOLAR", responsible: "COORDENAÇÃO DE TRANSPORTE", amount: 912000, financialCategory: "Contrato geral", paymentDueDate: "", startDate: "2025-07-01", endDate: "2026-03-20", status: "Vigente", notes: "VENCIDO. PRIORIZAR RENOVAÇÃO OU NOVO PROCEDIMENTO.", alertDays: 60, createdAt, updatedAt: createdAt },
      { id: "r27", kind: "Contrato", number: "027/2026", object: "MANUTENÇÃO PREDIAL DAS UNIDADES ESCOLARES", party: "CONSTRUTORA HORIZONTE", department: "INFRAESTRUTURA", responsible: "FISCAL DO CONTRATO", amount: 221750, financialCategory: "Contrato geral", paymentDueDate: "", startDate: "2026-03-06", endDate: "2026-06-29", status: "Vigente", notes: "ACOMPANHAR BOLETINS MENSAIS DE EXECUÇÃO.", alertDays: 30, createdAt, updatedAt: createdAt },
    ],
    semedRecordPayments: [
      { id: "p12-1", recordId: "r12", paymentDate: "2026-02-12", amount: 78500, notes: "1ª MEDIÇÃO — FORNECIMENTO PARCIAL.", createdAt },
      { id: "p44-1", recordId: "r44", paymentDate: "2025-12-18", amount: 190000, notes: "PAGAMENTO PARCIAL DO CONTRATO.", createdAt },
      { id: "p27-1", recordId: "r27", paymentDate: "2026-07-18", amount: 21750, notes: "BOLETIM DE EXECUÇÃO Nº 01.", createdAt },
    ],
    semedDocuments: [
      { id: "d694", kind: "Ofício", number: "694/2026", templateKey: "Solicitação ao RH Central", subject: "SOLICITAÇÃO AO RH CENTRAL", destination: "RH CENTRAL", recipient: "COORDENAÇÃO DE PESSOAL", relatedRecord: "PROCESSO 189/2026", responsible: "GABSAAF/SEMED", documentDate: "2026-08-22", dueDate: "2026-08-26", status: "Aguardando resposta", summary: "SOLICITA-SE PROVIDÊNCIAS QUANTO À ATUALIZAÇÃO DOS DADOS FUNCIONAIS INFORMADOS.", notes: "AGUARDAR RETORNO PARA JUNTADA AO PROCESSO.", createdAt, updatedAt: createdAt },
      { id: "d238", kind: "Memorando", number: "238/2026", templateKey: "Abertura de processo administrativo", subject: "SOLICITAÇÃO DE ABERTURA DE PROCESSO ADMINISTRATIVO PARA FINS DE PAGAMENTO", destination: "SECRETÁRIO MUNICIPAL DE EDUCAÇÃO | SEMED", recipient: "GABINETE", relatedRecord: "CONTRATO 012/2026", responsible: "COORDENAÇÃO ADMINISTRATIVA", documentDate: "2026-08-20", dueDate: "2026-08-21", status: "Aguardando resposta", summary: "SOLICITA-SE ABERTURA DE PROCESSO ADMINISTRATIVO PARA PAGAMENTO.", notes: "VERIFICAR DOCUMENTAÇÃO FISCAL.", createdAt, updatedAt: createdAt },
      { id: "d041", kind: "Despacho", number: "041/2026", templateKey: "Pagamento de nota fiscal", subject: "SOLICITAÇÃO DE PAGAMENTO REFERENTE À NOTA FISCAL", destination: "GABSAAF/SEMED", recipient: "SETOR FINANCEIRO", relatedRecord: "CONTRATO 027/2026", responsible: "FISCAL DO CONTRATO", documentDate: "2026-08-22", dueDate: "2026-08-29", status: "Em elaboração", summary: "ENCAMINHA-SE PARA ANÁLISE E PAGAMENTO DA NOTA FISCAL.", notes: "ANEXAR ATESTO DE RECEBIMENTO.", createdAt, updatedAt: createdAt },
    ],
    semedNutritionSchools: [
      { id: "nutrition-school-1", name: "Unidade Escolar Demonstrativa Norte", inep: "DEMO0001" },
      { id: "nutrition-school-2", name: "Unidade Escolar Demonstrativa Sul", inep: "DEMO0002" },
      { id: "nutrition-school-3", name: "Centro Educacional Demonstrativo", inep: "DEMO0003" },
    ],
    semedNutritionContracts: [
      { id: "nutrition-contract-af", number: "DEMO-AF-01/2026", entityName: "Fornecedor familiar demonstrativo", status: "Ativo", schoolIds: ["nutrition-school-1", "nutrition-school-2"], products: [
        { id: "nutrition-product-arroz", name: "Arroz demonstrativo", unit: "KG", contractedQuantity: 1200, committedQuantity: 280 },
        { id: "nutrition-product-feijao", name: "Feijão demonstrativo", unit: "KG", contractedQuantity: 720, committedQuantity: 190 },
      ] },
      { id: "nutrition-contract-industrial", number: "DEMO-IND-02/2026", entityName: "Fornecedor industrial demonstrativo", status: "Ativo", schoolIds: ["nutrition-school-2", "nutrition-school-3"], products: [
        { id: "nutrition-product-leite", name: "Bebida láctea demonstrativa", unit: "L", contractedQuantity: 980, committedQuantity: 240 },
        { id: "nutrition-product-biscoito", name: "Biscoito demonstrativo", unit: "KG", contractedQuantity: 540, committedQuantity: 120 },
      ] },
    ],
    semedNutritionWeeklyPlans: [
      { id: "nutrition-weekly-1", contractId: "nutrition-contract-af", schoolId: "nutrition-school-1", referenceMonth: "2026-08", educationModality: "Ensino Fundamental", status: "Em análise", weekDates: ["2026-08-03", "2026-08-10", "2026-08-17", "2026-08-24", "2026-08-31"], items: [
        { productId: "nutrition-product-arroz", weeklyQuantities: [24, 24, 24, 24, 24] },
        { productId: "nutrition-product-feijao", weeklyQuantities: [12, 12, 12, 12, 12] },
      ], notes: "Projeção demonstrativa local para validação do fluxo.", createdAt, updatedAt: createdAt },
    ],
    semedNutritionStages: [
      { name: "Creche", modality: "Educação Infantil", totalStudents: 120 },
      { name: "Pré-Escola", modality: "Educação Infantil", totalStudents: 180 },
      { name: "Ensino Fundamental - Anos Iniciais", modality: "Ensino Fundamental", totalStudents: 320 },
      { name: "Ensino Fundamental - Anos Finais", modality: "Ensino Fundamental", totalStudents: 260 },
      { name: "EJA - Anos Iniciais", modality: "EJA", totalStudents: 70 },
      { name: "EJA - Anos Finais", modality: "EJA", totalStudents: 55 },
      { name: "Atendimento Educacional Especial", modality: "Educação Especial", totalStudents: 40 },
    ],
    semedNutritionCatalog: [
      { key: "catalog-arroz", name: "Arroz demonstrativo", source: "Agricultura Familiar", category: "Gêneros", supplyUnit: "KG", availableQuantity: 920 },
      { key: "catalog-feijao", name: "Feijão demonstrativo", source: "Agricultura Familiar", category: "Gêneros", supplyUnit: "KG", availableQuantity: 530 },
      { key: "catalog-leite", name: "Bebida láctea demonstrativa", source: "Industrializado", category: "Lácteos", supplyUnit: "L", availableQuantity: 740 },
      { key: "catalog-biscoito", name: "Biscoito demonstrativo", source: "Industrializado", category: "Gêneros", supplyUnit: "KG", availableQuantity: 420 },
    ],
    semedNutritionAnnualPlans: [
      { id: "nutrition-annual-1", name: "Cardápio anual demonstrativo", referenceYear: 2026, modality: "Ensino Fundamental", educationStage: "Ensino Fundamental - Anos Iniciais", periodStart: 2, periodEnd: 12, monthDays: [0, 20, 22, 20, 21, 20, 10, 22, 21, 20, 20, 10], items: [
        { id: "nutrition-annual-item-1", name: "Arroz demonstrativo", source: "Agricultura Familiar", category: "Gêneros", catalogKey: "catalog-arroz", basis: "Por oferta", consumptionUnit: "g", supplyUnit: "KG", perCapita: 45, monthlyOffers: [0, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 4] },
        { id: "nutrition-annual-item-2", name: "Bebida láctea demonstrativa", source: "Industrializado", category: "Lácteos", catalogKey: "catalog-leite", basis: "Mensal consolidado", consumptionUnit: "ml", supplyUnit: "L", perCapita: 180, monthlyOffers: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
      ], status: "Em elaboração", notes: "Planejamento demonstrativo sem vínculo com o ambiente original.", enrollmentSnapshot: { totalStudents: 320, capturedAt: createdAt }, createdAt, updatedAt: createdAt },
    ],
  };
}

export function getLocalUserIdentity(username: string) {
  const cleanUsername = username.trim().toLowerCase() || "tecnico1";
  const cleanCpf = normalizeCpf(username);
  const user = createLocalSemedDatabase().semedUsers.find((candidate) => candidate.username === cleanUsername || normalizeRegistration(candidate.registration) === cleanUsername || (candidate.loginType === "cpf" && candidate.cpf === cleanCpf));
  return user
    ? { username: user.username, displayName: user.displayName, role: user.role }
    : { username: cleanUsername, displayName: cleanUsername, role: "Técnico" };
}

export type SemedLocalAccessUser = Pick<SemedLocalUser, "id" | "username" | "registration" | "displayName" | "role" | "profile" | "loginType" | "mustChangePassword" | "active">;
export type SemedLocalLogin = { user: SemedLocalAccessUser; session: SemedLocalSession };

export function requiresDeleteConfirmation(value: string) { return value.trim().toLocaleUpperCase("pt-BR") === "EXCLUIR"; }

export function loginLocalUser(database: SemedLocalDatabase, username: string, timestamp = now(), password = ""): SemedLocalLogin | null {
  const cleanUsername = username.trim().toLowerCase();
  const cleanCpf = normalizeCpf(username);
  const user = database.semedUsers.find((candidate) => candidate.active && (candidate.username === cleanUsername || normalizeRegistration(candidate.registration) === cleanUsername || (candidate.loginType === "cpf" && candidate.cpf === cleanCpf)));
  if (!user) return null;
  if (user.passwordHash.startsWith("LOCAL:") && localPasswordDigest(password) !== user.passwordHash) return null;
  const session: SemedLocalSession = {
    tokenHash: `local-session-${user.id}-${Date.parse(timestamp)}`,
    userId: user.id,
    expiresAt: new Date(Date.parse(timestamp) + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: timestamp,
  };
  database.semedSessions = database.semedSessions.filter((item) => item.userId !== user.id);
  database.semedSessions.push(session);
  user.lastLoginAt = timestamp;
  user.lastActivityAt = timestamp;
  user.updatedAt = timestamp;
  return { user: { id: user.id, username: user.username, registration: user.registration, displayName: user.displayName, role: user.role, profile: user.profile, loginType: user.loginType, mustChangePassword: user.mustChangePassword, active: user.active }, session };
}

export function completeLocalFirstAccess(database: SemedLocalDatabase, userId: string, timestamp = now(), newPassword = "") {
  const user = database.semedUsers.find((candidate) => candidate.id === userId && candidate.active);
  if (!user) return null;
  user.mustChangePassword = false;
  user.passwordHash = newPassword ? localPasswordDigest(newPassword) : "LOCAL_SIMULATION_UPDATED";
  user.passwordSalt = "";
  user.passwordIterations = 100000;
  user.updatedAt = timestamp;
  return { id: user.id, username: user.username, registration: user.registration, displayName: user.displayName, role: user.role, profile: user.profile, loginType: user.loginType, mustChangePassword: user.mustChangePassword, active: user.active } satisfies SemedLocalAccessUser;
}

export function logoutLocalSession(database: SemedLocalDatabase, tokenHash: string) {
  const initialCount = database.semedSessions.length;
  database.semedSessions = database.semedSessions.filter((session) => session.tokenHash !== tokenHash);
  return database.semedSessions.length < initialCount;
}

export function calculateFinancialPosition(contractAmount: number, payments: SemedRecordPayment[]) {
  const paidAmount = Math.round(payments.reduce((total, payment) => total + payment.amount, 0) * 100) / 100;
  return { paidAmount, balanceAmount: Math.max(Math.round((contractAmount - paidAmount) * 100) / 100, 0) };
}

export function parseBrazilianAmount(value: string) {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function listLocalRecords(database: SemedLocalDatabase): SemedRecord[] {
  return database.semedRecords.map((row) => {
    const payments = database.semedRecordPayments.filter((payment) => payment.recordId === row.id).sort((left, right) => right.paymentDate.localeCompare(left.paymentDate) || right.createdAt.localeCompare(left.createdAt));
    return { ...row, payments, ...calculateFinancialPosition(row.amount, payments) };
  }).sort((left, right) => {
    const leftClosed = /CONCLU[IÍ]DO|CANCELADO/i.test(left.status) ? 1 : 0;
    const rightClosed = /CONCLU[IÍ]DO|CANCELADO/i.test(right.status) ? 1 : 0;
    return leftClosed - rightClosed || (left.endDate || "9999-12-31").localeCompare(right.endDate || "9999-12-31") || right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function createLocalRecord(database: SemedLocalDatabase, input: SemedRecordInput, timestamp = now()) {
  const row = { id: localId("record"), ...normalizeRecord(input), createdAt: timestamp, updatedAt: timestamp };
  database.semedRecords.push(row);
  return row;
}

export function updateLocalRecord(database: SemedLocalDatabase, id: string, input: SemedRecordInput, timestamp = now()) {
  const index = database.semedRecords.findIndex((record) => record.id === id);
  if (index < 0) return null;
  const current = database.semedRecords[index];
  const updated = { id, ...normalizeRecord(input), createdAt: current.createdAt, updatedAt: timestamp };
  database.semedRecords[index] = updated;
  return updated;
}

export function deleteLocalRecord(database: SemedLocalDatabase, id: string) {
  const exists = database.semedRecords.some((record) => record.id === id);
  if (!exists) return false;
  database.semedRecords = database.semedRecords.filter((record) => record.id !== id);
  database.semedRecordPayments = database.semedRecordPayments.filter((payment) => payment.recordId !== id);
  return true;
}

export function createLocalPayment(database: SemedLocalDatabase, input: SemedRecordPaymentInput, timestamp = now()) {
  const record = database.semedRecords.find((candidate) => candidate.id === input.recordId);
  if (!record) return { error: "Registro não encontrado." };
  const financial = calculateFinancialPosition(record.amount, database.semedRecordPayments.filter((payment) => payment.recordId === input.recordId));
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Informe um valor de baixa válido." };
  if (amount > financial.balanceAmount) return { error: "O valor informado não pode superar o saldo demonstrativo do contrato." };
  database.semedRecordPayments.push({ id: localId("payment"), recordId: input.recordId, paymentDate: input.paymentDate, amount, notes: upper(input.notes) || "BAIXA REGISTRADA NA SIMULAÇÃO.", createdAt: timestamp });
  if (input.nextPaymentDueDate !== undefined) record.paymentDueDate = input.nextPaymentDueDate;
  record.updatedAt = timestamp;
  return { error: null };
}

export function deleteLocalPayment(database: SemedLocalDatabase, id: string, timestamp = now()) {
  const payment = database.semedRecordPayments.find((item) => item.id === id);
  if (!payment) return false;
  database.semedRecordPayments = database.semedRecordPayments.filter((item) => item.id !== id);
  const record = database.semedRecords.find((item) => item.id === payment.recordId);
  if (record) record.updatedAt = timestamp;
  return true;
}

export function createLocalDocument(database: SemedLocalDatabase, input: SemedDocumentInput, timestamp = now()) {
  const document = { id: localId("document"), ...normalizeDocument(input), createdAt: timestamp, updatedAt: timestamp };
  database.semedDocuments.push(document);
  return document;
}

export function updateLocalDocument(database: SemedLocalDatabase, id: string, input: SemedDocumentInput, timestamp = now()) {
  const index = database.semedDocuments.findIndex((document) => document.id === id);
  if (index < 0) return null;
  const current = database.semedDocuments[index];
  const document = { id, ...normalizeDocument(input), createdAt: current.createdAt, updatedAt: timestamp };
  database.semedDocuments[index] = document;
  return document;
}

export function deleteLocalDocument(database: SemedLocalDatabase, id: string) {
  const exists = database.semedDocuments.some((document) => document.id === id);
  database.semedDocuments = database.semedDocuments.filter((document) => document.id !== id);
  return exists;
}

export function confirmLocalRecordDeletion(database: SemedLocalDatabase, id: string, confirmation: string) {
  return requiresDeleteConfirmation(confirmation) ? deleteLocalRecord(database, id) : false;
}

export function confirmLocalDocumentDeletion(database: SemedLocalDatabase, id: string, confirmation: string) {
  return requiresDeleteConfirmation(confirmation) ? deleteLocalDocument(database, id) : false;
}

function roundNutrition(value: number) { return Math.round(value * 1000) / 1000; }
function nonNegative(value: unknown) { const numeric = Number(value); return Number.isFinite(numeric) ? Math.max(0, numeric) : 0; }
export function nutritionMondays(referenceMonth: string) {
  if (!/^\d{4}-\d{2}$/.test(referenceMonth)) return [];
  const [year, month] = referenceMonth.split("-").map(Number);
  const dates: string[] = [];
  const current = new Date(Date.UTC(year, month - 1, 1, 12));
  while (current.getUTCMonth() === month - 1) {
    if (current.getUTCDay() === 1) dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export function weeklyNutritionItemTotal(item: SemedNutritionWeeklyItem) {
  return roundNutrition(item.weeklyQuantities.reduce((total, value) => total + nonNegative(value), 0));
}

export function otherWeeklyNutritionPlanned(database: SemedLocalDatabase, contractId: string, productId: string, excludedPlanId = "") {
  return roundNutrition(database.semedNutritionWeeklyPlans
    .filter((plan) => plan.id !== excludedPlanId && plan.contractId === contractId && plan.status !== "Arquivado")
    .reduce((total, plan) => total + weeklyNutritionItemTotal(plan.items.find((item) => item.productId === productId) ?? { productId, weeklyQuantities: [] }), 0));
}

export function weeklyNutritionProductAnalysis(database: SemedLocalDatabase, plan: Pick<SemedNutritionWeeklyPlan, "id" | "contractId" | "items">) {
  const contract = database.semedNutritionContracts.find((candidate) => candidate.id === plan.contractId);
  return (contract?.products ?? []).map((product) => {
    const item = plan.items.find((candidate) => candidate.productId === product.id) ?? { productId: product.id, weeklyQuantities: [] };
    const otherPlanned = otherWeeklyNutritionPlanned(database, plan.contractId, product.id, plan.id);
    const available = roundNutrition(product.contractedQuantity - product.committedQuantity - otherPlanned);
    const projected = weeklyNutritionItemTotal(item);
    const remaining = roundNutrition(available - projected);
    const level = remaining < 0 ? "critical" : available > 0 && remaining / available <= 0.1 ? "warning" : "good";
    return { product, item, otherPlanned, available, projected, remaining, level } as const;
  });
}

export function saveLocalNutritionWeeklyPlan(database: SemedLocalDatabase, input: SemedNutritionWeeklyInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "nutricao.planejamento_semanal")) return { error: "Usuário sem permissão para alterar o planejamento semanal.", plan: null };
  const contract = database.semedNutritionContracts.find((candidate) => candidate.id === input.contractId && candidate.status === "Ativo");
  if (!contract) return { error: "Selecione um contrato ativo.", plan: null };
  if (!contract.schoolIds.includes(input.schoolId)) return { error: "Selecione uma escola atendida pelo contrato.", plan: null };
  const weekDates = nutritionMondays(input.referenceMonth);
  if (!weekDates.length) return { error: "Informe um mês de referência válido.", plan: null };
  const items = contract.products.map((product) => {
    const current = input.items.find((item) => item.productId === product.id);
    return { productId: product.id, weeklyQuantities: weekDates.map((_, index) => roundNutrition(nonNegative(current?.weeklyQuantities[index]))) };
  });
  const current = input.id ? database.semedNutritionWeeklyPlans.find((plan) => plan.id === input.id) : null;
  const plan: SemedNutritionWeeklyPlan = {
    id: current?.id ?? localId("nutrition-weekly"), contractId: contract.id, schoolId: input.schoolId, referenceMonth: input.referenceMonth,
    educationModality: input.educationModality, status: input.status, weekDates, items, notes: input.notes.trim(),
    createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp,
  };
  if (current) database.semedNutritionWeeklyPlans[database.semedNutritionWeeklyPlans.indexOf(current)] = plan;
  else database.semedNutritionWeeklyPlans.push(plan);
  return { error: null, plan };
}

export function archiveLocalNutritionWeeklyPlan(database: SemedLocalDatabase, planId: string, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "nutricao.planejamento_semanal")) return false;
  const plan = database.semedNutritionWeeklyPlans.find((candidate) => candidate.id === planId);
  if (!plan) return false;
  plan.status = "Arquivado";
  plan.updatedAt = timestamp;
  return true;
}

export function annualNutritionPlanResults(database: SemedLocalDatabase, plan: Pick<SemedNutritionAnnualPlan, "items" | "enrollmentSnapshot" | "monthDays">): SemedNutritionAnnualResult[] {
  const students = nonNegative(plan.enrollmentSnapshot.totalStudents);
  return plan.items.map((item) => {
    const divisor = item.consumptionUnit === "g" || item.consumptionUnit === "ml" ? 1000 : 1;
    const monthlyEffectiveOffers = Array.from({ length: 12 }, (_, index) => {
      const days = nonNegative(plan.monthDays[index]);
      if (!days) return 0;
      return item.basis === "Mensal consolidado" ? 1 : Math.min(days, nonNegative(item.monthlyOffers[index]));
    });
    const monthlyNeeds = monthlyEffectiveOffers.map((offers) => roundNutrition(students * nonNegative(item.perCapita) * offers / divisor));
    const totalNeed = roundNutrition(monthlyNeeds.reduce((total, value) => total + value, 0));
    const catalog = database.semedNutritionCatalog.find((candidate) => candidate.key === item.catalogKey && candidate.source === item.source);
    const coverage = roundNutrition(nonNegative(catalog?.availableQuantity));
    return { ...item, monthlyNeeds, monthlyEffectiveOffers, totalNeed, coverage, toAcquire: roundNutrition(Math.max(0, totalNeed - coverage)) };
  });
}

export function saveLocalNutritionAnnualPlan(database: SemedLocalDatabase, input: SemedNutritionAnnualInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "nutricao.planejamento_anual")) return { error: "Usuário sem permissão para alterar o planejamento anual.", plan: null };
  const stage = database.semedNutritionStages.find((candidate) => candidate.name === input.educationStage);
  if (!input.name.trim()) return { error: "Informe o nome do planejamento.", plan: null };
  if (!stage) return { error: "Selecione uma etapa de ensino válida.", plan: null };
  if (!Number.isInteger(input.referenceYear) || input.referenceYear < 2000 || input.referenceYear > 2100) return { error: "Informe um ano de referência válido.", plan: null };
  if (input.periodStart < 1 || input.periodEnd > 12 || input.periodStart > input.periodEnd) return { error: "Informe um período de atendimento válido.", plan: null };
  if (input.items.some((item) => !item.name.trim() || nonNegative(item.perCapita) <= 0)) return { error: "Informe produtos com nome e per capita maior que zero.", plan: null };
  const monthDays = Array.from({ length: 12 }, (_, index) => index + 1 >= input.periodStart && index + 1 <= input.periodEnd ? Math.round(nonNegative(input.monthDays[index])) : 0);
  const items = input.items.map((item) => {
    const matched = database.semedNutritionCatalog.find((candidate) => candidate.source === item.source && upper(candidate.name) === upper(item.name));
    const supplyUnit: SemedNutritionSupplyUnit = item.consumptionUnit === "g" ? "KG" : item.consumptionUnit === "ml" ? "L" : "UN";
    return {
      ...item, id: item.id || localId("nutrition-annual-item"), name: item.name.trim(), category: item.category.trim(), catalogKey: item.catalogKey || matched?.key || "",
      supplyUnit, perCapita: roundNutrition(nonNegative(item.perCapita)),
      monthlyOffers: Array.from({ length: 12 }, (_, index) => monthDays[index] ? item.basis === "Mensal consolidado" ? 1 : nonNegative(item.monthlyOffers[index]) : 0),
    };
  });
  const current = input.id ? database.semedNutritionAnnualPlans.find((plan) => plan.id === input.id) : null;
  const plan: SemedNutritionAnnualPlan = {
    id: current?.id ?? localId("nutrition-annual"), name: input.name.trim(), referenceYear: input.referenceYear, modality: stage.modality,
    educationStage: stage.name, periodStart: input.periodStart, periodEnd: input.periodEnd, monthDays, items, status: input.status, notes: input.notes.trim(),
    enrollmentSnapshot: { totalStudents: stage.totalStudents, capturedAt: timestamp }, createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp,
  };
  if (current) database.semedNutritionAnnualPlans[database.semedNutritionAnnualPlans.indexOf(current)] = plan;
  else database.semedNutritionAnnualPlans.push(plan);
  return { error: null, plan };
}

export function archiveLocalNutritionAnnualPlan(database: SemedLocalDatabase, planId: string, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "nutricao.planejamento_anual")) return false;
  const plan = database.semedNutritionAnnualPlans.find((candidate) => candidate.id === planId);
  if (!plan) return false;
  plan.status = "Arquivado";
  plan.updatedAt = timestamp;
  return true;
}

export function serializeLocalDatabase(database: SemedLocalDatabase) { return JSON.stringify(database); }
type LegacySemedLocalUser = Omit<SemedLocalUser, "registration" | "profile" | "loginType" | "cpf" | "schoolUnitId" | "serverRegistrationId" | "provisionalPasswordIssuedAt" | "lastActivityAt" | "role"> & { role: string };
type LegacySemedLocalDatabase = Omit<SemedLocalDatabase, "schemaVersion" | "semedUsers" | "semedUserPermissions" | "semedUserAuditLog"> & { schemaVersion: 1; semedUsers: LegacySemedLocalUser[] };

function normalizeLegacyProfile(role: string): SemedUserProfile {
  if (role === "Administrador") return "Administrador";
  return "Técnico";
}

export function migrateLocalDatabase(database: LegacySemedLocalDatabase): SemedLocalDatabase {
  const migratedUsers = database.semedUsers.map((user) => {
    const profile = normalizeLegacyProfile(user.role);
    return {
      ...user,
      registration: DEFAULT_REGISTRATION_BY_USER_ID[user.id] ?? normalizeRegistration(user.username),
      role: profile,
      profile,
      loginType: profileLoginType(profile),
      cpf: "",
      schoolUnitId: "",
      serverRegistrationId: "",
      provisionalPasswordIssuedAt: user.mustChangePassword ? user.createdAt : "",
      lastActivityAt: user.lastLoginAt,
    } satisfies SemedLocalUser;
  });
  const migratedAt = now();
  const nutritionDefaults = createLocalSemedDatabase();
  return {
    ...database,
    schemaVersion: 2,
    semedUsers: migratedUsers,
    semedUserPermissions: migratedUsers.flatMap((user) => buildLocalUserPermissions(user.id, user.profile, "u-admin", migratedAt, user.profile === "Técnico" ? LEGACY_TECHNICIAN_KEYS : [])),
    semedUserAuditLog: [],
    semedNutritionSchools: Array.isArray(database.semedNutritionSchools) ? database.semedNutritionSchools : nutritionDefaults.semedNutritionSchools,
    semedNutritionContracts: Array.isArray(database.semedNutritionContracts) ? database.semedNutritionContracts : nutritionDefaults.semedNutritionContracts,
    semedNutritionWeeklyPlans: Array.isArray(database.semedNutritionWeeklyPlans) ? database.semedNutritionWeeklyPlans : nutritionDefaults.semedNutritionWeeklyPlans,
    semedNutritionStages: Array.isArray(database.semedNutritionStages) ? database.semedNutritionStages : nutritionDefaults.semedNutritionStages,
    semedNutritionCatalog: Array.isArray(database.semedNutritionCatalog) ? database.semedNutritionCatalog : nutritionDefaults.semedNutritionCatalog,
    semedNutritionAnnualPlans: Array.isArray(database.semedNutritionAnnualPlans) ? database.semedNutritionAnnualPlans : nutritionDefaults.semedNutritionAnnualPlans,
  };
}

function normalizeCurrentDatabase(database: SemedLocalDatabase): SemedLocalDatabase {
  const nutritionDefaults = createLocalSemedDatabase();
  return {
    ...database,
    schemaVersion: 2,
    semedUsers: database.semedUsers.map((user) => ({
      ...user,
      registration: user.registration ?? DEFAULT_REGISTRATION_BY_USER_ID[user.id] ?? normalizeRegistration(user.username),
      profile: isSemedUserProfile(user.profile) ? user.profile : normalizeLegacyProfile(user.role),
      role: isSemedUserProfile(user.profile) ? user.profile : normalizeLegacyProfile(user.role),
      loginType: user.loginType === "cpf" ? "cpf" : "matricula",
      cpf: normalizeCpf(user.cpf ?? ""),
      schoolUnitId: user.schoolUnitId ?? "",
      serverRegistrationId: user.serverRegistrationId ?? "",
      provisionalPasswordIssuedAt: user.provisionalPasswordIssuedAt ?? "",
      lastActivityAt: user.lastActivityAt ?? user.lastLoginAt ?? "",
    })),
    semedUserPermissions: Array.isArray(database.semedUserPermissions) ? database.semedUserPermissions.filter((permission) => isSemedModuleKey(permission.moduleKey)) : [],
    semedUserAuditLog: Array.isArray(database.semedUserAuditLog) ? database.semedUserAuditLog : [],
    semedNutritionSchools: Array.isArray(database.semedNutritionSchools) ? database.semedNutritionSchools : nutritionDefaults.semedNutritionSchools,
    semedNutritionContracts: Array.isArray(database.semedNutritionContracts) ? database.semedNutritionContracts : nutritionDefaults.semedNutritionContracts,
    semedNutritionWeeklyPlans: Array.isArray(database.semedNutritionWeeklyPlans) ? database.semedNutritionWeeklyPlans : nutritionDefaults.semedNutritionWeeklyPlans,
    semedNutritionStages: Array.isArray(database.semedNutritionStages) ? database.semedNutritionStages : nutritionDefaults.semedNutritionStages,
    semedNutritionCatalog: Array.isArray(database.semedNutritionCatalog) ? database.semedNutritionCatalog : nutritionDefaults.semedNutritionCatalog,
    semedNutritionAnnualPlans: Array.isArray(database.semedNutritionAnnualPlans) ? database.semedNutritionAnnualPlans : nutritionDefaults.semedNutritionAnnualPlans,
  };
}

export function hydrateLocalDatabase(serialized: string) {
  try {
    const parsed = JSON.parse(serialized) as SemedLocalDatabase | LegacySemedLocalDatabase;
    if (parsed.schemaVersion === 1) return migrateLocalDatabase(parsed);
    if (parsed.schemaVersion === 2) return normalizeCurrentDatabase(parsed);
    return null;
  } catch {
    return null;
  }
}

function cloneDatabase(database: SemedLocalDatabase) { return structuredClone(database); }
export type SemedLocalStorage = Pick<Storage, "getItem" | "setItem">;
function browserStorage(): SemedLocalStorage | null { return typeof window === "undefined" ? null : window.localStorage; }
export function loadLocalDatabase(storage: SemedLocalStorage | null = browserStorage()) {
  const stored = storage?.getItem(STORAGE_KEY);
  if (!stored) return createLocalSemedDatabase();
  const hydrated = hydrateLocalDatabase(stored);
  if (!hydrated) return createLocalSemedDatabase();
  const normalized = serializeLocalDatabase(hydrated);
  if (normalized !== stored) storage?.setItem(STORAGE_KEY, normalized);
  return hydrated;
}
export function saveLocalDatabase(database: SemedLocalDatabase, storage: SemedLocalStorage | null = browserStorage()) { storage?.setItem(STORAGE_KEY, serializeLocalDatabase(database)); }

export function useSigaLocalRepository() {
  const [database, setDatabase] = useState(loadLocalDatabase);
  const databaseRef = useRef(database);
  const mutate = <T,>(operation: (draft: SemedLocalDatabase) => T) => {
    const draft = cloneDatabase(databaseRef.current);
    const result = operation(draft);
    databaseRef.current = draft;
    saveLocalDatabase(draft);
    setDatabase(draft);
    return result;
  };
  const records = useMemo(() => listLocalRecords(database), [database]);
  const documents = useMemo(() => [...database.semedDocuments].sort((left, right) => (left.dueDate || "9999-12-31").localeCompare(right.dueDate || "9999-12-31") || right.updatedAt.localeCompare(left.updatedAt)), [database]);
  const actorCanRead = (userId: string, moduleKey: SemedModuleKey) => {
    const user = databaseRef.current.semedUsers.find((candidate) => candidate.id === userId);
    return user ? canReadLocalModule(databaseRef.current, user, moduleKey) : false;
  };
  const actorCanWrite = (userId: string, moduleKey: SemedModuleKey) => {
    const user = databaseRef.current.semedUsers.find((candidate) => candidate.id === userId);
    return user ? canWriteLocalModule(databaseRef.current, user, moduleKey) : false;
  };
  return {
    records, documents, users: database.semedUsers, userPermissions: database.semedUserPermissions, userAuditLog: database.semedUserAuditLog,
    nutritionSchools: database.semedNutritionSchools, nutritionContracts: database.semedNutritionContracts,
    nutritionWeeklyPlans: database.semedNutritionWeeklyPlans, nutritionStages: database.semedNutritionStages,
    nutritionCatalog: database.semedNutritionCatalog, nutritionAnnualPlans: database.semedNutritionAnnualPlans,
    canRead(userId: string, moduleKey: SemedModuleKey) { return actorCanRead(userId, moduleKey); },
    canWrite(userId: string, moduleKey: SemedModuleKey) { return actorCanWrite(userId, moduleKey); },
    login(username: string, password = "") { return mutate((draft) => loginLocalUser(draft, username, undefined, password)); },
    completeFirstAccess(userId: string, newPassword = "") { return mutate((draft) => completeLocalFirstAccess(draft, userId, undefined, newPassword)); },
    changePassword(userId: string, newPassword = "") { return mutate((draft) => completeLocalFirstAccess(draft, userId, undefined, newPassword)); },
    logout(tokenHash: string) { return mutate((draft) => logoutLocalSession(draft, tokenHash)); },
    createUser(input: SemedLocalUserInput, actorUserId: string) { return mutate((draft) => createLocalUser(draft, input, actorUserId)); },
    updateUser(userId: string, input: SemedLocalUserInput, actorUserId: string) { return mutate((draft) => updateLocalUser(draft, userId, input, actorUserId)); },
    setUserActive(userId: string, active: boolean, actorUserId: string) { return mutate((draft) => setLocalUserActive(draft, userId, active, actorUserId)); },
    issueProvisionalPassword(userId: string, actorUserId: string) { return mutate((draft) => issueLocalProvisionalPassword(draft, userId, actorUserId)); },
    terminateUserSessions(userId: string, actorUserId: string) { return mutate((draft) => terminateLocalUserSessions(draft, userId, actorUserId)); },
    createRecord(input: SemedRecordInput, actorUserId: string) { return actorCanWrite(actorUserId, "contratos") ? mutate((draft) => createLocalRecord(draft, input)) : null; },
    updateRecord(id: string, input: SemedRecordInput, actorUserId: string) { return actorCanWrite(actorUserId, "contratos") ? mutate((draft) => updateLocalRecord(draft, id, input)) : null; },
    deleteRecord(id: string, actorUserId: string, confirmation = "EXCLUIR") { return actorCanWrite(actorUserId, "contratos") ? mutate((draft) => confirmLocalRecordDeletion(draft, id, confirmation)) : false; },
    createPayment(input: SemedRecordPaymentInput, actorUserId: string) { return actorCanWrite(actorUserId, "contratos") ? mutate((draft) => createLocalPayment(draft, input)) : { error: "Usuário sem permissão para alterar contratos." }; },
    deletePayment(id: string, actorUserId: string) { return actorCanWrite(actorUserId, "contratos") ? mutate((draft) => deleteLocalPayment(draft, id)) : false; },
    createDocument(input: SemedDocumentInput, actorUserId: string) { return actorCanWrite(actorUserId, "documentos") ? mutate((draft) => createLocalDocument(draft, input)) : null; },
    updateDocument(id: string, input: SemedDocumentInput, actorUserId: string) { return actorCanWrite(actorUserId, "documentos") ? mutate((draft) => updateLocalDocument(draft, id, input)) : null; },
    deleteDocument(id: string, actorUserId: string, confirmation = "EXCLUIR") { return actorCanWrite(actorUserId, "documentos") ? mutate((draft) => confirmLocalDocumentDeletion(draft, id, confirmation)) : false; },
    saveNutritionWeeklyPlan(input: SemedNutritionWeeklyInput, actorUserId: string) { return mutate((draft) => saveLocalNutritionWeeklyPlan(draft, input, actorUserId)); },
    archiveNutritionWeeklyPlan(planId: string, actorUserId: string) { return mutate((draft) => archiveLocalNutritionWeeklyPlan(draft, planId, actorUserId)); },
    saveNutritionAnnualPlan(input: SemedNutritionAnnualInput, actorUserId: string) { return mutate((draft) => saveLocalNutritionAnnualPlan(draft, input, actorUserId)); },
    archiveNutritionAnnualPlan(planId: string, actorUserId: string) { return mutate((draft) => archiveLocalNutritionAnnualPlan(draft, planId, actorUserId)); },
    weeklyNutritionAnalysis(plan: Pick<SemedNutritionWeeklyPlan, "id" | "contractId" | "items">) { return weeklyNutritionProductAnalysis(databaseRef.current, plan); },
    annualNutritionResults(plan: Pick<SemedNutritionAnnualPlan, "items" | "enrollmentSnapshot" | "monthDays">) { return annualNutritionPlanResults(databaseRef.current, plan); },
    resetSimulation() { const fresh = createLocalSemedDatabase(); databaseRef.current = fresh; saveLocalDatabase(fresh); setDatabase(fresh); },
  };
}

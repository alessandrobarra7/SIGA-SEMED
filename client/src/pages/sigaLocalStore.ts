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

export type SemedLocalDatabase = {
  schemaVersion: 2;
  semedUsers: SemedLocalUser[];
  semedSessions: SemedLocalSession[];
  semedUserPermissions: SemedLocalUserPermission[];
  semedUserAuditLog: SemedLocalUserAudit[];
  semedRecords: Omit<SemedRecord, "payments" | "paidAmount" | "balanceAmount">[];
  semedRecordPayments: SemedRecordPayment[];
  semedDocuments: SemedDocument[];
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
  return {
    ...database,
    schemaVersion: 2,
    semedUsers: migratedUsers,
    semedUserPermissions: migratedUsers.flatMap((user) => buildLocalUserPermissions(user.id, user.profile, "u-admin", migratedAt, user.profile === "Técnico" ? LEGACY_TECHNICIAN_KEYS : [])),
    semedUserAuditLog: [],
  };
}

function normalizeCurrentDatabase(database: SemedLocalDatabase): SemedLocalDatabase {
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
    resetSimulation() { const fresh = createLocalSemedDatabase(); databaseRef.current = fresh; saveLocalDatabase(fresh); setDatabase(fresh); },
  };
}

import { useMemo, useRef, useState } from "react";

export type SemedRecordKind = "Contrato" | "Processo";
export type SemedFinancialCategory = "Sem controle" | "Contrato geral" | "Aluguel";
export type SemedDocumentKind = "Ofício" | "Memorando" | "Despacho";

/** Estrutura local compatível com semed_users; nunca contém senhas ou hashes da referência. */
export type SemedLocalUser = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  mustChangePassword: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
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
  schemaVersion: 1;
  semedUsers: SemedLocalUser[];
  semedSessions: SemedLocalSession[];
  semedRecords: Omit<SemedRecord, "payments" | "paidAmount" | "balanceAmount">[];
  semedRecordPayments: SemedRecordPayment[];
  semedDocuments: SemedDocument[];
};

const STORAGE_KEY = "siga-semed-local-schema-v1";

function now() { return new Date().toISOString(); }
function localId(prefix: string) { return `${prefix}-${crypto.randomUUID()}`; }
function upper(value: string) { return value.trim().toLocaleUpperCase("pt-BR"); }
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
  { id: "u-admin", username: "admin", displayName: "Administrador", role: "Administrador", passwordHash: "", passwordSalt: "", passwordIterations: 100000, mustChangePassword: true, active: true, createdAt: "2026-01-01T12:00:00.000Z", updatedAt: "2026-01-01T12:00:00.000Z", lastLoginAt: "" },
  { id: "u-tecnico1", username: "tecnico1", displayName: "Técnico SEMED 1", role: "Técnico", passwordHash: "", passwordSalt: "", passwordIterations: 100000, mustChangePassword: true, active: true, createdAt: "2026-01-01T12:00:00.000Z", updatedAt: "2026-01-01T12:00:00.000Z", lastLoginAt: "" },
  { id: "u-tecnico2", username: "tecnico2", displayName: "Técnico SEMED 2", role: "Técnico", passwordHash: "", passwordSalt: "", passwordIterations: 100000, mustChangePassword: true, active: true, createdAt: "2026-01-01T12:00:00.000Z", updatedAt: "2026-01-01T12:00:00.000Z", lastLoginAt: "" },
];

export function createLocalSemedDatabase(): SemedLocalDatabase {
  const createdAt = "2026-01-10T12:00:00.000Z";
  return {
    schemaVersion: 1,
    semedUsers: localUsers.map((user) => ({ ...user })),
    semedSessions: [],
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
  const user = createLocalSemedDatabase().semedUsers.find((candidate) => candidate.username === cleanUsername);
  return user
    ? { username: user.username, displayName: user.displayName, role: user.role }
    : { username: cleanUsername, displayName: cleanUsername, role: "Técnico" };
}

export type SemedLocalAccessUser = Pick<SemedLocalUser, "id" | "username" | "displayName" | "role" | "mustChangePassword">;
export type SemedLocalLogin = { user: SemedLocalAccessUser; session: SemedLocalSession };

export function requiresDeleteConfirmation(value: string) { return value.trim().toLocaleUpperCase("pt-BR") === "EXCLUIR"; }

export function loginLocalUser(database: SemedLocalDatabase, username: string, timestamp = now()): SemedLocalLogin | null {
  const cleanUsername = username.trim().toLowerCase();
  const user = database.semedUsers.find((candidate) => candidate.username === cleanUsername && candidate.active);
  if (!user) return null;
  const session: SemedLocalSession = {
    tokenHash: `local-session-${user.id}-${Date.parse(timestamp)}`,
    userId: user.id,
    expiresAt: new Date(Date.parse(timestamp) + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: timestamp,
  };
  database.semedSessions = database.semedSessions.filter((item) => item.userId !== user.id);
  database.semedSessions.push(session);
  user.lastLoginAt = timestamp;
  user.updatedAt = timestamp;
  return { user: { id: user.id, username: user.username, displayName: user.displayName, role: user.role, mustChangePassword: user.mustChangePassword }, session };
}

export function completeLocalFirstAccess(database: SemedLocalDatabase, userId: string, timestamp = now()) {
  const user = database.semedUsers.find((candidate) => candidate.id === userId && candidate.active);
  if (!user) return null;
  user.mustChangePassword = false;
  user.passwordHash = "LOCAL_SIMULATION_UPDATED";
  user.passwordSalt = "";
  user.passwordIterations = 100000;
  user.updatedAt = timestamp;
  return { id: user.id, username: user.username, displayName: user.displayName, role: user.role, mustChangePassword: user.mustChangePassword } satisfies SemedLocalAccessUser;
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
export function hydrateLocalDatabase(serialized: string) {
  try { const parsed = JSON.parse(serialized) as SemedLocalDatabase; return parsed.schemaVersion === 1 ? parsed : null; } catch { return null; }
}

function cloneDatabase(database: SemedLocalDatabase) { return structuredClone(database); }
export type SemedLocalStorage = Pick<Storage, "getItem" | "setItem">;
function browserStorage(): SemedLocalStorage | null { return typeof window === "undefined" ? null : window.localStorage; }
export function loadLocalDatabase(storage: SemedLocalStorage | null = browserStorage()) {
  const stored = storage?.getItem(STORAGE_KEY);
  if (!stored) return createLocalSemedDatabase();
  return hydrateLocalDatabase(stored) ?? createLocalSemedDatabase();
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
  return {
    records, documents,
    login(username: string) { return mutate((draft) => loginLocalUser(draft, username)); },
    completeFirstAccess(userId: string) { return mutate((draft) => completeLocalFirstAccess(draft, userId)); },
    changePassword(userId: string) { return mutate((draft) => completeLocalFirstAccess(draft, userId)); },
    logout(tokenHash: string) { return mutate((draft) => logoutLocalSession(draft, tokenHash)); },
    createRecord(input: SemedRecordInput) { return mutate((draft) => createLocalRecord(draft, input)); },
    updateRecord(id: string, input: SemedRecordInput) { return mutate((draft) => updateLocalRecord(draft, id, input)); },
    deleteRecord(id: string, confirmation = "EXCLUIR") { return mutate((draft) => confirmLocalRecordDeletion(draft, id, confirmation)); },
    createPayment(input: SemedRecordPaymentInput) { return mutate((draft) => createLocalPayment(draft, input)); },
    deletePayment(id: string) { return mutate((draft) => deleteLocalPayment(draft, id)); },
    createDocument(input: SemedDocumentInput) { return mutate((draft) => createLocalDocument(draft, input)); },
    updateDocument(id: string, input: SemedDocumentInput) { return mutate((draft) => updateLocalDocument(draft, id, input)); },
    deleteDocument(id: string, confirmation = "EXCLUIR") { return mutate((draft) => confirmLocalDocumentDeletion(draft, id, confirmation)); },
    resetSimulation() { const fresh = createLocalSemedDatabase(); databaseRef.current = fresh; saveLocalDatabase(fresh); setDatabase(fresh); },
  };
}

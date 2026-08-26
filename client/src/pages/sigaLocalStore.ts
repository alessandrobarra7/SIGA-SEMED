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
  "configuracoes",
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

export const SEMED_STOCK_SCOPES = ["Industrializado", "Kit do Aluno", "Alimentação Escolar", "Material de Limpeza", "Material de Expediente"] as const;
export type SemedStockScope = (typeof SEMED_STOCK_SCOPES)[number];
export type SemedStockMovementType = "Entrada" | "Saída" | "Ajuste";
export type SemedStockSituation = "Disponível" | "Estoque baixo" | "Sem saldo" | "Inativo";
export type SemedStockAuditStatus = "Em andamento" | "Concluída";
export type SemedSchoolStockCountStatus = "Pendente" | "Conferida" | "Com divergência";
export type SemedKitOrderStatus = "Em andamento" | "Recebido" | "Distribuído" | "Arquivado";

export type SemedStockItem = {
  id: string; scope: SemedStockScope; code: string; name: string; category: string; unit: "KG" | "L" | "UN";
  minimumQuantity: number; balance: number; location: string; barcode: string; active: boolean; unitCost: number; createdAt: string; updatedAt: string;
};
export type SemedStockItemInput = Omit<SemedStockItem, "id" | "balance" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedStockMovement = {
  id: string; scope: SemedStockScope; itemId: string; type: SemedStockMovementType; quantity: number; origin: string; destination: string; reference: string; notes: string; movementDate: string; actorUserId: string; createdAt: string;
};
export type SemedStockMovementInput = Omit<SemedStockMovement, "id" | "createdAt" | "actorUserId">;
export type SemedStockAuditEntry = { itemId: string; registeredBalance: number; countedQuantity: number; difference: number };
export type SemedStockAudit = { id: string; scope: SemedStockScope; status: SemedStockAuditStatus; notes: string; entries: SemedStockAuditEntry[]; openedAt: string; closedAt: string; actorUserId: string };
export type SemedSchoolStock = { id: string; scope: Exclude<SemedStockScope, "Industrializado" | "Kit do Aluno">; schoolId: string; itemId: string; balance: number; guideReference: string; updatedAt: string };
export type SemedSchoolStockCount = { id: string; schoolStockId: string; countedQuantity: number; status: SemedSchoolStockCountStatus; notes: string; countedAt: string; actorUserId: string };
export type SemedSchoolStockMovement = { id: string; schoolStockId: string; type: "Recebimento" | "Consumo" | "Ajuste"; quantity: number; reference: string; notes: string; movementDate: string; actorUserId: string };
export type SemedKitOrderItem = { itemId: string; requestedQuantity: number; receivedQuantity: number; distributedQuantity: number };
export type SemedKitOrder = { id: string; schoolId: string; className: string; referenceYear: number; status: SemedKitOrderStatus; items: SemedKitOrderItem[]; notes: string; createdAt: string; updatedAt: string };
export type SemedKitOrderInput = Omit<SemedKitOrder, "id" | "createdAt" | "updatedAt"> & { id?: string };

export const SEMED_HR_SERVER_STATUSES = ["Ativo", "Aguardando revisão", "Inativo"] as const;
export type SemedHrServerStatus = (typeof SEMED_HR_SERVER_STATUSES)[number];
export const SEMED_HR_ATTENDANCE_STATUSES = ["Em preparação", "Aguardando gestora", "Enviada ao RH", "Devolvida para correção"] as const;
export type SemedHrAttendanceStatus = (typeof SEMED_HR_ATTENDANCE_STATUSES)[number];
export type SemedHrCalendarEventType = "Feriado" | "Ponto facultativo" | "Recesso escolar" | "Suspensão de atividades" | "Sábado letivo" | "Reposição" | "Outra ocorrência";
export type SemedHrAuditAction = "servidor.criado" | "servidor.editado" | "competencia.criada" | "competencia.atualizada" | "competencia.enviada" | "competencia.devolvida";

export type SemedHrServer = {
  id: string; registration: string; displayName: string; cpf: string; jobTitle: string; schoolUnitId: string;
  status: SemedHrServerStatus; admissionDate: string; hasPhone: boolean; hasEmail: boolean; hasIc: boolean;
  baseSalary: number; createdAt: string; updatedAt: string;
};
export type SemedHrServerInput = Omit<SemedHrServer, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedHrFinancialItem = { description: string; kind: "Provento" | "Desconto"; amount: number };
export type SemedHrFinancialRecord = { id: string; serverId: string; referenceMonth: string; items: SemedHrFinancialItem[]; notes: string; createdAt: string; updatedAt: string };
export type SemedHrFinancialRecordInput = Omit<SemedHrFinancialRecord, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedHrCalendarEvent = { id: string; date: string; type: SemedHrCalendarEventType; description: string };
export type SemedHrAttendanceEntry = { serverId: string; workedDays: number; absences: number; notes: string };
export type SemedHrAttendancePeriod = {
  id: string; code: string; referenceMonth: string; schoolUnitId: string; plannedDays: number; calendarEvents: SemedHrCalendarEvent[];
  entries: SemedHrAttendanceEntry[]; status: SemedHrAttendanceStatus; returnReason: string; createdAt: string; updatedAt: string;
};
export type SemedHrAttendanceInput = Omit<SemedHrAttendancePeriod, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedHrAudit = { id: string; action: SemedHrAuditAction; targetId: string; summary: string; actorUserId: string; createdAt: string };

export type SemedSchoolUnitType = "Municipal" | "Conveniada";
export type SemedSchoolUnitStatus = "Ativa" | "Inativa";
export type SemedSchoolUnit = {
  id: string; code: string; name: string; type: SemedSchoolUnitType; status: SemedSchoolUnitStatus;
  censusYear: number; neighborhood: string; address: string; students: number; hasUex: boolean; hasMap: boolean; createdAt: string; updatedAt: string;
};
export type SemedSchoolUnitInput = Omit<SemedSchoolUnit, "id" | "createdAt" | "updatedAt"> & { id?: string };

export type SemedEducaClassification = "Pedagógico" | "Esportivo" | "Pleno";
export type SemedEducaStatus = "Ativo" | "Inativo";
export type SemedEducaNucleus = {
  id: string; code: string; name: string; classification: SemedEducaClassification; status: SemedEducaStatus;
  roomCount: number; capacityPerShift: number; activities: string[]; sportModalities: string[]; address: string;
  coordination: string; supervision: string; integratedNutrition: boolean; createdAt: string; updatedAt: string;
};
export type SemedEducaNucleusInput = Omit<SemedEducaNucleus, "id" | "createdAt" | "updatedAt"> & { id?: string };

export type SemedFinanceEntryStatus = "Ativo" | "Cancelado";
export type SemedFinanceRevenueType = "Repasse" | "Rendimento" | "Saldo reprogramado" | "Contrapartida";
export type SemedFinanceExecutionStage = "Empenhado" | "Liquidado" | "Pago" | "Apropriação legal";
export type SemedFinanceAuditAction = "fonte.salva" | "regra.salva" | "planejamento.salvo" | "receita.salva" | "execucao.salva" | "lancamento.cancelado";

export type SemedFinanceSource = { id: string; code: string; name: string; category: string; openingBalance: number; active: boolean; createdAt: string; updatedAt: string };
export type SemedFinanceSourceInput = Omit<SemedFinanceSource, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedFinanceRule = { id: string; code: string; name: string; targetPercentage: number; description: string; referenceYear: number; active: boolean; createdAt: string; updatedAt: string };
export type SemedFinanceRuleInput = Omit<SemedFinanceRule, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedFinancePlanningEntry = { id: string; referenceMonth: string; sourceId: string; program: string; description: string; expenseNature: string; plannedAmount: number; status: SemedFinanceEntryStatus; createdAt: string; updatedAt: string };
export type SemedFinancePlanningInput = Omit<SemedFinancePlanningEntry, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedFinanceRevenue = { id: string; receiptDate: string; sourceId: string; component: string; type: SemedFinanceRevenueType; reference: string; amount: number; status: SemedFinanceEntryStatus; createdAt: string; updatedAt: string };
export type SemedFinanceRevenueInput = Omit<SemedFinanceRevenue, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedFinanceExecution = { id: string; executionDate: string; sourceId: string; stage: SemedFinanceExecutionStage; description: string; classification: string; documentReference: string; amount: number; status: SemedFinanceEntryStatus; createdAt: string; updatedAt: string };
export type SemedFinanceExecutionInput = Omit<SemedFinanceExecution, "id" | "createdAt" | "updatedAt"> & { id?: string };
export type SemedFinanceAudit = { id: string; action: SemedFinanceAuditAction; targetId: string; summary: string; actorUserId: string; createdAt: string };
export type SemedFinanceSummary = { planned: number; revenues: number; committed: number; settled: number; paid: number; availability: number };

export type SemedInstitutionSettings = {
  id: string; institutionName: string; acronym: string; municipality: string; referenceYear: number; timezone: string;
  notificationsEnabled: boolean; deadlineAlertDays: number; sessionDays: number; minimumPasswordLength: number; maintenanceMessage: string; updatedAt: string; updatedBy: string;
};
export type SemedInstitutionSettingsInput = Omit<SemedInstitutionSettings, "id" | "updatedAt" | "updatedBy">;
export type SemedInstitutionSettingsAudit = { id: string; action: "configuracoes.salvas"; changedFields: string[]; summary: string; actorUserId: string; createdAt: string };

export type SemedLocalDatabase = {
  schemaVersion: 7;
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
  semedStockItems: SemedStockItem[];
  semedStockMovements: SemedStockMovement[];
  semedStockAudits: SemedStockAudit[];
  semedSchoolStocks: SemedSchoolStock[];
  semedSchoolStockCounts: SemedSchoolStockCount[];
  semedSchoolStockMovements: SemedSchoolStockMovement[];
  semedKitOrders: SemedKitOrder[];
  semedHrServers: SemedHrServer[];
  semedHrFinancialRecords: SemedHrFinancialRecord[];
  semedHrAttendancePeriods: SemedHrAttendancePeriod[];
  semedHrAuditLog: SemedHrAudit[];
  semedSchoolUnits: SemedSchoolUnit[];
  semedEducaNuclei: SemedEducaNucleus[];
  semedFinanceSources: SemedFinanceSource[];
  semedFinanceRules: SemedFinanceRule[];
  semedFinancePlanningEntries: SemedFinancePlanningEntry[];
  semedFinanceRevenues: SemedFinanceRevenue[];
  semedFinanceExecutions: SemedFinanceExecution[];
  semedFinanceAuditLog: SemedFinanceAudit[];
  semedInstitutionSettings: SemedInstitutionSettings;
  semedInstitutionSettingsAuditLog: SemedInstitutionSettingsAudit[];
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
  const createdAt = now();
  return {
    schemaVersion: 7,
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
    semedStockItems: [
      { id: "stock-rice", scope: "Industrializado", code: "EST-DEMO-001", name: "Arroz demonstrativo", category: "Alimentação Escolar", unit: "KG", minimumQuantity: 180, balance: 520, location: "Almoxarifado central", barcode: "", active: true, unitCost: 6.8, createdAt, updatedAt: createdAt },
      { id: "stock-milk", scope: "Industrializado", code: "EST-DEMO-002", name: "Bebida láctea demonstrativa", category: "Alimentação Escolar", unit: "L", minimumQuantity: 110, balance: 90, location: "Almoxarifado central", barcode: "", active: true, unitCost: 4.4, createdAt, updatedAt: createdAt },
      { id: "stock-biscuit", scope: "Industrializado", code: "EST-DEMO-003", name: "Biscoito demonstrativo", category: "Alimentação Escolar", unit: "KG", minimumQuantity: 80, balance: 0, location: "Almoxarifado central", barcode: "", active: true, unitCost: 12.5, createdAt, updatedAt: createdAt },
      { id: "stock-backpack", scope: "Kit do Aluno", code: "KIT-DEMO-001", name: "Mochila demonstrativa", category: "Fardamento e kit", unit: "UN", minimumQuantity: 50, balance: 180, location: "Almoxarifado de kits", barcode: "", active: true, unitCost: 42, createdAt, updatedAt: createdAt },
      { id: "stock-notebook", scope: "Kit do Aluno", code: "KIT-DEMO-002", name: "Caderno demonstrativo", category: "Material escolar", unit: "UN", minimumQuantity: 120, balance: 360, location: "Almoxarifado de kits", barcode: "", active: true, unitCost: 7.2, createdAt, updatedAt: createdAt },
      { id: "stock-banana", scope: "Alimentação Escolar", code: "ALI-DEMO-001", name: "Fruta demonstrativa", category: "Alimentação Escolar", unit: "KG", minimumQuantity: 30, balance: 135, location: "Unidade escolar", barcode: "", active: true, unitCost: 5.5, createdAt, updatedAt: createdAt },
      { id: "stock-detergent", scope: "Material de Limpeza", code: "LIM-DEMO-001", name: "Detergente demonstrativo", category: "Limpeza", unit: "UN", minimumQuantity: 18, balance: 48, location: "Unidade escolar", barcode: "", active: true, unitCost: 3.2, createdAt, updatedAt: createdAt },
      { id: "stock-paper", scope: "Material de Expediente", code: "EXP-DEMO-001", name: "Papel A4 demonstrativo", category: "Expediente", unit: "UN", minimumQuantity: 10, balance: 32, location: "Unidade escolar", barcode: "", active: true, unitCost: 28, createdAt, updatedAt: createdAt },
    ],
    semedStockMovements: [
      { id: "stock-movement-1", scope: "Industrializado", itemId: "stock-rice", type: "Entrada", quantity: 520, origin: "Fornecedor demonstrativo", destination: "Almoxarifado central", reference: "REC-DEMO-001", notes: "Recebimento demonstrativo local.", movementDate: "2026-08-03", actorUserId: "u-admin", createdAt },
      { id: "stock-movement-2", scope: "Industrializado", itemId: "stock-milk", type: "Entrada", quantity: 90, origin: "Fornecedor demonstrativo", destination: "Almoxarifado central", reference: "REC-DEMO-002", notes: "Recebimento demonstrativo local.", movementDate: "2026-08-08", actorUserId: "u-admin", createdAt },
    ],
    semedStockAudits: [],
    semedSchoolStocks: [
      { id: "school-stock-food-1", scope: "Alimentação Escolar", schoolId: "nutrition-school-1", itemId: "stock-banana", balance: 135, guideReference: "GUIA-DEMO-001", updatedAt: createdAt },
      { id: "school-stock-cleaning-1", scope: "Material de Limpeza", schoolId: "nutrition-school-2", itemId: "stock-detergent", balance: 48, guideReference: "GUIA-DEMO-002", updatedAt: createdAt },
      { id: "school-stock-office-1", scope: "Material de Expediente", schoolId: "nutrition-school-3", itemId: "stock-paper", balance: 32, guideReference: "GUIA-DEMO-003", updatedAt: createdAt },
    ],
    semedSchoolStockCounts: [],
    semedSchoolStockMovements: [],
    semedKitOrders: [],
    semedHrServers: [
      { id: "hr-server-1", registration: "HR-DEMO-001", displayName: "Servidor demonstrativo 01", cpf: "", jobTitle: "Professor demonstrativo", schoolUnitId: "nutrition-school-1", status: "Ativo", admissionDate: "2024-02-01", hasPhone: true, hasEmail: true, hasIc: false, baseSalary: 3200, createdAt, updatedAt: createdAt },
      { id: "hr-server-2", registration: "HR-DEMO-002", displayName: "Servidor demonstrativo 02", cpf: "", jobTitle: "Assistente administrativo demonstrativo", schoolUnitId: "nutrition-school-2", status: "Aguardando revisão", admissionDate: "2025-03-10", hasPhone: false, hasEmail: true, hasIc: false, baseSalary: 2100, createdAt, updatedAt: createdAt },
      { id: "hr-server-3", registration: "HR-DEMO-003", displayName: "Servidor demonstrativo 03", cpf: "", jobTitle: "Merendeiro demonstrativo", schoolUnitId: "nutrition-school-3", status: "Ativo", admissionDate: "2023-08-15", hasPhone: true, hasEmail: false, hasIc: true, baseSalary: 1800, createdAt, updatedAt: createdAt },
    ],
    semedHrFinancialRecords: [
      { id: "hr-financial-1", serverId: "hr-server-1", referenceMonth: "2026-07", items: [{ description: "Vencimento demonstrativo", kind: "Provento", amount: 3200 }, { description: "Desconto demonstrativo", kind: "Desconto", amount: 180 }], notes: "Registro demonstrativo local.", createdAt, updatedAt: createdAt },
    ],
    semedHrAttendancePeriods: [
      { id: "hr-attendance-1", code: "SIGA-FREQ-DEMO-001", referenceMonth: "2026-07", schoolUnitId: "nutrition-school-1", plannedDays: 22, calendarEvents: [], entries: [{ serverId: "hr-server-1", workedDays: 22, absences: 0, notes: "Frequência demonstrativa." }], status: "Em preparação", returnReason: "", createdAt, updatedAt: createdAt },
    ],
    semedHrAuditLog: [],
    semedSchoolUnits: [
      { id: "nutrition-school-1", code: "UE-DEMO-001", name: "Unidade Escolar Demonstrativa Norte", type: "Municipal", status: "Ativa", censusYear: 2026, neighborhood: "Setor demonstrativo Norte", address: "Endereço demonstrativo 01", students: 420, hasUex: true, hasMap: true, createdAt, updatedAt: createdAt },
      { id: "nutrition-school-2", code: "UE-DEMO-002", name: "Unidade Escolar Demonstrativa Centro", type: "Municipal", status: "Ativa", censusYear: 2026, neighborhood: "Setor demonstrativo Centro", address: "Endereço demonstrativo 02", students: 310, hasUex: false, hasMap: true, createdAt, updatedAt: createdAt },
      { id: "nutrition-school-3", code: "UE-DEMO-003", name: "Unidade Escolar Demonstrativa Sul", type: "Conveniada", status: "Inativa", censusYear: 2025, neighborhood: "Setor demonstrativo Sul", address: "Endereço demonstrativo 03", students: 185, hasUex: false, hasMap: false, createdAt, updatedAt: createdAt },
    ],
    semedEducaNuclei: [
      { id: "educa-nucleus-1", code: "EP-DEMO-001", name: "Núcleo Demonstrativo de Aprendizagem", classification: "Pedagógico", status: "Ativo", roomCount: 4, capacityPerShift: 90, activities: ["Reforço demonstrativo", "Leitura"], sportModalities: [], address: "Endereço demonstrativo do núcleo 01", coordination: "Coordenação demonstrativa", supervision: "Supervisão demonstrativa", integratedNutrition: true, createdAt, updatedAt: createdAt },
      { id: "educa-nucleus-2", code: "EP-DEMO-002", name: "Núcleo Demonstrativo de Esporte", classification: "Esportivo", status: "Ativo", roomCount: 2, capacityPerShift: 70, activities: ["Atividade corporal"], sportModalities: ["Modalidade demonstrativa"], address: "Endereço demonstrativo do núcleo 02", coordination: "Coordenação demonstrativa", supervision: "Supervisão demonstrativa", integratedNutrition: false, createdAt, updatedAt: createdAt },
    ],
    semedFinanceSources: [
      { id: "finance-source-fundeb", code: "FUNDEB", name: "Fonte demonstrativa de educação básica", category: "Fundo", openingBalance: 3200, active: true, createdAt, updatedAt: createdAt },
      { id: "finance-source-mde", code: "MDE", name: "Fonte demonstrativa de manutenção do ensino", category: "Recursos próprios", openingBalance: 1800, active: true, createdAt, updatedAt: createdAt },
      { id: "finance-source-pnae", code: "PNAE", name: "Fonte demonstrativa de alimentação escolar", category: "Programa", openingBalance: 900, active: true, createdAt, updatedAt: createdAt },
      { id: "finance-source-par", code: "PAR", name: "Fonte demonstrativa de ações articuladas", category: "Convênio", openingBalance: 600, active: true, createdAt, updatedAt: createdAt },
    ],
    semedFinanceRules: [
      { id: "finance-rule-fundeb", code: "FUNDEB_70", name: "Meta demonstrativa de profissionais da educação", targetPercentage: 70, description: "Parâmetro demonstrativo por exercício.", referenceYear: 2026, active: true, createdAt, updatedAt: createdAt },
      { id: "finance-rule-mde", code: "MDE_25", name: "Meta demonstrativa de manutenção do ensino", targetPercentage: 25, description: "Parâmetro demonstrativo por exercício.", referenceYear: 2026, active: true, createdAt, updatedAt: createdAt },
      { id: "finance-rule-pnae", code: "PNAE_AF", name: "Meta demonstrativa de agricultura familiar", targetPercentage: 30, description: "Parâmetro demonstrativo por exercício.", referenceYear: 2026, active: true, createdAt, updatedAt: createdAt },
    ],
    semedFinancePlanningEntries: [
      { id: "finance-plan-1", referenceMonth: "2026-01", sourceId: "finance-source-fundeb", program: "Programa demonstrativo", description: "Planejamento de pessoal demonstrativo", expenseNature: "Pessoal e encargos", plannedAmount: 8400, status: "Ativo", createdAt, updatedAt: createdAt },
      { id: "finance-plan-2", referenceMonth: "2026-02", sourceId: "finance-source-mde", program: "Programa demonstrativo", description: "Manutenção escolar demonstrativa", expenseNature: "Custeio", plannedAmount: 3600, status: "Ativo", createdAt, updatedAt: createdAt },
      { id: "finance-plan-3", referenceMonth: "2026-03", sourceId: "finance-source-pnae", program: "Programa demonstrativo", description: "Aquisição alimentar demonstrativa", expenseNature: "Material de consumo", plannedAmount: 2900, status: "Ativo", createdAt, updatedAt: createdAt },
    ],
    semedFinanceRevenues: [
      { id: "finance-revenue-1", receiptDate: "2026-01-05", sourceId: "finance-source-fundeb", component: "Repasse demonstrativo", type: "Repasse", reference: "Receita local 01/2026", amount: 12000, status: "Ativo", createdAt, updatedAt: createdAt },
      { id: "finance-revenue-2", receiptDate: "2026-02-05", sourceId: "finance-source-mde", component: "Transferência demonstrativa", type: "Repasse", reference: "Receita local 02/2026", amount: 6400, status: "Ativo", createdAt, updatedAt: createdAt },
      { id: "finance-revenue-3", receiptDate: "2026-03-05", sourceId: "finance-source-pnae", component: "Rendimento demonstrativo", type: "Rendimento", reference: "Receita local 03/2026", amount: 4100, status: "Ativo", createdAt, updatedAt: createdAt },
    ],
    semedFinanceExecutions: [
      { id: "finance-execution-1", executionDate: "2026-01-12", sourceId: "finance-source-fundeb", stage: "Empenhado", description: "Empenho demonstrativo", classification: "FUNDEB_70", documentReference: "DOC-DEMO-001", amount: 5600, status: "Ativo", createdAt, updatedAt: createdAt },
      { id: "finance-execution-2", executionDate: "2026-01-20", sourceId: "finance-source-fundeb", stage: "Pago", description: "Pagamento demonstrativo", classification: "FUNDEB_70", documentReference: "DOC-DEMO-002", amount: 4200, status: "Ativo", createdAt, updatedAt: createdAt },
      { id: "finance-execution-3", executionDate: "2026-02-18", sourceId: "finance-source-mde", stage: "Apropriação legal", description: "Apropriação demonstrativa", classification: "MDE_25", documentReference: "DOC-DEMO-003", amount: 1800, status: "Ativo", createdAt, updatedAt: createdAt },
    ],
    semedFinanceAuditLog: [],
    semedInstitutionSettings: {
      id: "institution-settings-demo", institutionName: "Secretaria Municipal de Educação Demonstrativa", acronym: "SEMED", municipality: "Município demonstrativo", referenceYear: 2026, timezone: "America/Fortaleza",
      notificationsEnabled: true, deadlineAlertDays: 15, sessionDays: 7, minimumPasswordLength: 8, maintenanceMessage: "", updatedAt: createdAt, updatedBy: "u-admin",
    },
    semedInstitutionSettingsAuditLog: [],
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

function stockModuleKey(scope: SemedStockScope): SemedModuleKey {
  if (scope === "Industrializado") return "estoque.industrializado";
  if (scope === "Kit do Aluno") return "estoque.kit_aluno";
  return "estoque.categorias";
}

function stockValue(value: unknown) { return Math.round(nonNegative(value) * 1000) / 1000; }

export function stockSituation(item: Pick<SemedStockItem, "active" | "balance" | "minimumQuantity">): SemedStockSituation {
  if (!item.active) return "Inativo";
  if (stockValue(item.balance) <= 0) return "Sem saldo";
  if (stockValue(item.balance) <= stockValue(item.minimumQuantity)) return "Estoque baixo";
  return "Disponível";
}

export function saveLocalStockItem(database: SemedLocalDatabase, input: SemedStockItemInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, stockModuleKey(input.scope))) return { error: "Usuário sem permissão para alterar o catálogo de estoque.", item: null };
  const code = upper(input.code);
  const name = input.name.trim();
  if (!code || !name || !input.category.trim()) return { error: "Informe código, produto e categoria.", item: null };
  const duplicate = database.semedStockItems.find((item) => item.id !== input.id && item.scope === input.scope && upper(item.code) === code);
  if (duplicate) return { error: "Já existe um produto com este código nesta categoria de estoque.", item: null };
  const current = input.id ? database.semedStockItems.find((item) => item.id === input.id) : null;
  const item: SemedStockItem = {
    id: current?.id ?? localId("stock-item"), scope: input.scope, code, name, category: input.category.trim(), unit: input.unit,
    minimumQuantity: stockValue(input.minimumQuantity), balance: current?.balance ?? 0, location: input.location.trim(), barcode: input.barcode.trim(),
    active: input.active, unitCost: stockValue(input.unitCost), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp,
  };
  if (current) database.semedStockItems[database.semedStockItems.indexOf(current)] = item;
  else database.semedStockItems.push(item);
  return { error: null, item };
}

export function registerLocalStockMovement(database: SemedLocalDatabase, input: SemedStockMovementInput, actorUserId: string, timestamp = now()) {
  const item = database.semedStockItems.find((candidate) => candidate.id === input.itemId && candidate.scope === input.scope);
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, stockModuleKey(input.scope))) return { error: "Usuário sem permissão para movimentar este estoque.", movement: null };
  if (!item || !item.active) return { error: "Produto de estoque não encontrado ou inativo.", movement: null };
  const quantity = stockValue(input.quantity);
  if (!quantity) return { error: "Informe uma quantidade maior que zero.", movement: null };
  const nextBalance = input.type === "Entrada" ? item.balance + quantity : input.type === "Saída" ? item.balance - quantity : quantity;
  if (nextBalance < 0) return { error: "A saída não pode superar o saldo demonstrativo disponível.", movement: null };
  item.balance = stockValue(nextBalance);
  item.updatedAt = timestamp;
  const movement: SemedStockMovement = {
    id: localId("stock-movement"), scope: input.scope, itemId: item.id, type: input.type, quantity, origin: input.origin.trim(), destination: input.destination.trim(),
    reference: input.reference.trim(), notes: input.notes.trim(), movementDate: input.movementDate || timestamp.slice(0, 10), actorUserId, createdAt: timestamp,
  };
  database.semedStockMovements.unshift(movement);
  return { error: null, movement };
}

export function startLocalStockAudit(database: SemedLocalDatabase, scope: SemedStockScope, actorUserId: string, notes = "", timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, stockModuleKey(scope))) return { error: "Usuário sem permissão para iniciar auditoria de estoque.", audit: null };
  const audit: SemedStockAudit = {
    id: localId("stock-audit"), scope, status: "Em andamento", notes: notes.trim(),
    entries: database.semedStockItems.filter((item) => item.scope === scope && item.active).map((item) => ({ itemId: item.id, registeredBalance: item.balance, countedQuantity: item.balance, difference: 0 })),
    openedAt: timestamp, closedAt: "", actorUserId,
  };
  database.semedStockAudits.unshift(audit);
  return { error: null, audit };
}

export function finishLocalStockAudit(database: SemedLocalDatabase, auditId: string, entries: SemedStockAuditEntry[], actorUserId: string, timestamp = now()) {
  const audit = database.semedStockAudits.find((candidate) => candidate.id === auditId);
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!audit || !actor || !canWriteLocalModule(database, actor, stockModuleKey(audit.scope))) return false;
  audit.entries = audit.entries.map((entry) => {
    const supplied = entries.find((candidate) => candidate.itemId === entry.itemId);
    const countedQuantity = stockValue(supplied?.countedQuantity ?? entry.countedQuantity);
    const item = database.semedStockItems.find((candidate) => candidate.id === entry.itemId);
    if (item) { item.balance = countedQuantity; item.updatedAt = timestamp; }
    return { itemId: entry.itemId, registeredBalance: entry.registeredBalance, countedQuantity, difference: stockValue(countedQuantity - entry.registeredBalance) };
  });
  audit.status = "Concluída";
  audit.closedAt = timestamp;
  return true;
}

export function saveLocalSchoolStockCount(database: SemedLocalDatabase, schoolStockId: string, countedQuantity: number, notes: string, actorUserId: string, timestamp = now()) {
  const schoolStock = database.semedSchoolStocks.find((candidate) => candidate.id === schoolStockId);
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!schoolStock || !actor || !canWriteLocalModule(database, actor, "estoque.categorias") || !canAccessLocalSchoolUnit(actor, schoolStock.schoolId)) return { error: "Usuário sem permissão para conferir este saldo escolar.", count: null };
  const quantity = stockValue(countedQuantity);
  const status: SemedSchoolStockCountStatus = quantity === schoolStock.balance ? "Conferida" : "Com divergência";
  const count: SemedSchoolStockCount = { id: localId("school-stock-count"), schoolStockId, countedQuantity: quantity, status, notes: notes.trim(), countedAt: timestamp, actorUserId };
  database.semedSchoolStockCounts.unshift(count);
  schoolStock.balance = quantity;
  schoolStock.updatedAt = timestamp;
  return { error: null, count };
}

export function registerLocalSchoolStockMovement(database: SemedLocalDatabase, schoolStockId: string, type: SemedSchoolStockMovement["type"], quantity: number, reference: string, notes: string, actorUserId: string, timestamp = now()) {
  const schoolStock = database.semedSchoolStocks.find((candidate) => candidate.id === schoolStockId);
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!schoolStock || !actor || !canWriteLocalModule(database, actor, "estoque.categorias") || !canAccessLocalSchoolUnit(actor, schoolStock.schoolId)) return { error: "Usuário sem permissão para movimentar este saldo escolar.", movement: null };
  const amount = stockValue(quantity);
  const nextBalance = type === "Recebimento" ? schoolStock.balance + amount : type === "Consumo" ? schoolStock.balance - amount : amount;
  if (!amount || nextBalance < 0) return { error: "Quantidade inválida para o saldo escolar disponível.", movement: null };
  schoolStock.balance = stockValue(nextBalance);
  schoolStock.updatedAt = timestamp;
  const movement: SemedSchoolStockMovement = { id: localId("school-stock-movement"), schoolStockId, type, quantity: amount, reference: reference.trim(), notes: notes.trim(), movementDate: timestamp.slice(0, 10), actorUserId };
  database.semedSchoolStockMovements.unshift(movement);
  return { error: null, movement };
}

export function saveLocalKitOrder(database: SemedLocalDatabase, input: SemedKitOrderInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "estoque.kit_aluno") || !canAccessLocalSchoolUnit(actor, input.schoolId)) return { error: "Usuário sem permissão para registrar pedidos de kit.", order: null };
  if (!input.className.trim() || !input.items.length) return { error: "Informe turma e ao menos um item para o pedido.", order: null };
  const current = input.id ? database.semedKitOrders.find((order) => order.id === input.id) : null;
  const order: SemedKitOrder = { id: current?.id ?? localId("kit-order"), schoolId: input.schoolId, className: input.className.trim(), referenceYear: Math.round(nonNegative(input.referenceYear)), status: input.status, items: input.items.map((item) => ({ itemId: item.itemId, requestedQuantity: stockValue(item.requestedQuantity), receivedQuantity: stockValue(item.receivedQuantity), distributedQuantity: stockValue(item.distributedQuantity) })), notes: input.notes.trim(), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedKitOrders[database.semedKitOrders.indexOf(current)] = order;
  else database.semedKitOrders.push(order);
  return { error: null, order };
}

function hrValue(value: unknown) { return Math.round(nonNegative(value) * 100) / 100; }
function hrAudit(database: SemedLocalDatabase, action: SemedHrAuditAction, targetId: string, summary: string, actorUserId: string, timestamp = now()) {
  const entry: SemedHrAudit = { id: localId("hr-audit"), action, targetId, summary: summary.replace(/\b\d{11}\b/g, "CPF PROTEGIDO"), actorUserId, createdAt: timestamp };
  database.semedHrAuditLog.unshift(entry);
  return entry;
}

export function calculateHrFinancialTotals(record: Pick<SemedHrFinancialRecord, "items">) {
  const earnings = hrValue(record.items.filter((item) => item.kind === "Provento").reduce((total, item) => total + hrValue(item.amount), 0));
  const discounts = hrValue(record.items.filter((item) => item.kind === "Desconto").reduce((total, item) => total + hrValue(item.amount), 0));
  return { earnings, discounts, net: hrValue(earnings - discounts) };
}

export function saveLocalHrServer(database: SemedLocalDatabase, input: SemedHrServerInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "rh.cadastro_servidores")) return { error: "Usuário sem permissão para alterar cadastros de servidores.", server: null };
  const registration = upper(input.registration);
  const displayName = input.displayName.trim();
  const cpf = normalizeCpf(input.cpf);
  if (!registration || !displayName || !input.jobTitle.trim() || !input.schoolUnitId) return { error: "Informe matrícula, nome, cargo e unidade para o servidor.", server: null };
  if (cpf && cpf.length !== 11) return { error: "Informe CPF demonstrativo com 11 dígitos ou deixe o campo vazio.", server: null };
  const duplicateRegistration = database.semedHrServers.find((server) => server.id !== input.id && upper(server.registration) === registration);
  const duplicateCpf = cpf && database.semedHrServers.find((server) => server.id !== input.id && normalizeCpf(server.cpf) === cpf);
  if (duplicateRegistration) return { error: "Já existe um servidor demonstrativo com esta matrícula.", server: null };
  if (duplicateCpf) return { error: "Já existe um servidor demonstrativo com este CPF.", server: null };
  const current = input.id ? database.semedHrServers.find((server) => server.id === input.id) : null;
  const server: SemedHrServer = {
    id: current?.id ?? localId("hr-server"), registration, displayName, cpf, jobTitle: input.jobTitle.trim(), schoolUnitId: input.schoolUnitId,
    status: input.status, admissionDate: input.admissionDate, hasPhone: Boolean(input.hasPhone), hasEmail: Boolean(input.hasEmail), hasIc: Boolean(input.hasIc),
    baseSalary: hrValue(input.baseSalary), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp,
  };
  if (current) database.semedHrServers[database.semedHrServers.indexOf(current)] = server;
  else database.semedHrServers.push(server);
  hrAudit(database, current ? "servidor.editado" : "servidor.criado", server.id, current ? "Cadastro demonstrativo de servidor atualizado." : "Servidor demonstrativo cadastrado.", actorUserId, timestamp);
  return { error: null, server };
}

export function saveLocalHrFinancialRecord(database: SemedLocalDatabase, input: SemedHrFinancialRecordInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "rh.ficha_financeira")) return { error: "Usuário sem permissão para alterar fichas financeiras.", record: null };
  if (!database.semedHrServers.some((server) => server.id === input.serverId)) return { error: "Servidor demonstrativo não encontrado.", record: null };
  if (!/^\d{4}-\d{2}$/.test(input.referenceMonth)) return { error: "Informe uma competência mensal válida.", record: null };
  const items = input.items.filter((item) => item.description.trim() && hrValue(item.amount) > 0).map((item) => ({ description: item.description.trim(), kind: item.kind, amount: hrValue(item.amount) }));
  if (!items.length) return { error: "Informe ao menos um provento ou desconto demonstrativo.", record: null };
  const current = input.id ? database.semedHrFinancialRecords.find((record) => record.id === input.id) : database.semedHrFinancialRecords.find((record) => record.serverId === input.serverId && record.referenceMonth === input.referenceMonth);
  const record: SemedHrFinancialRecord = { id: current?.id ?? localId("hr-financial"), serverId: input.serverId, referenceMonth: input.referenceMonth, items, notes: input.notes.trim(), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedHrFinancialRecords[database.semedHrFinancialRecords.indexOf(current)] = record;
  else database.semedHrFinancialRecords.push(record);
  hrAudit(database, current ? "competencia.atualizada" : "competencia.criada", record.id, "Ficha financeira demonstrativa registrada.", actorUserId, timestamp);
  return { error: null, record };
}

export function saveLocalHrAttendancePeriod(database: SemedLocalDatabase, input: SemedHrAttendanceInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "rh.frequencia")) return { error: "Usuário sem permissão para alterar frequência e movimento.", period: null };
  if (!/^\d{4}-\d{2}$/.test(input.referenceMonth) || !input.schoolUnitId || !input.code.trim()) return { error: "Informe competência, unidade e código da frequência.", period: null };
  const plannedDays = Math.round(nonNegative(input.plannedDays));
  if (!plannedDays) return { error: "Informe os dias previstos da competência.", period: null };
  const entries = input.entries.filter((entry) => database.semedHrServers.some((server) => server.id === entry.serverId)).map((entry) => ({ serverId: entry.serverId, workedDays: Math.min(plannedDays, Math.round(nonNegative(entry.workedDays))), absences: Math.min(plannedDays, Math.round(nonNegative(entry.absences))), notes: entry.notes.trim() }));
  if (!entries.length) return { error: "Inclua ao menos um servidor demonstrativo na competência.", period: null };
  const current = input.id ? database.semedHrAttendancePeriods.find((period) => period.id === input.id) : database.semedHrAttendancePeriods.find((period) => period.referenceMonth === input.referenceMonth && period.schoolUnitId === input.schoolUnitId);
  const period: SemedHrAttendancePeriod = { id: current?.id ?? localId("hr-attendance"), code: upper(input.code), referenceMonth: input.referenceMonth, schoolUnitId: input.schoolUnitId, plannedDays, calendarEvents: input.calendarEvents.map((event) => ({ ...event, id: event.id || localId("hr-calendar"), description: event.description.trim() })), entries, status: input.status, returnReason: input.returnReason.trim(), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedHrAttendancePeriods[database.semedHrAttendancePeriods.indexOf(current)] = period;
  else database.semedHrAttendancePeriods.push(period);
  const action: SemedHrAuditAction = period.status === "Enviada ao RH" ? "competencia.enviada" : period.status === "Devolvida para correção" ? "competencia.devolvida" : current ? "competencia.atualizada" : "competencia.criada";
  hrAudit(database, action, period.id, `Competência demonstrativa ${period.status.toLocaleLowerCase("pt-BR")}.`, actorUserId, timestamp);
  return { error: null, period };
}

export function saveLocalSchoolUnit(database: SemedLocalDatabase, input: SemedSchoolUnitInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "unidades_escolares")) return { error: "Usuário sem permissão para alterar unidades escolares.", unit: null };
  const code = upper(input.code); const name = input.name.trim(); const censusYear = Math.round(nonNegative(input.censusYear));
  if (!code || !name || !censusYear) return { error: "Informe código, nome e ano de censo da unidade.", unit: null };
  const duplicate = database.semedSchoolUnits.find((unit) => unit.id !== input.id && upper(unit.code) === code);
  if (duplicate) return { error: "Já existe uma unidade demonstrativa com este código.", unit: null };
  const current = input.id ? database.semedSchoolUnits.find((unit) => unit.id === input.id) : null;
  const unit: SemedSchoolUnit = {
    id: current?.id ?? localId("school-unit"), code, name, type: input.type, status: input.status, censusYear,
    neighborhood: input.neighborhood.trim(), address: input.address.trim(), students: Math.round(nonNegative(input.students)),
    hasUex: Boolean(input.hasUex), hasMap: Boolean(input.hasMap), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp,
  };
  if (current) database.semedSchoolUnits[database.semedSchoolUnits.indexOf(current)] = unit;
  else database.semedSchoolUnits.push(unit);
  return { error: null, unit };
}

export function saveLocalEducaNucleus(database: SemedLocalDatabase, input: SemedEducaNucleusInput, actorUserId: string, timestamp = now()) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  if (!actor || !canWriteLocalModule(database, actor, "educa_paco")) return { error: "Usuário sem permissão para alterar núcleos do Educa Paço.", nucleus: null };
  const code = upper(input.code); const name = input.name.trim();
  if (!code || !name) return { error: "Informe código e nome do núcleo.", nucleus: null };
  const duplicate = database.semedEducaNuclei.find((nucleus) => nucleus.id !== input.id && upper(nucleus.code) === code);
  if (duplicate) return { error: "Já existe um núcleo demonstrativo com este código.", nucleus: null };
  const current = input.id ? database.semedEducaNuclei.find((nucleus) => nucleus.id === input.id) : null;
  const list = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);
  const nucleus: SemedEducaNucleus = {
    id: current?.id ?? localId("educa-nucleus"), code, name, classification: input.classification, status: input.status,
    roomCount: Math.round(nonNegative(input.roomCount)), capacityPerShift: Math.round(nonNegative(input.capacityPerShift)), activities: list(input.activities), sportModalities: list(input.sportModalities),
    address: input.address.trim(), coordination: input.coordination.trim(), supervision: input.supervision.trim(), integratedNutrition: Boolean(input.integratedNutrition),
    createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp,
  };
  if (current) database.semedEducaNuclei[database.semedEducaNuclei.indexOf(current)] = nucleus;
  else database.semedEducaNuclei.push(nucleus);
  return { error: null, nucleus };
}

function financeValue(value: unknown) { return Math.round(nonNegative(value) * 100) / 100; }
function financeMonth(value: string) { return /^\d{4}-(0[1-9]|1[0-2])$/.test(value); }
function financeDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value); }
function financeAudit(database: SemedLocalDatabase, action: SemedFinanceAuditAction, targetId: string, summary: string, actorUserId: string, timestamp = now()) {
  const entry: SemedFinanceAudit = { id: localId("finance-audit"), action, targetId, summary: summary.trim(), actorUserId, createdAt: timestamp };
  database.semedFinanceAuditLog.unshift(entry);
  return entry;
}
function financeWriter(database: SemedLocalDatabase, actorUserId: string) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  return actor && canWriteLocalModule(database, actor, "financeiro") ? actor : null;
}
function financeAdministrator(database: SemedLocalDatabase, actorUserId: string) {
  const actor = financeWriter(database, actorUserId);
  return actor?.profile === "Administrador" ? actor : null;
}
function activeFinanceSource(database: SemedLocalDatabase, sourceId: string) { return database.semedFinanceSources.find((source) => source.id === sourceId && source.active); }

export function saveLocalFinanceSource(database: SemedLocalDatabase, input: SemedFinanceSourceInput, actorUserId: string, timestamp = now()) {
  if (!financeAdministrator(database, actorUserId)) return { error: "Somente Administrador pode alterar fontes de recursos.", source: null };
  const code = upper(input.code); const name = input.name.trim();
  if (!code || !name || !input.category.trim()) return { error: "Informe código, nome e categoria da fonte.", source: null };
  if (database.semedFinanceSources.some((source) => source.id !== input.id && upper(source.code) === code)) return { error: "Já existe uma fonte demonstrativa com este código.", source: null };
  const current = input.id ? database.semedFinanceSources.find((source) => source.id === input.id) : null;
  const source: SemedFinanceSource = { id: current?.id ?? localId("finance-source"), code, name, category: input.category.trim(), openingBalance: financeValue(input.openingBalance), active: Boolean(input.active), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedFinanceSources[database.semedFinanceSources.indexOf(current)] = source;
  else database.semedFinanceSources.push(source);
  financeAudit(database, "fonte.salva", source.id, current ? "Fonte demonstrativa atualizada." : "Fonte demonstrativa cadastrada.", actorUserId, timestamp);
  return { error: null, source };
}

export function saveLocalFinanceRule(database: SemedLocalDatabase, input: SemedFinanceRuleInput, actorUserId: string, timestamp = now()) {
  if (!financeAdministrator(database, actorUserId)) return { error: "Somente Administrador pode alterar regras do exercício.", rule: null };
  const code = upper(input.code); const name = input.name.trim(); const referenceYear = Math.round(nonNegative(input.referenceYear)); const targetPercentage = financeValue(input.targetPercentage);
  if (!code || !name || !referenceYear || targetPercentage > 100) return { error: "Informe código, regra, exercício e percentual entre 0 e 100.", rule: null };
  if (database.semedFinanceRules.some((rule) => rule.id !== input.id && rule.referenceYear === referenceYear && upper(rule.code) === code)) return { error: "Já existe uma regra demonstrativa com este código no exercício.", rule: null };
  const current = input.id ? database.semedFinanceRules.find((rule) => rule.id === input.id) : null;
  const rule: SemedFinanceRule = { id: current?.id ?? localId("finance-rule"), code, name, targetPercentage, description: input.description.trim(), referenceYear, active: Boolean(input.active), createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedFinanceRules[database.semedFinanceRules.indexOf(current)] = rule;
  else database.semedFinanceRules.push(rule);
  financeAudit(database, "regra.salva", rule.id, current ? "Regra demonstrativa atualizada." : "Regra demonstrativa cadastrada.", actorUserId, timestamp);
  return { error: null, rule };
}

export function saveLocalFinancePlanningEntry(database: SemedLocalDatabase, input: SemedFinancePlanningInput, actorUserId: string, timestamp = now()) {
  if (!financeWriter(database, actorUserId)) return { error: "Usuário sem permissão para alterar o planejamento financeiro.", entry: null };
  if (!financeMonth(input.referenceMonth) || !activeFinanceSource(database, input.sourceId) || !input.program.trim() || !input.description.trim() || !input.expenseNature.trim() || !financeValue(input.plannedAmount)) return { error: "Informe competência, fonte, programa, descrição, natureza e valor planejado.", entry: null };
  const current = input.id ? database.semedFinancePlanningEntries.find((entry) => entry.id === input.id) : null;
  const entry: SemedFinancePlanningEntry = { id: current?.id ?? localId("finance-plan"), referenceMonth: input.referenceMonth, sourceId: input.sourceId, program: input.program.trim(), description: input.description.trim(), expenseNature: input.expenseNature.trim(), plannedAmount: financeValue(input.plannedAmount), status: input.status, createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedFinancePlanningEntries[database.semedFinancePlanningEntries.indexOf(current)] = entry;
  else database.semedFinancePlanningEntries.push(entry);
  financeAudit(database, entry.status === "Cancelado" ? "lancamento.cancelado" : "planejamento.salvo", entry.id, entry.status === "Cancelado" ? "Planejamento demonstrativo cancelado." : "Planejamento demonstrativo salvo.", actorUserId, timestamp);
  return { error: null, entry };
}

export function saveLocalFinanceRevenue(database: SemedLocalDatabase, input: SemedFinanceRevenueInput, actorUserId: string, timestamp = now()) {
  if (!financeWriter(database, actorUserId)) return { error: "Usuário sem permissão para alterar receitas.", revenue: null };
  if (!financeDate(input.receiptDate) || !activeFinanceSource(database, input.sourceId) || !input.component.trim() || !input.reference.trim() || !financeValue(input.amount)) return { error: "Informe data, fonte, componente, referência e valor da receita.", revenue: null };
  const current = input.id ? database.semedFinanceRevenues.find((revenue) => revenue.id === input.id) : null;
  const revenue: SemedFinanceRevenue = { id: current?.id ?? localId("finance-revenue"), receiptDate: input.receiptDate, sourceId: input.sourceId, component: input.component.trim(), type: input.type, reference: input.reference.trim(), amount: financeValue(input.amount), status: input.status, createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedFinanceRevenues[database.semedFinanceRevenues.indexOf(current)] = revenue;
  else database.semedFinanceRevenues.push(revenue);
  financeAudit(database, revenue.status === "Cancelado" ? "lancamento.cancelado" : "receita.salva", revenue.id, revenue.status === "Cancelado" ? "Receita demonstrativa cancelada." : "Receita demonstrativa salva.", actorUserId, timestamp);
  return { error: null, revenue };
}

export function saveLocalFinanceExecution(database: SemedLocalDatabase, input: SemedFinanceExecutionInput, actorUserId: string, timestamp = now()) {
  if (!financeWriter(database, actorUserId)) return { error: "Usuário sem permissão para alterar a execução financeira.", execution: null };
  if (!financeDate(input.executionDate) || !activeFinanceSource(database, input.sourceId) || !input.description.trim() || !input.classification.trim() || !input.documentReference.trim() || !financeValue(input.amount)) return { error: "Informe data, fonte, etapa, descrição, classificação, documento e valor.", execution: null };
  const current = input.id ? database.semedFinanceExecutions.find((execution) => execution.id === input.id) : null;
  const execution: SemedFinanceExecution = { id: current?.id ?? localId("finance-execution"), executionDate: input.executionDate, sourceId: input.sourceId, stage: input.stage, description: input.description.trim(), classification: upper(input.classification), documentReference: upper(input.documentReference), amount: financeValue(input.amount), status: input.status, createdAt: current?.createdAt ?? timestamp, updatedAt: timestamp };
  if (current) database.semedFinanceExecutions[database.semedFinanceExecutions.indexOf(current)] = execution;
  else database.semedFinanceExecutions.push(execution);
  financeAudit(database, execution.status === "Cancelado" ? "lancamento.cancelado" : "execucao.salva", execution.id, execution.status === "Cancelado" ? "Execução demonstrativa cancelada." : "Execução demonstrativa salva.", actorUserId, timestamp);
  return { error: null, execution };
}

export function financeSummary(database: SemedLocalDatabase, referenceYear: number, sourceId = ""): SemedFinanceSummary {
  const hasSource = (candidate: { sourceId: string }) => !sourceId || candidate.sourceId === sourceId;
  const inYear = (date: string) => date.startsWith(`${referenceYear}-`);
  const active = <T extends { status: SemedFinanceEntryStatus }>(items: T[]) => items.filter((item) => item.status === "Ativo");
  const sum = (values: number[]) => financeValue(values.reduce((total, value) => total + financeValue(value), 0));
  const planned = sum(active(database.semedFinancePlanningEntries).filter((entry) => hasSource(entry) && inYear(entry.referenceMonth)).map((entry) => entry.plannedAmount));
  const revenues = sum(active(database.semedFinanceRevenues).filter((entry) => hasSource(entry) && inYear(entry.receiptDate)).map((entry) => entry.amount));
  const committed = sum(active(database.semedFinanceExecutions).filter((entry) => hasSource(entry) && inYear(entry.executionDate) && entry.stage === "Empenhado").map((entry) => entry.amount));
  const settled = sum(active(database.semedFinanceExecutions).filter((entry) => hasSource(entry) && inYear(entry.executionDate) && entry.stage === "Liquidado").map((entry) => entry.amount));
  const paid = sum(active(database.semedFinanceExecutions).filter((entry) => hasSource(entry) && inYear(entry.executionDate) && entry.stage === "Pago").map((entry) => entry.amount));
  const opening = sum(database.semedFinanceSources.filter((source) => !sourceId || source.id === sourceId).map((source) => source.openingBalance));
  return { planned, revenues, committed, settled, paid, availability: financeValue(opening + revenues - paid) };
}

export function financeRuleIndicators(database: SemedLocalDatabase, referenceYear: number) {
  const activeExecutions = database.semedFinanceExecutions.filter((entry) => entry.status === "Ativo" && entry.executionDate.startsWith(`${referenceYear}-`) && entry.stage === "Apropriação legal");
  return database.semedFinanceRules.filter((rule) => rule.active && rule.referenceYear === referenceYear).map((rule) => {
    const sourceCode = rule.code.split("_")[0];
    const sourceIds = database.semedFinanceSources.filter((source) => source.code === sourceCode).map((source) => source.id);
    const base = financeSummary(database, referenceYear, sourceIds[0] ?? "").revenues;
    const applied = financeValue(activeExecutions.filter((entry) => entry.classification === rule.code).reduce((total, entry) => total + entry.amount, 0));
    const percentage = base ? financeValue(applied * 100 / base) : 0;
    return { rule, applied, percentage, meetsTarget: percentage >= rule.targetPercentage };
  });
}

function institutionSettingsAdministrator(database: SemedLocalDatabase, actorUserId: string) {
  const actor = database.semedUsers.find((user) => user.id === actorUserId);
  return actor?.active && actor.profile === "Administrador" ? actor : null;
}

export function saveLocalInstitutionSettings(database: SemedLocalDatabase, input: SemedInstitutionSettingsInput, actorUserId: string, timestamp = now()) {
  if (!institutionSettingsAdministrator(database, actorUserId)) return { error: "Somente Administrador pode alterar configurações institucionais.", settings: null };
  const referenceYear = Math.round(nonNegative(input.referenceYear));
  const deadlineAlertDays = Math.round(nonNegative(input.deadlineAlertDays));
  const sessionDays = Math.round(nonNegative(input.sessionDays));
  const minimumPasswordLength = Math.round(nonNegative(input.minimumPasswordLength));
  if (!input.institutionName.trim() || !input.acronym.trim() || !input.municipality.trim() || !referenceYear || !input.timezone.trim()) return { error: "Informe identificação institucional, exercício e fuso horário.", settings: null };
  if (deadlineAlertDays < 1 || deadlineAlertDays > 120 || sessionDays < 1 || sessionDays > 30 || minimumPasswordLength < 8 || minimumPasswordLength > 64) return { error: "Revise alertas, duração de sessão e senha mínima dentro dos limites locais.", settings: null };
  const current = database.semedInstitutionSettings;
  const settings: SemedInstitutionSettings = {
    id: current.id, institutionName: input.institutionName.trim(), acronym: upper(input.acronym), municipality: input.municipality.trim(), referenceYear,
    timezone: input.timezone.trim(), notificationsEnabled: Boolean(input.notificationsEnabled), deadlineAlertDays, sessionDays, minimumPasswordLength,
    maintenanceMessage: input.maintenanceMessage.trim(), updatedAt: timestamp, updatedBy: actorUserId,
  };
  const changedFields = (Object.keys(settings) as (keyof SemedInstitutionSettings)[]).filter((key) => !["id", "updatedAt", "updatedBy"].includes(key) && settings[key] !== current[key]).map(String);
  database.semedInstitutionSettings = settings;
  database.semedInstitutionSettingsAuditLog.unshift({ id: localId("settings-audit"), action: "configuracoes.salvas", changedFields, summary: changedFields.length ? `${changedFields.length} parâmetro(s) institucional(is) local(is) atualizado(s).` : "Configurações institucionais revisadas sem alterações.", actorUserId, createdAt: timestamp });
  return { error: null, settings };
}

export function serializeLocalDatabase(database: SemedLocalDatabase) { return JSON.stringify(database); }
type SemedLocalDatabasePreV7 = Omit<SemedLocalDatabase, "schemaVersion" | "semedInstitutionSettings" | "semedInstitutionSettingsAuditLog"> & { schemaVersion: number };
type SemedLocalDatabaseV6 = Omit<SemedLocalDatabase, "schemaVersion" | "semedInstitutionSettings" | "semedInstitutionSettingsAuditLog"> & { schemaVersion: 6 };
type SemedLocalDatabaseV5 = Omit<SemedLocalDatabaseV6, "schemaVersion" | "semedFinanceSources" | "semedFinanceRules" | "semedFinancePlanningEntries" | "semedFinanceRevenues" | "semedFinanceExecutions" | "semedFinanceAuditLog"> & { schemaVersion: 5 };
type SemedLocalDatabaseV4 = Omit<SemedLocalDatabaseV5, "schemaVersion" | "semedSchoolUnits" | "semedEducaNuclei"> & { schemaVersion: 4 };
type SemedLocalDatabaseV3 = Omit<SemedLocalDatabaseV4, "schemaVersion" | "semedHrServers" | "semedHrFinancialRecords" | "semedHrAttendancePeriods" | "semedHrAuditLog"> & { schemaVersion: 3 };
type SemedLocalDatabaseV2 = Omit<SemedLocalDatabaseV3, "schemaVersion" | "semedStockItems" | "semedStockMovements" | "semedStockAudits" | "semedSchoolStocks" | "semedSchoolStockCounts" | "semedSchoolStockMovements" | "semedKitOrders"> & { schemaVersion: 2 };
type LegacySemedLocalUser = Omit<SemedLocalUser, "registration" | "profile" | "loginType" | "cpf" | "schoolUnitId" | "serverRegistrationId" | "provisionalPasswordIssuedAt" | "lastActivityAt" | "role"> & { role: string };
type LegacySemedLocalDatabase = Omit<SemedLocalDatabaseV2, "schemaVersion" | "semedUsers" | "semedUserPermissions" | "semedUserAuditLog"> & { schemaVersion: 1; semedUsers: LegacySemedLocalUser[] };

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
		    schemaVersion: 7,
	semedUsers: migratedUsers,
    semedUserPermissions: migratedUsers.flatMap((user) => buildLocalUserPermissions(user.id, user.profile, "u-admin", migratedAt, user.profile === "Técnico" ? LEGACY_TECHNICIAN_KEYS : [])),
    semedUserAuditLog: [],
    semedStockItems: nutritionDefaults.semedStockItems,
    semedStockMovements: nutritionDefaults.semedStockMovements,
    semedStockAudits: nutritionDefaults.semedStockAudits,
    semedSchoolStocks: nutritionDefaults.semedSchoolStocks,
    semedSchoolStockCounts: nutritionDefaults.semedSchoolStockCounts,
    semedSchoolStockMovements: nutritionDefaults.semedSchoolStockMovements,
semedKitOrders: nutritionDefaults.semedKitOrders,
    semedHrServers: nutritionDefaults.semedHrServers,
    semedHrFinancialRecords: nutritionDefaults.semedHrFinancialRecords,
    semedHrAttendancePeriods: nutritionDefaults.semedHrAttendancePeriods,
	    semedHrAuditLog: nutritionDefaults.semedHrAuditLog,
	    semedSchoolUnits: nutritionDefaults.semedSchoolUnits,
	    semedEducaNuclei: nutritionDefaults.semedEducaNuclei,
semedNutritionSchools: Array.isArray(database.semedNutritionSchools) ? database.semedNutritionSchools : nutritionDefaults.semedNutritionSchools,
    semedNutritionContracts: Array.isArray(database.semedNutritionContracts) ? database.semedNutritionContracts : nutritionDefaults.semedNutritionContracts,
    semedNutritionWeeklyPlans: Array.isArray(database.semedNutritionWeeklyPlans) ? database.semedNutritionWeeklyPlans : nutritionDefaults.semedNutritionWeeklyPlans,
	    semedNutritionStages: Array.isArray(database.semedNutritionStages) ? database.semedNutritionStages : nutritionDefaults.semedNutritionStages,
	    semedNutritionCatalog: Array.isArray(database.semedNutritionCatalog) ? database.semedNutritionCatalog : nutritionDefaults.semedNutritionCatalog,
	    semedNutritionAnnualPlans: Array.isArray(database.semedNutritionAnnualPlans) ? database.semedNutritionAnnualPlans : nutritionDefaults.semedNutritionAnnualPlans,
	    semedFinanceSources: nutritionDefaults.semedFinanceSources,
	    semedFinanceRules: nutritionDefaults.semedFinanceRules,
	    semedFinancePlanningEntries: nutritionDefaults.semedFinancePlanningEntries,
		    semedFinanceRevenues: nutritionDefaults.semedFinanceRevenues,
		    semedFinanceExecutions: nutritionDefaults.semedFinanceExecutions,
		    semedFinanceAuditLog: nutritionDefaults.semedFinanceAuditLog,
		    semedInstitutionSettings: nutritionDefaults.semedInstitutionSettings,
		    semedInstitutionSettingsAuditLog: nutritionDefaults.semedInstitutionSettingsAuditLog,
		  };
	}

function normalizeCurrentDatabase(database: SemedLocalDatabase | SemedLocalDatabasePreV7): SemedLocalDatabase {
		const nutritionDefaults = createLocalSemedDatabase();
		const current = database as Partial<SemedLocalDatabase>;
		return {
			...database,
		    schemaVersion: 7,
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
    semedStockItems: Array.isArray(database.semedStockItems) ? database.semedStockItems : nutritionDefaults.semedStockItems,
    semedStockMovements: Array.isArray(database.semedStockMovements) ? database.semedStockMovements : nutritionDefaults.semedStockMovements,
    semedStockAudits: Array.isArray(database.semedStockAudits) ? database.semedStockAudits : nutritionDefaults.semedStockAudits,
    semedSchoolStocks: Array.isArray(database.semedSchoolStocks) ? database.semedSchoolStocks : nutritionDefaults.semedSchoolStocks,
    semedSchoolStockCounts: Array.isArray(database.semedSchoolStockCounts) ? database.semedSchoolStockCounts : nutritionDefaults.semedSchoolStockCounts,
    semedSchoolStockMovements: Array.isArray(database.semedSchoolStockMovements) ? database.semedSchoolStockMovements : nutritionDefaults.semedSchoolStockMovements,
semedKitOrders: Array.isArray(database.semedKitOrders) ? database.semedKitOrders : nutritionDefaults.semedKitOrders,
    semedHrServers: Array.isArray(database.semedHrServers) ? database.semedHrServers : nutritionDefaults.semedHrServers,
    semedHrFinancialRecords: Array.isArray(database.semedHrFinancialRecords) ? database.semedHrFinancialRecords : nutritionDefaults.semedHrFinancialRecords,
    semedHrAttendancePeriods: Array.isArray(database.semedHrAttendancePeriods) ? database.semedHrAttendancePeriods : nutritionDefaults.semedHrAttendancePeriods,
    semedHrAuditLog: Array.isArray(database.semedHrAuditLog) ? database.semedHrAuditLog : nutritionDefaults.semedHrAuditLog,
	    semedSchoolUnits: Array.isArray(database.semedSchoolUnits) ? database.semedSchoolUnits : nutritionDefaults.semedSchoolUnits,
	    semedEducaNuclei: Array.isArray(database.semedEducaNuclei) ? database.semedEducaNuclei : nutritionDefaults.semedEducaNuclei,
semedNutritionSchools: Array.isArray(database.semedNutritionSchools) ? database.semedNutritionSchools : nutritionDefaults.semedNutritionSchools,
    semedNutritionContracts: Array.isArray(database.semedNutritionContracts) ? database.semedNutritionContracts : nutritionDefaults.semedNutritionContracts,
    semedNutritionWeeklyPlans: Array.isArray(database.semedNutritionWeeklyPlans) ? database.semedNutritionWeeklyPlans : nutritionDefaults.semedNutritionWeeklyPlans,
	    semedNutritionStages: Array.isArray(database.semedNutritionStages) ? database.semedNutritionStages : nutritionDefaults.semedNutritionStages,
	    semedNutritionCatalog: Array.isArray(database.semedNutritionCatalog) ? database.semedNutritionCatalog : nutritionDefaults.semedNutritionCatalog,
	    semedNutritionAnnualPlans: Array.isArray(database.semedNutritionAnnualPlans) ? database.semedNutritionAnnualPlans : nutritionDefaults.semedNutritionAnnualPlans,
	    semedFinanceSources: Array.isArray(database.semedFinanceSources) ? database.semedFinanceSources : nutritionDefaults.semedFinanceSources,
	    semedFinanceRules: Array.isArray(database.semedFinanceRules) ? database.semedFinanceRules : nutritionDefaults.semedFinanceRules,
	    semedFinancePlanningEntries: Array.isArray(database.semedFinancePlanningEntries) ? database.semedFinancePlanningEntries : nutritionDefaults.semedFinancePlanningEntries,
		    semedFinanceRevenues: Array.isArray(database.semedFinanceRevenues) ? database.semedFinanceRevenues : nutritionDefaults.semedFinanceRevenues,
		    semedFinanceExecutions: Array.isArray(database.semedFinanceExecutions) ? database.semedFinanceExecutions : nutritionDefaults.semedFinanceExecutions,
		    semedFinanceAuditLog: Array.isArray(database.semedFinanceAuditLog) ? database.semedFinanceAuditLog : nutritionDefaults.semedFinanceAuditLog,
		    semedInstitutionSettings: current.semedInstitutionSettings ? { ...nutritionDefaults.semedInstitutionSettings, ...current.semedInstitutionSettings } : nutritionDefaults.semedInstitutionSettings,
		    semedInstitutionSettingsAuditLog: Array.isArray(current.semedInstitutionSettingsAuditLog) ? current.semedInstitutionSettingsAuditLog : nutritionDefaults.semedInstitutionSettingsAuditLog,
		  };
	}

function migrateStockDatabase(database: SemedLocalDatabaseV2): SemedLocalDatabase {
  const defaults = createLocalSemedDatabase();
  return normalizeCurrentDatabase({
    ...database,
    schemaVersion: 7,
    semedStockItems: defaults.semedStockItems, semedStockMovements: defaults.semedStockMovements, semedStockAudits: defaults.semedStockAudits,
    semedSchoolStocks: defaults.semedSchoolStocks, semedSchoolStockCounts: defaults.semedSchoolStockCounts, semedSchoolStockMovements: defaults.semedSchoolStockMovements, semedKitOrders: defaults.semedKitOrders,
    semedHrServers: defaults.semedHrServers, semedHrFinancialRecords: defaults.semedHrFinancialRecords, semedHrAttendancePeriods: defaults.semedHrAttendancePeriods, semedHrAuditLog: defaults.semedHrAuditLog,
    semedSchoolUnits: defaults.semedSchoolUnits, semedEducaNuclei: defaults.semedEducaNuclei,
    semedFinanceSources: defaults.semedFinanceSources, semedFinanceRules: defaults.semedFinanceRules, semedFinancePlanningEntries: defaults.semedFinancePlanningEntries,
    semedFinanceRevenues: defaults.semedFinanceRevenues, semedFinanceExecutions: defaults.semedFinanceExecutions, semedFinanceAuditLog: defaults.semedFinanceAuditLog,
  });
}

function migrateHumanResourcesDatabase(database: SemedLocalDatabaseV3): SemedLocalDatabase {
  const defaults = createLocalSemedDatabase();
  return normalizeCurrentDatabase({
    ...database,
    schemaVersion: 7,
    semedHrServers: defaults.semedHrServers, semedHrFinancialRecords: defaults.semedHrFinancialRecords, semedHrAttendancePeriods: defaults.semedHrAttendancePeriods, semedHrAuditLog: defaults.semedHrAuditLog,
    semedSchoolUnits: defaults.semedSchoolUnits, semedEducaNuclei: defaults.semedEducaNuclei,
    semedFinanceSources: defaults.semedFinanceSources, semedFinanceRules: defaults.semedFinanceRules, semedFinancePlanningEntries: defaults.semedFinancePlanningEntries,
    semedFinanceRevenues: defaults.semedFinanceRevenues, semedFinanceExecutions: defaults.semedFinanceExecutions, semedFinanceAuditLog: defaults.semedFinanceAuditLog,
  });
}

function migrateSchoolsEducaDatabase(database: SemedLocalDatabaseV4): SemedLocalDatabase {
  const defaults = createLocalSemedDatabase();
  return normalizeCurrentDatabase({ ...database, schemaVersion: 6, semedSchoolUnits: defaults.semedSchoolUnits, semedEducaNuclei: defaults.semedEducaNuclei, semedFinanceSources: defaults.semedFinanceSources, semedFinanceRules: defaults.semedFinanceRules, semedFinancePlanningEntries: defaults.semedFinancePlanningEntries, semedFinanceRevenues: defaults.semedFinanceRevenues, semedFinanceExecutions: defaults.semedFinanceExecutions, semedFinanceAuditLog: defaults.semedFinanceAuditLog });
}

function migrateFinancialDatabase(database: SemedLocalDatabaseV5): SemedLocalDatabase {
  const defaults = createLocalSemedDatabase();
  return normalizeCurrentDatabase({ ...database, schemaVersion: 7, semedFinanceSources: defaults.semedFinanceSources, semedFinanceRules: defaults.semedFinanceRules, semedFinancePlanningEntries: defaults.semedFinancePlanningEntries, semedFinanceRevenues: defaults.semedFinanceRevenues, semedFinanceExecutions: defaults.semedFinanceExecutions, semedFinanceAuditLog: defaults.semedFinanceAuditLog });
}

function migrateInstitutionSettingsDatabase(database: SemedLocalDatabaseV6): SemedLocalDatabase {
  return normalizeCurrentDatabase(database);
}

export function hydrateLocalDatabase(serialized: string) {
  try {
    const parsed = JSON.parse(serialized) as SemedLocalDatabase | SemedLocalDatabaseV6 | SemedLocalDatabaseV5 | SemedLocalDatabaseV4 | SemedLocalDatabaseV3 | SemedLocalDatabaseV2 | LegacySemedLocalDatabase;
    if (parsed.schemaVersion === 1) return migrateLocalDatabase(parsed);
    if (parsed.schemaVersion === 2) return migrateStockDatabase(parsed);
    if (parsed.schemaVersion === 3) return migrateHumanResourcesDatabase(parsed);
    if (parsed.schemaVersion === 4) return migrateSchoolsEducaDatabase(parsed);
    if (parsed.schemaVersion === 5) return migrateFinancialDatabase(parsed);
    if (parsed.schemaVersion === 6) return migrateInstitutionSettingsDatabase(parsed);
    if (parsed.schemaVersion === 7) return normalizeCurrentDatabase(parsed);
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
    stockItems: database.semedStockItems, stockMovements: database.semedStockMovements, stockAudits: database.semedStockAudits,
    schoolStocks: database.semedSchoolStocks, schoolStockCounts: database.semedSchoolStockCounts,
    schoolStockMovements: database.semedSchoolStockMovements, kitOrders: database.semedKitOrders,
    hrServers: database.semedHrServers, hrFinancialRecords: database.semedHrFinancialRecords,
    hrAttendancePeriods: database.semedHrAttendancePeriods, hrAuditLog: database.semedHrAuditLog,
    schoolUnits: database.semedSchoolUnits, educaNuclei: database.semedEducaNuclei,
    financeSources: database.semedFinanceSources, financeRules: database.semedFinanceRules,
    financePlanningEntries: database.semedFinancePlanningEntries, financeRevenues: database.semedFinanceRevenues,
    financeExecutions: database.semedFinanceExecutions, financeAuditLog: database.semedFinanceAuditLog,
    institutionSettings: database.semedInstitutionSettings, institutionSettingsAuditLog: database.semedInstitutionSettingsAuditLog,
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
    saveStockItem(input: SemedStockItemInput, actorUserId: string) { return mutate((draft) => saveLocalStockItem(draft, input, actorUserId)); },
    registerStockMovement(input: SemedStockMovementInput, actorUserId: string) { return mutate((draft) => registerLocalStockMovement(draft, input, actorUserId)); },
    startStockAudit(scope: SemedStockScope, actorUserId: string, notes = "") { return mutate((draft) => startLocalStockAudit(draft, scope, actorUserId, notes)); },
    finishStockAudit(auditId: string, entries: SemedStockAuditEntry[], actorUserId: string) { return mutate((draft) => finishLocalStockAudit(draft, auditId, entries, actorUserId)); },
    saveSchoolStockCount(schoolStockId: string, countedQuantity: number, notes: string, actorUserId: string) { return mutate((draft) => saveLocalSchoolStockCount(draft, schoolStockId, countedQuantity, notes, actorUserId)); },
    registerSchoolStockMovement(schoolStockId: string, type: SemedSchoolStockMovement["type"], quantity: number, reference: string, notes: string, actorUserId: string) { return mutate((draft) => registerLocalSchoolStockMovement(draft, schoolStockId, type, quantity, reference, notes, actorUserId)); },
    saveKitOrder(input: SemedKitOrderInput, actorUserId: string) { return mutate((draft) => saveLocalKitOrder(draft, input, actorUserId)); },
    saveHrServer(input: SemedHrServerInput, actorUserId: string) { return mutate((draft) => saveLocalHrServer(draft, input, actorUserId)); },
    saveHrFinancialRecord(input: SemedHrFinancialRecordInput, actorUserId: string) { return mutate((draft) => saveLocalHrFinancialRecord(draft, input, actorUserId)); },
    saveHrAttendancePeriod(input: SemedHrAttendanceInput, actorUserId: string) { return mutate((draft) => saveLocalHrAttendancePeriod(draft, input, actorUserId)); },
    saveSchoolUnit(input: SemedSchoolUnitInput, actorUserId: string) { return mutate((draft) => saveLocalSchoolUnit(draft, input, actorUserId)); },
    saveEducaNucleus(input: SemedEducaNucleusInput, actorUserId: string) { return mutate((draft) => saveLocalEducaNucleus(draft, input, actorUserId)); },
    saveFinanceSource(input: SemedFinanceSourceInput, actorUserId: string) { return mutate((draft) => saveLocalFinanceSource(draft, input, actorUserId)); },
    saveFinanceRule(input: SemedFinanceRuleInput, actorUserId: string) { return mutate((draft) => saveLocalFinanceRule(draft, input, actorUserId)); },
    saveFinancePlanningEntry(input: SemedFinancePlanningInput, actorUserId: string) { return mutate((draft) => saveLocalFinancePlanningEntry(draft, input, actorUserId)); },
    saveFinanceRevenue(input: SemedFinanceRevenueInput, actorUserId: string) { return mutate((draft) => saveLocalFinanceRevenue(draft, input, actorUserId)); },
    saveFinanceExecution(input: SemedFinanceExecutionInput, actorUserId: string) { return mutate((draft) => saveLocalFinanceExecution(draft, input, actorUserId)); },
    saveInstitutionSettings(input: SemedInstitutionSettingsInput, actorUserId: string) { return mutate((draft) => saveLocalInstitutionSettings(draft, input, actorUserId)); },
    financeSummary(referenceYear: number, sourceId = "") { return financeSummary(databaseRef.current, referenceYear, sourceId); },
    financeRuleIndicators(referenceYear: number) { return financeRuleIndicators(databaseRef.current, referenceYear); },
    resetSimulation() { const fresh = createLocalSemedDatabase(); databaseRef.current = fresh; saveLocalDatabase(fresh); setDatabase(fresh); },
  };
}

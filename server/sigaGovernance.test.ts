import { describe, expect, it } from "vitest";
import {
  buildLocalUserPermissions,
  canPerformLocalGovernanceAction,
  createLocalDocument,
  createLocalPayment,
  createLocalSemedDatabase,
  hydrateLocalDatabase,
  saveLocalFinanceExecution,
  type SemedLocalUser,
} from "../client/src/pages/sigaLocalStore";

function addAccountant(database: ReturnType<typeof createLocalSemedDatabase>) {
  const base = database.semedUsers[0];
  const accountant: SemedLocalUser = {
    ...base,
    id: "u-accountant",
    username: "contadora",
    registration: "00000003-5",
    displayName: "Contadora Demonstrativa",
    role: "Contadora Municipal",
    profile: "Contadora Municipal",
  };
  database.semedUsers.push(accountant);
  database.semedUserPermissions.push(...buildLocalUserPermissions(accountant.id, accountant.profile, "u-admin", "2026-08-26T12:00:00.000Z"));
  return accountant;
}

describe("base mínima de governança local", () => {
  it("distingue preparar, revisar, cancelar e auditar por perfil e setor", () => {
    const database = createLocalSemedDatabase();
    const accountant = addAccountant(database);

    expect(canPerformLocalGovernanceAction(database, "u-admin", "contratos", "aprovar")).toBe(true);
    expect(canPerformLocalGovernanceAction(database, "u-tecnico1", "contratos", "preparar")).toBe(true);
    expect(canPerformLocalGovernanceAction(database, "u-tecnico1", "contratos", "cancelar")).toBe(false);
    expect(canPerformLocalGovernanceAction(database, accountant.id, "financeiro", "cancelar")).toBe(true);
    expect(canPerformLocalGovernanceAction(database, accountant.id, "documentos", "cancelar")).toBe(false);
  });

  it("vincula documento e baixa ao contrato quando a referência é inequívoca e registra auditoria", () => {
    const database = createLocalSemedDatabase();
    const document = createLocalDocument(database, {
      kind: "Ofício", number: "OF-001/2026", templateKey: "oficio", subject: "Acompanhamento", destination: "Contratos", recipient: "Setor responsável",
      relatedRecord: "012/2026", responsible: "Administrador", dueDate: "2026-09-10", status: "Em elaboração", summary: "Vínculo de teste", notes: "",
    }, "2026-08-26T12:00:00.000Z", "u-admin");
    const payment = createLocalPayment(database, { recordId: "r12", documentId: document.id, financeExecutionId: "", paymentDate: "2026-08-26", amount: 1000, notes: "Baixa de teste" }, "2026-08-26T12:01:00.000Z", "u-admin");

    expect(document.relatedRecordId).toBe("r12");
    expect(payment.error).toBeNull();
    expect(database.semedRecordPayments.at(-1)).toMatchObject({ recordId: "r12", documentId: document.id, actorUserId: "u-admin" });
    expect(database.semedGovernanceAuditLog.map((entry) => entry.action)).toEqual(["executar", "preparar"]);
    expect(database.semedGovernanceAuditLog.every((entry) => entry.correlationId)).toBe(true);
  });

  it("mantém campos legados e adiciona referências estruturadas à execução financeira", () => {
    const database = createLocalSemedDatabase();
    const sourceId = database.semedFinanceSources[0].id;
    const document = createLocalDocument(database, {
      kind: "Memorando", number: "MEM-001/2026", templateKey: "memorando", subject: "Execução", destination: "Financeiro", recipient: "Equipe", relatedRecord: "012/2026", responsible: "Administrador", dueDate: "2026-09-11", status: "Em elaboração", summary: "Teste financeiro", notes: "",
    }, "2026-08-26T12:00:00.000Z", "u-admin");
    const result = saveLocalFinanceExecution(database, {
      executionDate: "2026-08-26", sourceId, stage: "Liquidado", description: "Liquidação demonstrativa", classification: "Custeio", documentReference: document.number,
      recordId: "", documentId: document.id, paymentId: "", amount: 500, status: "Ativo",
    }, "u-admin", "2026-08-26T12:02:00.000Z");

    expect(result.error).toBeNull();
    expect(result.execution).toMatchObject({ documentReference: "MEM-001/2026", documentId: document.id, recordId: "r12" });
    expect(database.semedGovernanceAuditLog[0]).toMatchObject({ entityType: "Execução financeira", action: "executar", actorUserId: "u-admin" });
  });

  it("hidrata bases v7 anteriores sem log transversal e preserva seus registros", () => {
    const current = createLocalSemedDatabase();
    const legacy = structuredClone(current) as Record<string, unknown>;
    delete legacy.semedGovernanceAuditLog;

    const hydrated = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(hydrated.schemaVersion).toBe(7);
    expect(hydrated.semedGovernanceAuditLog).toEqual([]);
    expect(hydrated.semedRecords).toHaveLength(current.semedRecords.length);
    expect(hydrated.semedDocuments).toHaveLength(current.semedDocuments.length);
  });
});

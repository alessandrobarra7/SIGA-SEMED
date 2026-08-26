/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
  completeLocalFirstAccess,
  confirmLocalRecordDeletion,
  createLocalDocument,
  createLocalPayment,
  createLocalRecord,
  loadLocalDatabase,
  loginLocalUser,
  saveLocalDatabase,
  updateLocalDocument,
} from "../client/src/pages/sigaLocalStore";

describe("persistência do repositório local no navegador", () => {
  beforeEach(() => window.localStorage.clear());

  it("reidrata criação, edição, baixa e exclusão a partir de window.localStorage", () => {
    const database = loadLocalDatabase(window.localStorage);
    const document = createLocalDocument(database, {
      kind: "Ofício", number: "901/2026", templateKey: "teste", subject: "criação no navegador", destination: "gabinete", recipient: "gestão", relatedRecord: "processo 189/2026", responsible: "técnico", documentDate: "2026-08-25", dueDate: "2026-08-30", status: "Em elaboração", summary: "resumo", notes: "observação",
    });
    updateLocalDocument(database, document.id, { ...document, subject: "edição persistida" });
    expect(createLocalPayment(database, { recordId: "r12", paymentDate: "2026-08-25", amount: 100, notes: "baixa persistida" })).toEqual({ error: null });
    const createdRecord = createLocalRecord(database, { kind: "Processo", number: "301/2026", object: "registro temporário", party: "setor", department: "administrativo", responsible: "técnico", amount: 0, financialCategory: "Sem controle", paymentDueDate: "", startDate: "2026-08-25", endDate: "2026-09-25", status: "Em andamento", notes: "teste", alertDays: 30 });
    expect(confirmLocalRecordDeletion(database, createdRecord.id, "EXCLUIR")).toBe(true);
    saveLocalDatabase(database, window.localStorage);

    const reloaded = loadLocalDatabase(window.localStorage);
    expect(reloaded.semedDocuments.find((item) => item.id === document.id)?.subject).toBe("EDIÇÃO PERSISTIDA");
    expect(reloaded.semedRecordPayments.some((payment) => payment.recordId === "r12" && payment.amount === 100)).toBe(true);
    expect(reloaded.semedRecords.some((record) => record.id === createdRecord.id)).toBe(false);
  });

  it("mantém o primeiro acesso concluído após salvar e recarregar no navegador", () => {
    const database = loadLocalDatabase(window.localStorage);
    const access = loginLocalUser(database, "tecnico1", "2026-08-25T12:00:00.000Z");
    completeLocalFirstAccess(database, access!.user.id, "2026-08-25T12:01:00.000Z");
    saveLocalDatabase(database, window.localStorage);

    const reloaded = loadLocalDatabase(window.localStorage);
    expect(loginLocalUser(reloaded, "tecnico1", "2026-08-25T12:02:00.000Z")?.user.mustChangePassword).toBe(false);
  });

  it("migra e persiste automaticamente uma base legada v1 no primeiro carregamento", () => {
    const current = loadLocalDatabase(window.localStorage);
    const legacy = structuredClone(current) as Record<string, unknown> & { semedUsers: Array<Record<string, unknown>> };
    legacy.schemaVersion = 1;
    delete legacy.semedUserPermissions;
    delete legacy.semedUserAuditLog;
    legacy.semedUsers.forEach((user) => {
      delete user.registration;
      delete user.profile;
      delete user.loginType;
      delete user.cpf;
      delete user.schoolUnitId;
      delete user.serverRegistrationId;
      delete user.provisionalPasswordIssuedAt;
      delete user.lastActivityAt;
    });
    window.localStorage.setItem("siga-semed-local-schema-v1", JSON.stringify(legacy));

    const migrated = loadLocalDatabase(window.localStorage);
    const persisted = JSON.parse(window.localStorage.getItem("siga-semed-local-schema-v1")!);
    expect(migrated.schemaVersion).toBe(6);
    expect(persisted.schemaVersion).toBe(6);
    expect(persisted.semedUserPermissions.length).toBeGreaterThan(0);
    expect(persisted.semedStockItems.length).toBeGreaterThan(0);
    expect(persisted.semedHrServers.length).toBeGreaterThan(0);
    expect(persisted.semedRecords).toHaveLength(current.semedRecords.length);
    expect(persisted.semedDocuments).toHaveLength(current.semedDocuments.length);
  });
});

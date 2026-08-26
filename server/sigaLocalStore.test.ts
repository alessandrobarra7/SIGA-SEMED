import { describe, expect, it } from "vitest";
import { calculateFinancialPosition, completeLocalFirstAccess, confirmLocalRecordDeletion, createLocalDocument, createLocalPayment, createLocalRecord, createLocalSemedDatabase, deleteLocalDocument, deleteLocalPayment, deleteLocalRecord, getLocalUserIdentity, hydrateLocalDatabase, listLocalRecords, loadLocalDatabase, loginLocalUser, logoutLocalSession, parseBrazilianAmount, requiresDeleteConfirmation, saveLocalDatabase, serializeLocalDatabase, updateLocalDocument, updateLocalRecord } from "../client/src/pages/sigaLocalStore";

describe("estrutura local compatível com o SIGA SEMED", () => {
  it("mantém as coleções estruturais e administrativas da referência", () => {
    const database = createLocalSemedDatabase();
    expect(database).toMatchObject({ schemaVersion: 5 });
    expect(database.semedUsers).toHaveLength(3);
    expect(database.semedUserPermissions.length).toBeGreaterThan(0);
    expect(database.semedUserAuditLog).toEqual([]);
    expect(database.semedRecords).toHaveLength(4);
    expect(database.semedRecordPayments.length).toBeGreaterThan(0);
    expect(database.semedDocuments).toHaveLength(3);
    expect(database.semedSessions).toEqual([]);
    expect(database.semedStockItems.length).toBeGreaterThan(0);
    expect(database.semedSchoolStocks.length).toBeGreaterThan(0);
    expect(database.semedHrServers.length).toBeGreaterThan(0);
  });

  it("deriva pago e saldo das baixas relacionadas pelo recordId", () => {
    const database = createLocalSemedDatabase();
    const contract = listLocalRecords(database).find((record) => record.id === "r12");
    expect(contract).toMatchObject({ paidAmount: 78500, balanceAmount: 270000 });
    expect(calculateFinancialPosition(1000, [{ id: "p", recordId: "r", paymentDate: "2026-01-01", amount: 240, notes: "PARCIAL", createdAt: "2026-01-01" }])).toEqual({ paidAmount: 240, balanceAmount: 760 });
  });

  it("preserva a leitura brasileira do valor usado pela baixa local", () => {
    expect(parseBrazilianAmount("1.234,56")).toBe(1234.56);
    expect(parseBrazilianAmount("0,00")).toBeNull();
  });

  it("usa as identidades demonstrativas da estrutura local, sem acessar senhas reais", () => {
    expect(getLocalUserIdentity("admin")).toEqual({ username: "admin", displayName: "Administrador", role: "Administrador" });
    expect(getLocalUserIdentity("tecnico1")).toEqual({ username: "tecnico1", displayName: "Técnico SEMED 1", role: "Técnico" });
  });

  it("autoriza todos os perfis demonstrativos cadastrados", () => {
    const database = createLocalSemedDatabase();
    expect(loginLocalUser(database, "admin")?.user.role).toBe("Administrador");
    expect(loginLocalUser(database, "tecnico1")?.user.displayName).toBe("Técnico SEMED 1");
    expect(loginLocalUser(database, "tecnico2")?.user.displayName).toBe("Técnico SEMED 2");
    expect(loginLocalUser(database, "usuario-invalido")).toBeNull();
  });

  it("simula login, primeiro acesso e encerramento pela estrutura de sessões", () => {
    const database = createLocalSemedDatabase();
    const access = loginLocalUser(database, "admin", "2026-08-25T12:00:00.000Z");
    expect(access?.user.mustChangePassword).toBe(true);
    expect(database.semedSessions).toHaveLength(1);
    expect(access?.session.expiresAt).toBe("2026-09-01T12:00:00.000Z");
    expect(completeLocalFirstAccess(database, "u-admin", "2026-08-25T12:01:00.000Z")?.mustChangePassword).toBe(false);
    expect(logoutLocalSession(database, access!.session.tokenHash)).toBe(true);
    expect(database.semedSessions).toHaveLength(0);
  });

  it("aceita a confirmação de exclusão apenas com o texto exigido", () => {
    expect(requiresDeleteConfirmation(" excluir ")).toBe(true);
    expect(requiresDeleteConfirmation("EXCLUIR AGORA")).toBe(false);
  });

  it("cria, atualiza e exclui registro com suas baixas relacionadas", () => {
    const database = createLocalSemedDatabase();
    const created = createLocalRecord(database, { kind: "Contrato", number: "099/2026", object: "Teste de compatibilidade", party: "Fornecedor", department: "Administrativo", responsible: "Técnico", amount: 1000, financialCategory: "Contrato geral", paymentDueDate: "", startDate: "2026-01-01", endDate: "2026-12-31", status: "Vigente", notes: "novo", alertDays: 30 }, "2026-08-25T12:00:00.000Z");
    expect(created.number).toBe("099/2026");
    expect(created.object).toBe("TESTE DE COMPATIBILIDADE");
    expect(createLocalPayment(database, { recordId: created.id, paymentDate: "2026-08-25", amount: 250, notes: "parcela" }, "2026-08-25T12:01:00.000Z")).toEqual({ error: null });
    expect(listLocalRecords(database).find((record) => record.id === created.id)).toMatchObject({ paidAmount: 250, balanceAmount: 750 });
    expect(updateLocalRecord(database, created.id, { ...created, object: "Registro atualizado", payments: undefined, paidAmount: undefined, balanceAmount: undefined } as never, "2026-08-25T12:02:00.000Z")?.object).toBe("REGISTRO ATUALIZADO");
    expect(deleteLocalRecord(database, created.id)).toBe(true);
    expect(database.semedRecordPayments.some((payment) => payment.recordId === created.id)).toBe(false);
  });

  it("cria, atualiza e exclui documento e permite remover uma baixa individual", () => {
    const database = createLocalSemedDatabase();
    const firstPaymentId = database.semedRecordPayments[0].id;
    expect(deleteLocalPayment(database, firstPaymentId)).toBe(true);
    const created = createLocalDocument(database, { kind: "Ofício", number: "700/2026", templateKey: "teste", subject: "assunto", destination: "destino", recipient: "destinatário", relatedRecord: "contrato 012/2026", responsible: "técnico", documentDate: "2026-08-25", dueDate: "2026-08-30", status: "Em elaboração", summary: "resumo", notes: "observação" }, "2026-08-25T12:00:00.000Z");
    expect(created.subject).toBe("ASSUNTO");
    expect(updateLocalDocument(database, created.id, { ...created, subject: "novo assunto" }, "2026-08-25T12:01:00.000Z")?.subject).toBe("NOVO ASSUNTO");
    expect(deleteLocalDocument(database, created.id)).toBe(true);
  });

  it("serializa e reidrata a estrutura local sem perder as coleções", () => {
    const database = createLocalSemedDatabase();
    const hydrated = hydrateLocalDatabase(serializeLocalDatabase(database));
    expect(hydrated?.semedRecords).toHaveLength(4);
    expect(hydrated?.semedDocuments).toHaveLength(3);
    expect(hydrateLocalDatabase("inválido")).toBeNull();
  });

  it("persiste operações do repositório em armazenamento local e as restaura", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    const database = createLocalSemedDatabase();
    const created = createLocalRecord(database, { kind: "Processo", number: "300/2026", object: "Processo persistido", party: "Setor", department: "Administrativo", responsible: "Técnico", amount: 0, financialCategory: "Sem controle", paymentDueDate: "", startDate: "2026-01-01", endDate: "2026-01-31", status: "Em andamento", notes: "teste", alertDays: 30 });
    saveLocalDatabase(database, storage);
    const restored = loadLocalDatabase(storage);
    expect(restored.semedRecords.some((record) => record.id === created.id && record.object === "PROCESSO PERSISTIDO")).toBe(true);
  });

  it("integra a confirmação EXCLUIR à remoção do registro", () => {
    const database = createLocalSemedDatabase();
    expect(confirmLocalRecordDeletion(database, "r12", "remover")).toBe(false);
    expect(database.semedRecords.some((record) => record.id === "r12")).toBe(true);
    expect(confirmLocalRecordDeletion(database, "r12", "EXCLUIR")).toBe(true);
    expect(database.semedRecords.some((record) => record.id === "r12")).toBe(false);
    expect(database.semedRecordPayments.some((payment) => payment.recordId === "r12")).toBe(false);
  });

  it("mantém o primeiro acesso concluído após reidratar o repositório local", () => {
    const database = createLocalSemedDatabase();
    const access = loginLocalUser(database, "admin", "2026-08-25T12:00:00.000Z");
    completeLocalFirstAccess(database, access!.user.id, "2026-08-25T12:01:00.000Z");
    const restored = hydrateLocalDatabase(serializeLocalDatabase(database))!;
    expect(loginLocalUser(restored, "admin", "2026-08-25T12:02:00.000Z")?.user.mustChangePassword).toBe(false);
  });
});

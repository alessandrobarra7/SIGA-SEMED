import { describe, expect, it } from "vitest";
import {
  createLocalSemedDatabase,
  finishLocalStockAudit,
  hydrateLocalDatabase,
  registerLocalSchoolStockMovement,
  registerLocalStockMovement,
  saveLocalKitOrder,
  saveLocalSchoolStockCount,
  saveLocalStockItem,
  startLocalStockAudit,
  stockSituation,
} from "../client/src/pages/sigaLocalStore";

describe("operações locais de Estoque", () => {
  it("cadastra materiais, controla entradas e bloqueia saídas acima do saldo", () => {
    const database = createLocalSemedDatabase();
    const created = saveLocalStockItem(database, { scope: "Industrializado", code: "EST-DEMO-901", name: "MATERIAL DE TESTE", category: "Expediente", unit: "UN", minimumQuantity: 3, location: "Almoxarifado", barcode: "", active: true, unitCost: 4.5 }, "u-admin", "2026-08-26T10:00:00.000Z");
    expect(created.error).toBeNull();
    expect(created.item?.balance).toBe(0);

    const entry = registerLocalStockMovement(database, { scope: "Industrializado", itemId: created.item!.id, type: "Entrada", quantity: 10, origin: "FORNECEDOR DEMONSTRATIVO", destination: "ALMOXARIFADO", reference: "NF LOCAL", notes: "" }, "u-admin", "2026-08-26T10:01:00.000Z");
    expect(entry.error).toBeNull();
    expect(created.item?.balance).toBe(10);
    expect(stockSituation(created.item!)).toBe("Disponível");

    const rejected = registerLocalStockMovement(database, { scope: "Industrializado", itemId: created.item!.id, type: "Saída", quantity: 11, origin: "ALMOXARIFADO", destination: "UNIDADE DEMONSTRATIVA", reference: "GUIA LOCAL", notes: "" }, "u-admin");
    expect(rejected.error).toContain("saldo");
    expect(created.item?.balance).toBe(10);
  });

  it("registra e conclui auditoria ajustando o saldo local contado", () => {
    const database = createLocalSemedDatabase();
    const audit = startLocalStockAudit(database, "Industrializado", "u-admin", "CONFERÊNCIA LOCAL", "2026-08-26T11:00:00.000Z");
    expect(audit.error).toBeNull();
    const target = audit.audit!.entries[0];
    expect(finishLocalStockAudit(database, audit.audit!.id, [{ ...target, countedQuantity: target.registeredBalance + 2, difference: 2 }], "u-admin", "2026-08-26T11:05:00.000Z")).toBe(true);
    expect(database.semedStockAudits[0]).toMatchObject({ status: "Concluída", closedAt: "2026-08-26T11:05:00.000Z" });
    expect(database.semedStockItems.find((item) => item.id === target.itemId)?.balance).toBe(target.registeredBalance + 2);
  });

  it("confere e movimenta estoque escolar apenas dentro do saldo disponível", () => {
    const database = createLocalSemedDatabase();
    const row = database.semedSchoolStocks.find((item) => item.scope === "Alimentação Escolar")!;
    const count = saveLocalSchoolStockCount(database, row.id, row.balance + 1, "CONTAGEM DEMONSTRATIVA", "u-admin", "2026-08-26T12:00:00.000Z");
    expect(count.error).toBeNull();
    expect(row.balance).toBe(count.count?.countedQuantity);

    const consumption = registerLocalSchoolStockMovement(database, row.id, "Consumo", 1, "CONSUMO LOCAL", "", "u-admin", "2026-08-26T12:01:00.000Z");
    expect(consumption.error).toBeNull();
    expect(row.balance).toBe((count.count?.countedQuantity ?? 0) - 1);
  });

  it("registra pedido de kit e protege operações sem permissão de Estoque", () => {
    const database = createLocalSemedDatabase();
    const kitItem = database.semedStockItems.find((item) => item.scope === "Kit do Aluno")!;
    const school = database.semedNutritionSchools[0];
    const order = saveLocalKitOrder(database, { schoolId: school.id, className: "5º ANO A", referenceYear: 2026, status: "Em andamento", items: [{ itemId: kitItem.id, requestedQuantity: 24, receivedQuantity: 0, distributedQuantity: 0 }], notes: "PEDIDO DEMONSTRATIVO" }, "u-admin");
    expect(order.error).toBeNull();
    expect(database.semedKitOrders.some((item) => item.className === "5º ANO A")).toBe(true);

    const denied = saveLocalStockItem(database, { scope: "Industrializado", code: "SEM-PERMISSAO", name: "NEGADO", category: "Teste", unit: "UN", minimumQuantity: 0, location: "", barcode: "", active: true, unitCost: 0 }, "u-tecnico2");
    expect(denied.error).toContain("permissão");
  });

  it("migra uma base v2 preservando dados anteriores e criando as coleções de Estoque", () => {
    const current = createLocalSemedDatabase();
    const legacy = structuredClone(current) as Record<string, unknown>;
    legacy.schemaVersion = 2;
    delete legacy.semedStockItems;
    delete legacy.semedStockMovements;
    delete legacy.semedStockAudits;
    delete legacy.semedSchoolStocks;
    delete legacy.semedSchoolStockCounts;
    delete legacy.semedSchoolStockMovements;
    delete legacy.semedKitOrders;
    const migrated = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(migrated.schemaVersion).toBe(11);
    expect(migrated.semedRecords).toHaveLength(current.semedRecords.length);
    expect(migrated.semedNutritionAnnualPlans).toHaveLength(current.semedNutritionAnnualPlans.length);
    expect(migrated.semedStockItems.length).toBeGreaterThan(0);
    expect(migrated.semedSchoolStocks.length).toBeGreaterThan(0);
    expect(migrated.semedHrServers.length).toBeGreaterThan(0);
  });
});

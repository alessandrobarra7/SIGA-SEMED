/* @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedFinancePage from "../client/src/pages/SemedFinancePage";
import {
  canWriteLocalModule,
  createLocalSemedDatabase,
  createLocalUser,
  financeRuleIndicators,
  financeSummary,
  hydrateLocalDatabase,
  saveLocalFinanceExecution,
  saveLocalFinancePlanningEntry,
  saveLocalFinanceRevenue,
  saveLocalFinanceRule,
  saveLocalFinanceSource,
  type SemedFinanceExecutionInput,
  type SemedFinancePlanningInput,
  type SemedFinanceRevenueInput,
} from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

function planningInput(overrides: Partial<SemedFinancePlanningInput> = {}): SemedFinancePlanningInput {
  return { referenceMonth: "2026-08", sourceId: "finance-source-fundeb", program: "Programa de teste", description: "Planejamento demonstrativo de teste", expenseNature: "Custeio", plannedAmount: 350, status: "Ativo", ...overrides };
}
function revenueInput(overrides: Partial<SemedFinanceRevenueInput> = {}): SemedFinanceRevenueInput {
  return { receiptDate: "2026-08-05", sourceId: "finance-source-fundeb", component: "Repasse de teste", type: "Repasse", reference: "Receita local de teste", amount: 500, status: "Ativo", ...overrides };
}
function executionInput(overrides: Partial<SemedFinanceExecutionInput> = {}): SemedFinanceExecutionInput {
  return { executionDate: "2026-08-09", sourceId: "finance-source-fundeb", stage: "Pago", description: "Execução demonstrativa de teste", classification: "FUNDEB_70", documentReference: "DOC-DEMO-TESTE", amount: 220, status: "Ativo", ...overrides };
}

describe("Financeiro ampliado local", () => {
  it("migra uma base v5 para v6 preservando módulos anteriores e criando as coleções financeiras", () => {
    const current = createLocalSemedDatabase();
    const legacy = { ...current, schemaVersion: 5 } as unknown as Record<string, unknown>;
    delete legacy.semedFinanceSources; delete legacy.semedFinanceRules; delete legacy.semedFinancePlanningEntries; delete legacy.semedFinanceRevenues; delete legacy.semedFinanceExecutions; delete legacy.semedFinanceAuditLog;
    const restored = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(restored.schemaVersion).toBe(6);
    expect(restored.semedUsers).toHaveLength(current.semedUsers.length);
    expect(restored.semedSchoolUnits.length).toBeGreaterThan(0);
    expect(restored.semedFinanceSources.length).toBeGreaterThan(0);
    expect(restored.semedFinanceRules.length).toBeGreaterThan(0);
  });

  it("protege fontes e regras para Administrador e permite lançamentos ao técnico autorizado", () => {
    const database = createLocalSemedDatabase();
    expect(saveLocalFinanceSource(database, { code: "TESTE", name: "Fonte de teste", category: "Programa", openingBalance: 0, active: true }, "u-tecnico1").error).toContain("Administrador");
    const source = saveLocalFinanceSource(database, { code: "TESTE", name: "Fonte de teste", category: "Programa", openingBalance: 250, active: true }, "u-admin");
    expect(source.error).toBeNull();
    expect(saveLocalFinanceSource(database, { code: "TESTE", name: "Outra fonte", category: "Programa", openingBalance: 0, active: true }, "u-admin").error).toContain("código");
    const technical = createLocalUser(database, { displayName: "Técnico Financeiro", registration: "40000001-0", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["inicio", "financeiro"] }, "u-admin").user!;
    expect(canWriteLocalModule(database, technical, "financeiro")).toBe(true);
    expect(saveLocalFinancePlanningEntry(database, planningInput({ sourceId: source.source!.id }), technical.id).error).toBeNull();
    expect(saveLocalFinanceRevenue(database, revenueInput({ sourceId: source.source!.id }), technical.id).error).toBeNull();
    const execution = saveLocalFinanceExecution(database, executionInput({ sourceId: source.source!.id }), technical.id);
    expect(execution.error).toBeNull();
    expect(saveLocalFinanceExecution(database, { ...execution.execution!, status: "Cancelado" }, technical.id).error).toBeNull();
    expect(database.semedFinanceAuditLog.some((entry) => entry.action === "lancamento.cancelado")).toBe(true);
  });

  it("consolida disponibilidade e metas por regra apenas com lançamentos ativos", () => {
    const database = createLocalSemedDatabase();
    const summary = financeSummary(database, 2026);
    expect(summary.planned).toBeGreaterThan(0);
    expect(summary.revenues).toBeGreaterThan(0);
    expect(summary.availability).toBe(summary.revenues + database.semedFinanceSources.reduce((total, source) => total + source.openingBalance, 0) - summary.paid);
    const indicators = financeRuleIndicators(database, 2026);
    expect(indicators.some((item) => item.rule.code === "FUNDEB_70")).toBe(true);
    expect(saveLocalFinanceRule(database, { code: "TESTE_10", name: "Regra local", targetPercentage: 10, description: "Teste", referenceYear: 2026, active: true }, "u-admin").error).toBeNull();
  });

  it("renderiza as seis áreas e abre o formulário de planejamento", () => {
    const database = createLocalSemedDatabase();
    const props = {
      sources: database.semedFinanceSources, rules: database.semedFinanceRules, planningEntries: database.semedFinancePlanningEntries, revenues: database.semedFinanceRevenues, executions: database.semedFinanceExecutions,
      contractCount: database.semedRecords.length, hrRecordCount: database.semedHrFinancialRecords.length, canWrite: true, canManageRules: true,
      onSaveSource: vi.fn(() => ({ error: null, source: database.semedFinanceSources[0] })), onSaveRule: vi.fn(() => ({ error: null, rule: database.semedFinanceRules[0] })),
      onSavePlanning: vi.fn(() => ({ error: null, entry: database.semedFinancePlanningEntries[0] })), onSaveRevenue: vi.fn(() => ({ error: null, revenue: database.semedFinanceRevenues[0] })), onSaveExecution: vi.fn(() => ({ error: null, execution: database.semedFinanceExecutions[0] })), onNotify: vi.fn(),
    };
    render(<SemedFinancePage {...props} />);
    expect(screen.getByRole("heading", { name: "Financeiro" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Planejamento" }));
    expect(screen.getByRole("heading", { name: "Planejamento anual" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Novo cadastro" }));
    expect(screen.getByRole("heading", { name: "Novo planejamento" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Receitas" }));
    expect(screen.getByRole("heading", { name: "Receitas e repasses" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Execução" }));
    expect(screen.getByRole("heading", { name: "Execução da despesa" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Fontes e regras" }));
    expect(screen.getByRole("heading", { name: "Fontes de recursos" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Relatórios" }));
    expect(screen.getByRole("heading", { name: "Relatório da execução" })).toBeTruthy();
  });
});

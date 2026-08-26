/* @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedHumanResourcesPage from "../client/src/pages/SemedHumanResourcesPage";
import {
  calculateHrFinancialTotals,
  canWriteLocalModule,
  createLocalSemedDatabase,
  createLocalUser,
  hydrateLocalDatabase,
  saveLocalHrAttendancePeriod,
  saveLocalHrFinancialRecord,
  saveLocalHrServer,
  serializeLocalDatabase,
  type SemedHrAttendanceInput,
  type SemedHrFinancialRecordInput,
  type SemedHrServerInput,
} from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

function serverInput(overrides: Partial<SemedHrServerInput> = {}): SemedHrServerInput {
  return {
    registration: "RH-DEMO-040", displayName: "Servidor de Teste", cpf: "12345678901", jobTitle: "Assistente demonstrativo",
    schoolUnitId: "nutrition-school-1", status: "Ativo", admissionDate: "2024-02-01", hasPhone: true, hasEmail: true, hasIc: false, baseSalary: 1800,
    ...overrides,
  };
}

function financialInput(serverId: string, overrides: Partial<SemedHrFinancialRecordInput> = {}): SemedHrFinancialRecordInput {
  return { serverId, referenceMonth: "2026-08", notes: "Competência de teste", items: [{ description: "Vencimento", kind: "Provento", amount: 1800 }, { description: "Desconto local", kind: "Desconto", amount: 120 }], ...overrides };
}

function attendanceInput(serverId: string, overrides: Partial<SemedHrAttendanceInput> = {}): SemedHrAttendanceInput {
  return { code: "FREQ-DEMO-08", referenceMonth: "2026-08", schoolUnitId: "nutrition-school-1", plannedDays: 22, calendarEvents: [], entries: [{ serverId, workedDays: 22, absences: 0, notes: "" }], status: "Em preparação", returnReason: "", ...overrides };
}

describe("recursos humanos local compatível com a referência observada", () => {
  it("migra uma base v3 para v6 preservando módulos existentes e criando coleções de RH", () => {
    const database = createLocalSemedDatabase();
    const legacy = { ...database, schemaVersion: 3 } as unknown as Record<string, unknown>;
    delete legacy.semedHrServers; delete legacy.semedHrFinancialRecords; delete legacy.semedHrAttendancePeriods; delete legacy.semedHrAuditLog;
    const restored = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(restored.schemaVersion).toBe(7);
    expect(restored.semedStockItems.length).toBeGreaterThan(0);
    expect(restored.semedHrServers.length).toBeGreaterThan(0);
    expect(restored.semedNutritionAnnualPlans.length).toBeGreaterThan(0);
  });

  it("protege cadastro de servidores, valida duplicidade e grava auditoria", () => {
    const database = createLocalSemedDatabase();
    expect(saveLocalHrServer(database, serverInput(), "u-tecnico1").error).toContain("sem permissão");
    const created = saveLocalHrServer(database, serverInput(), "u-admin");
    expect(created.error).toBeNull();
    expect(created.server?.registration).toBe("RH-DEMO-040");
    expect(saveLocalHrServer(database, serverInput({ displayName: "Outro servidor", cpf: "98765432100" }), "u-admin").error).toContain("matrícula");
    expect(database.semedHrAuditLog[0]).toMatchObject({ action: "servidor.criado", targetId: created.server?.id });
  });

  it("calcula ficha financeira e registra competência com permissão específica", () => {
    const database = createLocalSemedDatabase();
    const server = saveLocalHrServer(database, serverInput(), "u-admin").server!;
    const technical = createLocalUser(database, { displayName: "Técnica RH", registration: "30000040-0", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["inicio", "rh", "rh.ficha_financeira", "rh.frequencia"] }, "u-admin").user!;
    expect(canWriteLocalModule(database, technical, "rh.ficha_financeira")).toBe(true);
    const record = saveLocalHrFinancialRecord(database, financialInput(server.id), technical.id);
    expect(record.error).toBeNull();
    expect(calculateHrFinancialTotals(record.record!)).toEqual({ earnings: 1800, discounts: 120, net: 1680 });
    const period = saveLocalHrAttendancePeriod(database, attendanceInput(server.id, { status: "Enviada ao RH" }), technical.id);
    expect(period.error).toBeNull();
    expect(period.period?.status).toBe("Enviada ao RH");
    expect(database.semedHrAuditLog.some((entry) => entry.action === "competencia.enviada")).toBe(true);
  });

  it("preserva coleções de RH após serialização", () => {
    const database = createLocalSemedDatabase();
    const server = saveLocalHrServer(database, serverInput(), "u-admin").server!;
    saveLocalHrFinancialRecord(database, financialInput(server.id), "u-admin");
    saveLocalHrAttendancePeriod(database, attendanceInput(server.id), "u-admin");
    const restored = hydrateLocalDatabase(serializeLocalDatabase(database))!;
    expect(restored.semedHrServers.some((item) => item.id === server.id)).toBe(true);
    expect(restored.semedHrFinancialRecords).toHaveLength(database.semedHrFinancialRecords.length);
    expect(restored.semedHrAttendancePeriods).toHaveLength(database.semedHrAttendancePeriods.length);
  });

  it("renderiza as cinco áreas de Recursos Humanos e abre o formulário de servidores", () => {
    const database = createLocalSemedDatabase();
    const props = {
      currentUser: { ...database.semedUsers[0], mustChangePassword: false }, schools: database.semedNutritionSchools,
      servers: database.semedHrServers, financialRecords: database.semedHrFinancialRecords, attendancePeriods: database.semedHrAttendancePeriods, auditLog: database.semedHrAuditLog,
      canWriteServers: true, canWriteFinancial: true, canWriteAttendance: true, onSaveServer: vi.fn(() => ({ error: null, server: database.semedHrServers[0] })), onSaveFinancial: vi.fn(() => ({ error: null, record: database.semedHrFinancialRecords[0] })), onSaveAttendance: vi.fn(() => ({ error: null, period: database.semedHrAttendancePeriods[0] })), onNotify: vi.fn(),
    };
    render(<SemedHumanResourcesPage {...props} />);
    expect(screen.getByRole("heading", { name: "Recursos Humanos" })).toBeTruthy();
    expect(screen.queryByText("Módulo mapeado")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Novo servidor/i }));
    expect(screen.getByRole("heading", { name: "Novo servidor" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Ficha Financeira" }));
    expect(screen.getByRole("heading", { name: "Ficha Financeira" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Frequência e movimento" }));
    expect(screen.getByRole("heading", { name: "Frequência e movimento" })).toBeTruthy();
  });
});

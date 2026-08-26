// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedInstitutionSettingsPage from "../client/src/pages/SemedInstitutionSettingsPage";
import { createLocalSemedDatabase, hydrateLocalDatabase, saveLocalInstitutionSettings, type SemedInstitutionSettingsInput } from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

function settingsInput(overrides: Partial<SemedInstitutionSettingsInput> = {}): SemedInstitutionSettingsInput {
  return { institutionName: "Secretaria demonstrativa", acronym: "SEMED", municipality: "Município demonstrativo", referenceYear: 2027, timezone: "America/Fortaleza", notificationsEnabled: true, deadlineAlertDays: 20, sessionDays: 7, minimumPasswordLength: 8, maintenanceMessage: "Aviso local de teste.", ...overrides };
}

describe("Configurações institucionais locais", () => {
  it("migra v6 para v7 preservando os módulos existentes e criando os parâmetros locais", () => {
    const current = createLocalSemedDatabase();
    const legacy = { ...current, schemaVersion: 6 } as unknown as Record<string, unknown>;
    delete legacy.semedInstitutionSettings;
    delete legacy.semedInstitutionSettingsAuditLog;
    const restored = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(restored.schemaVersion).toBe(9);
    expect(restored.semedFinanceSources).toHaveLength(current.semedFinanceSources.length);
    expect(restored.semedSchoolUnits).toHaveLength(current.semedSchoolUnits.length);
    expect(restored.semedInstitutionSettings.acronym).toBe("SEMED");
  });

  it("restringe a escrita ao Administrador e registra auditoria sem dados externos", () => {
    const database = createLocalSemedDatabase();
    expect(saveLocalInstitutionSettings(database, settingsInput(), "u-tecnico1").error).toContain("Administrador");
    const saved = saveLocalInstitutionSettings(database, settingsInput(), "u-admin");
    expect(saved.error).toBeNull();
    expect(database.semedInstitutionSettings.referenceYear).toBe(2027);
    expect(database.semedInstitutionSettingsAuditLog).toHaveLength(1);
    expect(database.semedInstitutionSettingsAuditLog[0].changedFields).toContain("referenceYear");
    expect(saveLocalInstitutionSettings(database, settingsInput({ minimumPasswordLength: 6 }), "u-admin").error).toContain("limites locais");
  });

  it("renderiza quatro seções e encaminha o salvamento local", () => {
    const database = createLocalSemedDatabase();
    const onSave = vi.fn(() => ({ error: null, settings: database.semedInstitutionSettings }));
    render(<SemedInstitutionSettingsPage settings={database.semedInstitutionSettings} auditLog={[]} governanceAuditLog={[]} actorUserId="u-admin" readOnly={false} onSave={onSave} />);
    expect(screen.getByRole("heading", { name: "Configurações institucionais" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Exercício/ }));
    expect(screen.getByRole("heading", { name: "Exercício e referência" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Comunicações/ }));
    expect(screen.getByRole("heading", { name: "Comunicações internas" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Segurança/ }));
    expect(screen.getByRole("heading", { name: "Segurança e auditoria" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Salvar configurações" }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ acronym: "SEMED" }), "u-admin");
  });
});

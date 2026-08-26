// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLocalSemedDatabase, hydrateLocalDatabase, saveLocalFleetFuel, saveLocalFleetMaintenance, saveLocalFleetOccurrence, saveLocalFleetVehicle } from "../client/src/pages/sigaLocalStore";
import SemedFleetPage from "../client/src/pages/SemedFleetPage";

afterEach(() => cleanup());

describe("Frota local", () => {
  it("migra uma base v7 preservando os módulos anteriores e preenchendo Frota", () => {
    const current = createLocalSemedDatabase();
    const legacy = { ...current, schemaVersion: 7 } as Record<string, unknown>;
    delete legacy.semedFleetVehicles; delete legacy.semedFleetFuelLogs; delete legacy.semedFleetMaintenances; delete legacy.semedFleetOccurrences;
    const restored = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(restored.schemaVersion).toBe(8);
    expect(restored.semedFleetVehicles.length).toBeGreaterThan(0);
    expect(restored.semedFinanceExecutions).toHaveLength(current.semedFinanceExecutions.length);
    expect(restored.semedInstitutionSettings.acronym).toBe("SEMED");
  });

  it("protege lançamentos, calcula abastecimento e audita operações da Frota", () => {
    const database = createLocalSemedDatabase();
    const vehicle = saveLocalFleetVehicle(database, { code: "FRO-DEMO-003", patrimony: "PAT-DEMO-003", plate: "DEMO-003", model: "Veículo administrativo demonstrativo", category: "Administrativo", status: "Ativo", odometerKm: 100, capacity: 5, responsibleUserId: "u-tecnico1", costCenter: "Centro demonstrativo", recordId: "", documentId: "", sourceId: "" }, "u-admin").vehicle!;
    const fuel = saveLocalFleetFuel(database, { vehicleId: vehicle.id, fuelDate: "2026-08-26", odometerKm: 180, liters: 20, unitPrice: 5.5, supplier: "Fornecedor demonstrativo", responsibleUserId: "u-tecnico1", documentReference: "NF-DEMO-003", recordId: "", documentId: "", sourceId: "", status: "Registrado" }, "u-admin");
    expect(fuel.error).toBeNull();
    expect(fuel.fuel?.totalAmount).toBe(110);
    expect(database.semedFleetVehicles.find((item) => item.id === vehicle.id)?.odometerKm).toBe(180);
    expect(database.semedGovernanceAuditLog.some((item) => item.entityType === "Abastecimento" && item.entityId === fuel.fuel?.id)).toBe(true);
    const denied = saveLocalFleetFuel(database, { ...fuel.fuel!, status: "Cancelado" }, "u-tecnico1");
    expect(denied.error).toContain("permissão");
  });

  it("controla manutenção e exige aprovação para resolver ocorrência", () => {
    const database = createLocalSemedDatabase();
    const vehicleId = database.semedFleetVehicles[0].id;
    const maintenance = saveLocalFleetMaintenance(database, { vehicleId, maintenanceDate: "2026-08-26", odometerKm: 19000, type: "Preventiva", supplier: "Oficina demonstrativa", cost: 200, nextDate: "2027-02-26", nextOdometerKm: 24000, description: "Revisão local.", responsibleUserId: "u-tecnico1", recordId: "", documentId: "", sourceId: "", status: "Agendada" }, "u-admin");
    expect(maintenance.error).toBeNull();
    expect(database.semedFleetVehicles.find((item) => item.id === vehicleId)?.status).toBe("Em manutenção");
    const input = { vehicleId, occurrenceDate: "2026-08-26", type: "Avaria" as const, status: "Resolvida" as const, location: "Setor demonstrativo", responsibleUserId: "u-tecnico1", description: "Ocorrência local.", resolution: "Resolvida localmente.", recordId: "", documentId: "" };
    expect(saveLocalFleetOccurrence(database, input, "u-tecnico1").error).toContain("permissão");
    expect(saveLocalFleetOccurrence(database, input, "u-admin").error).toBeNull();
  });

  it("renderiza veículos, abastecimento, manutenção, ocorrências e relatórios", () => {
    const database = createLocalSemedDatabase();
    render(<SemedFleetPage vehicles={database.semedFleetVehicles} fuelLogs={database.semedFleetFuelLogs} maintenances={database.semedFleetMaintenances} occurrences={database.semedFleetOccurrences} actorUserId="u-admin" canWrite={true} onSaveVehicle={vi.fn(() => ({ error: null, vehicle: database.semedFleetVehicles[0] }))} onSaveFuel={vi.fn(() => ({ error: null, fuel: database.semedFleetFuelLogs[0] }))} onSaveMaintenance={vi.fn(() => ({ error: null, maintenance: database.semedFleetMaintenances[0] }))} onSaveOccurrence={vi.fn(() => ({ error: null, occurrence: database.semedFleetOccurrences[0] }))} onNotify={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Frota" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Abastecimento" }));
    expect(screen.getByRole("heading", { name: "Controle de abastecimento" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Manutenção" }));
    expect(screen.getByRole("heading", { name: "Controle de manutenção" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Ocorrências" }));
    expect(screen.getByRole("heading", { name: "Controle de ocorrências" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Relatórios" }));
    expect(screen.getByRole("heading", { name: "Relatórios de Frota" })).toBeTruthy();
    expect(screen.queryByText("Módulo mapeado")).toBeNull();
  });
});

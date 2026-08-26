/* @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedSchoolsEducaPage from "../client/src/pages/SemedSchoolsEducaPage";
import {
  createLocalUser,
  createLocalSemedDatabase,
  hydrateLocalDatabase,
  saveLocalEducaNucleus,
  saveLocalSchoolUnit,
  type SemedEducaNucleusInput,
  type SemedSchoolUnitInput,
} from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

function schoolInput(overrides: Partial<SemedSchoolUnitInput> = {}): SemedSchoolUnitInput {
  return { code: "UE-DEMO-090", name: "Escola Demonstrativa de Teste", type: "Municipal", status: "Ativa", censusYear: 2026, neighborhood: "Setor de teste", address: "Endereço demonstrativo", students: 240, hasUex: true, hasMap: false, ...overrides };
}

function nucleusInput(overrides: Partial<SemedEducaNucleusInput> = {}): SemedEducaNucleusInput {
  return { code: "EP-DEMO-090", name: "Núcleo Demonstrativo de Teste", classification: "Pleno", status: "Ativo", roomCount: 4, capacityPerShift: 120, activities: ["Atividade de teste"], sportModalities: ["Modalidade de teste"], address: "Endereço demonstrativo", coordination: "Coordenação demonstrativa", supervision: "Supervisão demonstrativa", integratedNutrition: true, ...overrides };
}

describe("Unidades Escolares e Educa Paço locais", () => {
  it("migra uma base v4 para v6 preservando os módulos existentes e inserindo as duas novas coleções", () => {
    const current = createLocalSemedDatabase();
    const legacy = { ...current, schemaVersion: 4 } as unknown as Record<string, unknown>;
    delete legacy.semedSchoolUnits; delete legacy.semedEducaNuclei;
    const restored = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(restored.schemaVersion).toBe(7);
    expect(restored.semedUsers).toHaveLength(current.semedUsers.length);
    expect(restored.semedStockItems).toHaveLength(current.semedStockItems.length);
    expect(restored.semedHrServers).toHaveLength(current.semedHrServers.length);
    expect(restored.semedSchoolUnits.length).toBeGreaterThan(0);
    expect(restored.semedEducaNuclei.length).toBeGreaterThan(0);
  });

  it("cria e edita unidade escolar, protegendo escrita e bloqueando código duplicado", () => {
    const database = createLocalSemedDatabase();
    expect(saveLocalSchoolUnit(database, schoolInput(), "u-tecnico1").error).toContain("sem permissão");
    const technical = createLocalUser(database, { displayName: "Técnico de Unidades", registration: "30000090-0", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["inicio", "unidades_escolares", "educa_paco"] }, "u-admin").user!;
    const created = saveLocalSchoolUnit(database, schoolInput(), technical.id);
    expect(created.error).toBeNull();
    expect(created.unit?.code).toBe("UE-DEMO-090");
    expect(saveLocalSchoolUnit(database, schoolInput({ name: "Duplicada" }), "u-admin").error).toContain("Já existe");
    const edited = saveLocalSchoolUnit(database, schoolInput({ id: created.unit?.id, students: 300, hasMap: true }), technical.id);
    expect(edited.unit).toMatchObject({ students: 300, hasMap: true });
  });

  it("cria e edita núcleo Educa Paço, preservando atividades e modalidades locais", () => {
    const database = createLocalSemedDatabase();
    expect(saveLocalEducaNucleus(database, nucleusInput(), "u-tecnico1").error).toContain("sem permissão");
    const technical = createLocalUser(database, { displayName: "Técnico de Núcleos", registration: "30000091-9", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["inicio", "educa_paco"] }, "u-admin").user!;
    const created = saveLocalEducaNucleus(database, nucleusInput(), technical.id);
    expect(created.error).toBeNull();
    expect(created.nucleus?.activities).toContain("Atividade de teste");
    expect(saveLocalEducaNucleus(database, nucleusInput({ name: "Duplicado" }), "u-admin").error).toContain("Já existe");
    const edited = saveLocalEducaNucleus(database, nucleusInput({ id: created.nucleus?.id, capacityPerShift: 180, sportModalities: ["Modalidade atualizada"] }), technical.id);
    expect(edited.nucleus).toMatchObject({ capacityPerShift: 180, sportModalities: ["Modalidade atualizada"] });
  });

  it("renderiza Cadastro e Relatórios nos dois módulos sem o placeholder genérico", () => {
    const database = createLocalSemedDatabase();
    const props = { currentUser: { ...database.semedUsers[0], mustChangePassword: false }, schoolUnits: database.semedSchoolUnits, educaNuclei: database.semedEducaNuclei, canWriteSchools: true, canWriteEduca: true, onSaveSchool: vi.fn(() => ({ error: null })), onSaveNucleus: vi.fn(() => ({ error: null })), onNotify: vi.fn() };
    const { rerender } = render(<SemedSchoolsEducaPage initialSection="schools" {...props} />);
    expect(screen.getByRole("heading", { name: "Cadastro de Unidades Escolares" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Nova unidade/i })).toBeTruthy();
    rerender(<SemedSchoolsEducaPage initialSection="schools-reports" {...props} />);
    expect(screen.getByRole("heading", { name: "Relatórios de Unidades Escolares" })).toBeTruthy();
    rerender(<SemedSchoolsEducaPage initialSection="educa" {...props} />);
    expect(screen.getByRole("heading", { name: "Cadastro de Núcleos" })).toBeTruthy();
    rerender(<SemedSchoolsEducaPage initialSection="educa-reports" {...props} />);
    expect(screen.getByRole("heading", { name: "Relatórios de Educa Paço" })).toBeTruthy();
    expect(screen.queryByText("Módulo mapeado")).toBeNull();
  });
});

// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedNutritionPage from "../client/src/pages/SemedNutritionPage";
import {
  annualNutritionPlanResults,
  archiveLocalNutritionWeeklyPlan,
  canWriteLocalModule,
  createLocalSemedDatabase,
  createLocalUser,
  nutritionMondays,
  saveLocalNutritionAnnualPlan,
  saveLocalNutritionWeeklyPlan,
  serializeLocalDatabase,
  hydrateLocalDatabase,
  weeklyNutritionProductAnalysis,
  type SemedNutritionAnnualInput,
  type SemedNutritionWeeklyInput,
} from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

function weeklyInput(overrides: Partial<SemedNutritionWeeklyInput> = {}): SemedNutritionWeeklyInput {
  return {
    contractId: "nutrition-contract-af",
    schoolId: "nutrition-school-1",
    referenceMonth: "2026-08",
    educationModality: "Ensino Fundamental",
    status: "Em análise",
    notes: "Teste local",
    items: [
      { productId: "nutrition-product-arroz", weeklyQuantities: [30, 30, 30, 30, 30] },
      { productId: "nutrition-product-feijao", weeklyQuantities: [10, 10, 10, 10, 10] },
    ],
    ...overrides,
  };
}

function annualInput(overrides: Partial<SemedNutritionAnnualInput> = {}): SemedNutritionAnnualInput {
  return {
    name: "Planejamento anual de teste",
    referenceYear: 2026,
    modality: "Ensino Fundamental",
    educationStage: "Ensino Fundamental - Anos Iniciais",
    periodStart: 2,
    periodEnd: 3,
    monthDays: [0, 20, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    status: "Em elaboração",
    notes: "Teste local",
    items: [{ id: "annual-test-item", name: "Arroz demonstrativo", source: "Agricultura Familiar", category: "Gêneros", catalogKey: "catalog-arroz", basis: "Por oferta", consumptionUnit: "g", supplyUnit: "KG", perCapita: 50, monthlyOffers: [0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
    ...overrides,
  };
}

describe("nutrição local compatível com o fluxo observado", () => {
  it("calcula segundas-feiras, disponibilidade contratual e saldo após a projeção", () => {
    const database = createLocalSemedDatabase();
    expect(nutritionMondays("2026-08")).toEqual(["2026-08-03", "2026-08-10", "2026-08-17", "2026-08-24", "2026-08-31"]);
    const current = database.semedNutritionWeeklyPlans[0];
    const initial = weeklyNutritionProductAnalysis(database, current).find((row) => row.product.id === "nutrition-product-arroz")!;
    expect(initial).toMatchObject({ available: 920, projected: 120, remaining: 800, level: "good" });
    const second = saveLocalNutritionWeeklyPlan(database, weeklyInput({ referenceMonth: "2026-09", items: [{ productId: "nutrition-product-arroz", weeklyQuantities: [100, 50, 0, 0] }, { productId: "nutrition-product-feijao", weeklyQuantities: [0, 0, 0, 0] }] }), "u-admin").plan!;
    const reduced = weeklyNutritionProductAnalysis(database, current).find((row) => row.product.id === "nutrition-product-arroz")!;
    expect(reduced.otherPlanned).toBe(150);
    expect(reduced.available).toBe(770);
    expect(archiveLocalNutritionWeeklyPlan(database, second.id, "u-admin")).toBe(true);
    expect(weeklyNutritionProductAnalysis(database, current).find((row) => row.product.id === "nutrition-product-arroz")!.available).toBe(920);
  });

  it("salva o planejamento anual com fotografia de matrículas e calcula cobertura por catálogo", () => {
    const database = createLocalSemedDatabase();
    const result = saveLocalNutritionAnnualPlan(database, annualInput(), "u-admin");
    expect(result.error).toBeNull();
    expect(result.plan?.enrollmentSnapshot.totalStudents).toBe(320);
    const analysis = annualNutritionPlanResults(database, result.plan!)[0];
    expect(analysis).toMatchObject({ totalNeed: 256, coverage: 920, toAcquire: 0, supplyUnit: "KG" });
    expect(analysis.monthlyNeeds.slice(0, 4)).toEqual([0, 128, 128, 0]);
  });

  it("limita as ofertas mensais pelos dias letivos e recalcula a necessidade anual", () => {
    const database = createLocalSemedDatabase();
    const result = saveLocalNutritionAnnualPlan(database, annualInput({ monthDays: [0, 3, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0] }), "u-admin");
    const analysis = annualNutritionPlanResults(database, result.plan!)[0];
    expect(analysis.monthlyEffectiveOffers.slice(0, 4)).toEqual([0, 3, 8, 0]);
    expect(analysis.monthlyNeeds.slice(0, 4)).toEqual([0, 48, 128, 0]);
    expect(analysis.totalNeed).toBe(176);
  });

  it("preserva as coleções de Nutrição ao serializar e reidratar a base local", () => {
    const database = createLocalSemedDatabase();
    const saved = saveLocalNutritionAnnualPlan(database, annualInput(), "u-admin").plan!;
    const restored = hydrateLocalDatabase(serializeLocalDatabase(database))!;
    expect(restored.semedNutritionWeeklyPlans).toHaveLength(database.semedNutritionWeeklyPlans.length);
    expect(restored.semedNutritionAnnualPlans.some((plan) => plan.id === saved.id)).toBe(true);
    expect(restored.semedNutritionCatalog).toHaveLength(database.semedNutritionCatalog.length);
  });

  it("aplica escrita de Nutrição somente a usuários com permissão do submódulo", () => {
    const database = createLocalSemedDatabase();
    expect(saveLocalNutritionWeeklyPlan(database, weeklyInput(), "u-tecnico1").error).toContain("sem permissão");
    const technician = createLocalUser(database, { displayName: "Técnica de Nutrição", registration: "30000000-1", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "rh-nutrition", moduleKeys: ["inicio", "nutricao", "nutricao.planejamento_semanal", "nutricao.planejamento_anual"] }, "u-admin").user!;
    expect(canWriteLocalModule(database, technician, "nutricao.planejamento_semanal")).toBe(true);
    expect(saveLocalNutritionWeeklyPlan(database, weeklyInput({ referenceMonth: "2026-09" }), technician.id).error).toBeNull();
    expect(saveLocalNutritionAnnualPlan(database, annualInput(), technician.id).error).toBeNull();
  });

  it("renderiza os dois submódulos e abre o editor semanal sem placeholder", () => {
    const database = createLocalSemedDatabase();
    const admin = { ...database.semedUsers[0], mustChangePassword: false };
    const props = {
      schools: database.semedNutritionSchools, contracts: database.semedNutritionContracts, weeklyPlans: database.semedNutritionWeeklyPlans,
      stages: database.semedNutritionStages, catalog: database.semedNutritionCatalog, annualPlans: database.semedNutritionAnnualPlans,
      canWriteWeekly: true, canWriteAnnual: true,
      getWeeklyAnalysis: (plan: Parameters<typeof weeklyNutritionProductAnalysis>[1]) => weeklyNutritionProductAnalysis(database, plan),
      getAnnualResults: (plan: Parameters<typeof annualNutritionPlanResults>[1]) => annualNutritionPlanResults(database, plan),
      onSaveWeekly: vi.fn(), onArchiveWeekly: vi.fn(), onSaveAnnual: vi.fn(), onArchiveAnnual: vi.fn(), onNotify: vi.fn(),
    };
    render(<SemedNutritionPage initialView="weekly" {...props} />);
    expect(screen.getByRole("heading", { name: "Nutrição" })).toBeTruthy();
    expect(screen.queryByText("Módulo mapeado")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Nova projeção/i }));
    expect(screen.getByRole("heading", { name: "Nova projeção" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Planejamento anual da alimentação" }));
    expect(screen.getByRole("heading", { name: "Planejamento anual da alimentação escolar" })).toBeTruthy();
  });
});

import { describe, expect, it } from "vitest";
import { createLocalSemedDatabase, createLocalUser, receiveLocalAfGuide, saveLocalAfBilling, saveLocalAfContract, saveLocalAfContractProduct, saveLocalAfEntity, saveLocalAfGuide, saveLocalAfGuideItem, saveLocalAfSupplyPlan } from "../client/src/pages/sigaLocalStore";

describe("Agricultura Familiar local", () => {
  it("mantém entidades, contratação, planejamento, guia, recebimento e faturamento vinculados", () => {
    const database = createLocalSemedDatabase();
    const entity = saveLocalAfEntity(database, { entityType: "Associação", name: "Associação Demonstrativa", document: "AF-LOCAL-001", representative: "Responsável local", phone: "", email: "", address: "", status: "Ativa" }, "u-admin").entity!;
    const contract = saveLocalAfContract(database, { entityId: entity.id, number: "AF-2026-001", processNumber: "PROC-LOCAL-001", startDate: "2026-01-01", endDate: "2026-12-31", status: "Ativo", notes: "" }, "u-admin").contract!;
    const product = saveLocalAfContractProduct(database, { contractId: contract.id, name: "Produto demonstrativo", unit: "KG", contractedQuantity: 100, unitPrice: 8.5 }, "u-admin").product!;
    const school = database.semedSchoolUnits[0]!;
    const plan = saveLocalAfSupplyPlan(database, { contractId: contract.id, schoolInep: school.inep || school.code, schoolName: school.name, referenceMonth: "2026-08", educationModality: "Fundamental", weekDates: ["2026-08-04"], items: [{ productId: product.id, productName: product.name, unit: "KG", unitPrice: 8.5, quantityPlanned: 20 }], status: "Confirmado", notes: "" }, "u-admin").plan;
    expect(plan?.schoolName).toBe(school.name);
    const guide = saveLocalAfGuide(database, { guideNumber: "", contractId: contract.id, schoolInep: school.inep || school.code, schoolName: school.name, deliveryDate: "2026-08-04", deliveryMonth: "2026-08", educationModality: "Fundamental", weekDates: ["2026-08-04"], weeklyReceipts: [], carrier: "Transportador local", notes: "", status: "Em elaboração", receivedByName: "", receivedByRole: "", receivedByDocument: "", receivedDate: "", confirmationNotes: "" }, "u-admin").guide!;
    const item = saveLocalAfGuideItem(database, { guideId: guide.id, productId: product.id, productName: product.name, unit: "KG", unitPrice: 8.5, quantityPlanned: 20, quantityReceived: 0, weeklyQuantities: [], weeklyReceived: [] }, "u-admin").item;
    expect(item?.productId).toBe(product.id);
    expect(saveLocalAfBilling(database, { guideId: guide.id, contractId: contract.id, educationModality: "Fundamental", totalAmount: 170, status: "Emitido" }, "u-admin").error).toContain("guia recebida");
    const received = receiveLocalAfGuide(database, guide.id, "Equipe demonstrativa", "u-admin").guide;
    expect(received?.status).toBe("Recebida");
    expect(saveLocalAfBilling(database, { guideId: guide.id, contractId: contract.id, educationModality: "Fundamental", totalAmount: 170, status: "Emitido" }, "u-admin").billing).toMatchObject({ billingNumber: "FAT-AF-2026-001", totalAmount: 170 });
  });

  it("bloqueia alterações de Agricultura Familiar para usuário sem a permissão do submódulo", () => {
    const database = createLocalSemedDatabase();
    const user = createLocalUser(database, { displayName: "Usuário restrito", registration: "40000096-6", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["estoque.industrializado"] }, "u-admin").user!;
    expect(saveLocalAfEntity(database, { entityType: "Associação", name: "Entidade restrita", document: "AF-RESTRITA", representative: "", phone: "", email: "", address: "", status: "Ativa" }, user.id).error).toContain("sem permissão");
  });
});

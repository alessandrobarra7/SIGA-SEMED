import { describe, expect, it } from "vitest";
import { createLocalSemedDatabase, createLocalUser, saveLocalMasterRecord, type SemedMasterRecordInput } from "../client/src/pages/sigaLocalStore";

function masterInput(overrides: Partial<SemedMasterRecordInput> = {}): SemedMasterRecordInput {
  return { recordType: "Departamento", code: "DEP-DEMO-001", name: "Departamento Demonstrativo", document: "", email: "cadastro@demonstrativo.gov.br", phone: "(98) 00000-0000", department: "Gestão", position: "Referência", address: "Endereço demonstrativo", notes: "Registro demonstrativo", status: "Ativo", ...overrides };
}

describe("Cadastros Gerais locais", () => {
  it("grava e edita registro institucional com campos completos e código único", () => {
    const database = createLocalSemedDatabase();
    const created = saveLocalMasterRecord(database, masterInput(), "u-admin");
    expect(created.error).toBeNull();
    expect(created.record).toMatchObject({ code: "DEP-DEMO-001", recordType: "Departamento", email: "cadastro@demonstrativo.gov.br", position: "Referência" });
    expect(saveLocalMasterRecord(database, masterInput({ name: "Duplicado" }), "u-admin").error).toContain("Já existe");
    const updated = saveLocalMasterRecord(database, masterInput({ id: created.record?.id, phone: "(98) 99999-0000", status: "Inativo" }), "u-admin");
    expect(updated.record).toMatchObject({ phone: "(98) 99999-0000", status: "Inativo" });
  });

  it("bloqueia gravação para perfil sem permissão de cadastros gerais", () => {
    const database = createLocalSemedDatabase();
    const technical = createLocalUser(database, { displayName: "Técnico sem cadastro", registration: "30000097-7", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["inicio"] }, "u-admin").user!;
    expect(saveLocalMasterRecord(database, masterInput(), technical.id).error).toContain("sem permissão");
  });
});

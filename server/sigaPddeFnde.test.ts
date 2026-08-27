import { describe, expect, it } from "vitest";
import { createLocalSemedDatabase, createLocalUser, saveLocalSchoolExecutingUnit, saveLocalSchoolFndeAccount, saveLocalSchoolFndeAccountability } from "../client/src/pages/sigaLocalStore";

describe("PDDE/FNDE local", () => {
  it("vincula unidade executora, conta e prestação de contas à unidade escolar", () => {
    const database = createLocalSemedDatabase();
    const school = database.semedSchoolUnits[0]!;
    const schoolInep = school.inep || school.code;
    const executingUnit = saveLocalSchoolExecutingUnit(database, { schoolInep, cnpj: "12000123000199", mandateStart: "2026-01-01", mandateEnd: "2027-12-31", presidentName: "Presidência demonstrativa", presidentCpf: "", treasurerName: "Tesouraria demonstrativa", treasurerCpf: "", deliberativeCouncil: "Conselho demonstrativo", fiscalCouncil: "Conselho fiscal demonstrativo", statuteDate: "2025-12-01", electionMinutesDate: "2025-12-10", notes: "", costPercentageBp: 8000, capitalPercentageBp: 2000 }, "u-admin").executingUnit;
    expect(executingUnit?.schoolInep).toBe(schoolInep);
    const account = saveLocalSchoolFndeAccount(database, { schoolInep, referenceYear: 2026, programGroup: "PDDE Básico", subprogram: "Ação demonstrativa", reprogrammedOpeningCents: 10000, installment1Cents: 25000, installment1Date: "2026-04-01", installment2Cents: 15000, installment2Date: "2026-08-01", status: "Aberta", notes: "", sourceAccountId: "CONTA-LOCAL-01", globalAmountCents: 0 }, "u-admin").account;
    expect(account).toMatchObject({ globalAmountCents: 50000, status: "Aberta" });
    const entry = saveLocalSchoolFndeAccountability(database, { accountId: account!.id, accountabilityDate: "2026-08-20", description: "Material demonstrativo", documentNumber: "NF-LOCAL-01", amountCents: 20000, notes: "", expenseNature: "Custeio", quantity: 2, expenseDocumentId: "", unitAmountCents: 0 }, "u-admin").accountability;
    expect(entry).toMatchObject({ itemSequence: 1, unitAmountCents: 10000 });
    expect(database.semedSchoolFndeAccounts[0]?.status).toBe("Em prestação de contas");
  });

  it("exige unidade executora e bloqueia o submódulo para usuário não autorizado", () => {
    const database = createLocalSemedDatabase();
    const school = database.semedSchoolUnits[0]!;
    const schoolInep = school.inep || school.code;
    expect(saveLocalSchoolFndeAccount(database, { schoolInep, referenceYear: 2026, programGroup: "PDDE Básico", subprogram: "", reprogrammedOpeningCents: 0, installment1Cents: 0, installment1Date: "", installment2Cents: 0, installment2Date: "", status: "Aberta", notes: "", sourceAccountId: "", globalAmountCents: 0 }, "u-admin").error).toContain("unidade executora");
    const restricted = createLocalUser(database, { displayName: "Técnico restrito", registration: "40000101-4", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["unidades_escolares"] }, "u-admin").user!;
    expect(saveLocalSchoolExecutingUnit(database, { schoolInep, cnpj: "12000123000199", mandateStart: "2026-01-01", mandateEnd: "2027-12-31", presidentName: "Presidência", presidentCpf: "", treasurerName: "Tesouraria", treasurerCpf: "", deliberativeCouncil: "", fiscalCouncil: "", statuteDate: "", electionMinutesDate: "", notes: "", costPercentageBp: 8000, capitalPercentageBp: 2000 }, restricted.id).error).toContain("sem permissão");
  });
});

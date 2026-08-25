import { describe, expect, it } from "vitest";
import {
  SEMED_MODULE_KEYS,
  SEMED_USER_PROFILES,
  buildLocalUserPermissions,
  canAccessLocalSchoolUnit,
  canManageLocalUsers,
  canReadLocalModule,
  canWriteLocalModule,
  createLocalSemedDatabase,
  defaultModuleKeysForProfile,
  hydrateLocalDatabase,
  loginLocalUser,
  recordLocalUserAudit,
  replaceLocalUserPermissions,
  type SemedLocalUser,
} from "../client/src/pages/sigaLocalStore";

function profileUser(profile: SemedLocalUser["profile"], overrides: Partial<SemedLocalUser> = {}): SemedLocalUser {
  const base = createLocalSemedDatabase().semedUsers[0];
  return {
    ...base,
    id: `profile-${profile}`,
    username: profile.toLowerCase().replace(/\s/g, "-"),
    displayName: profile,
    role: profile,
    profile,
    active: true,
    ...overrides,
  };
}

describe("perfis e permissões locais do SIGA SEMED", () => {
  it("mantém a lista fechada dos seis perfis", () => {
    expect(SEMED_USER_PROFILES).toEqual([
      "Administrador",
      "Técnico",
      "Gestor Escolar",
      "Secretário Escolar",
      "Auditoria Externa",
      "Contadora Municipal",
    ]);
  });

  it("atribui permissões automáticas por perfil e deixa o Técnico configurável", () => {
    expect(defaultModuleKeysForProfile("Administrador")).toEqual(SEMED_MODULE_KEYS);
    expect(defaultModuleKeysForProfile("Técnico")).toEqual([]);
    expect(defaultModuleKeysForProfile("Técnico", ["inicio", "contratos"])).toEqual(["inicio", "contratos"]);
    expect(defaultModuleKeysForProfile("Gestor Escolar")).toEqual(["inicio", "unidades_escolares", "unidades.mapa", "unidades.uex", "unidades.turmas"]);
    expect(defaultModuleKeysForProfile("Secretário Escolar")).toEqual(defaultModuleKeysForProfile("Gestor Escolar"));
    expect(defaultModuleKeysForProfile("Auditoria Externa")).not.toContain("usuarios");
    expect(defaultModuleKeysForProfile("Contadora Municipal")).not.toContain("usuarios");
  });

  it("aplica leitura, escrita e administração conforme o perfil", () => {
    const database = createLocalSemedDatabase();
    const administrator = database.semedUsers.find((user) => user.id === "u-admin")!;
    const technician = database.semedUsers.find((user) => user.id === "u-tecnico1")!;
    const auditor = profileUser("Auditoria Externa");
    const accountant = profileUser("Contadora Municipal");

    expect(canManageLocalUsers(administrator)).toBe(true);
    expect(canReadLocalModule(database, administrator, "usuarios")).toBe(true);
    expect(canWriteLocalModule(database, administrator, "usuarios")).toBe(true);
    expect(canReadLocalModule(database, technician, "contratos")).toBe(true);
    expect(canWriteLocalModule(database, technician, "contratos")).toBe(true);
    expect(canReadLocalModule(database, technician, "financeiro")).toBe(false);
    expect(canReadLocalModule(database, auditor, "contratos")).toBe(true);
    expect(canWriteLocalModule(database, auditor, "contratos")).toBe(false);
    expect(canReadLocalModule(database, auditor, "usuarios")).toBe(false);
    expect(canWriteLocalModule(database, accountant, "financeiro")).toBe(true);
    expect(canWriteLocalModule(database, accountant, "documentos")).toBe(false);
  });

  it("restringe Gestor e Secretário à unidade escolar vinculada", () => {
    const manager = profileUser("Gestor Escolar", { schoolUnitId: "school-01" });
    const secretary = profileUser("Secretário Escolar", { schoolUnitId: "school-02" });
    expect(canAccessLocalSchoolUnit(manager, "school-01")).toBe(true);
    expect(canAccessLocalSchoolUnit(manager, "school-02")).toBe(false);
    expect(canAccessLocalSchoolUnit(secretary, "school-02")).toBe(true);
    expect(canAccessLocalSchoolUnit(secretary, "school-01")).toBe(false);
  });

  it("registra alterações de permissões sem senha, CPF completo ou duplicidade", () => {
    const database = createLocalSemedDatabase();
    const permissions = replaceLocalUserPermissions(database, "u-tecnico1", "Técnico", "u-admin", ["inicio", "rh", "rh.holerite", "rh.holerite"], "2026-08-25T21:00:00.000Z");
    expect(permissions.map((permission) => permission.moduleKey)).toEqual(["inicio", "rh", "rh.holerite"]);
    expect(database.semedUserAuditLog[0]).toMatchObject({ userId: "u-tecnico1", action: "usuario.permissoes", actorUserId: "u-admin" });

    const audit = recordLocalUserAudit(database, {
      userId: "u-tecnico1",
      action: "usuario.editado",
      changedFields: ["displayName", "passwordHash", "cpf", "displayName"],
      summary: "CPF 12345678901 atualizado sem registrar senha.",
      actorUserId: "u-admin",
    }, "2026-08-25T21:01:00.000Z");
    expect(audit.changedFields).toEqual(["displayName"]);
    expect(audit.summary).not.toContain("12345678901");
    expect(audit.summary).toContain("CPF PROTEGIDO");
  });

  it("migra o esquema v1 sem perder registros, documentos, pagamentos, sessões ou primeiro acesso", () => {
    const current = createLocalSemedDatabase();
    current.semedUsers[1].mustChangePassword = false;
    const legacy = structuredClone(current) as Record<string, unknown> & { semedUsers: Array<Record<string, unknown>> };
    legacy.schemaVersion = 1;
    delete legacy.semedUserPermissions;
    delete legacy.semedUserAuditLog;
    legacy.semedUsers.forEach((user) => {
      delete user.profile;
      delete user.loginType;
      delete user.cpf;
      delete user.schoolUnitId;
      delete user.serverRegistrationId;
      delete user.provisionalPasswordIssuedAt;
      delete user.lastActivityAt;
    });

    const migrated = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.semedRecords).toHaveLength(current.semedRecords.length);
    expect(migrated.semedDocuments).toHaveLength(current.semedDocuments.length);
    expect(migrated.semedRecordPayments).toHaveLength(current.semedRecordPayments.length);
    expect(migrated.semedSessions).toEqual(current.semedSessions);
    expect(migrated.semedUsers.find((user) => user.id === "u-tecnico1")?.mustChangePassword).toBe(false);
    expect(migrated.semedUserPermissions.some((permission) => permission.userId === "u-admin" && permission.moduleKey === "usuarios")).toBe(true);
    expect(migrated.semedUserPermissions.some((permission) => permission.userId === "u-tecnico1" && permission.moduleKey === "contratos")).toBe(true);
  });

  it("aceita CPF normalizado para perfis externos e bloqueia usuário inativo", () => {
    const database = createLocalSemedDatabase();
    const external = profileUser("Auditoria Externa", { id: "u-auditoria", username: "", loginType: "cpf", cpf: "12345678901", active: true });
    database.semedUsers.push(external);
    database.semedUserPermissions.push(...buildLocalUserPermissions(external.id, external.profile, "u-admin", "2026-08-25T21:00:00.000Z"));

    expect(loginLocalUser(database, "123.456.789-01")?.user.id).toBe("u-auditoria");
    external.active = false;
    expect(loginLocalUser(database, "12345678901")).toBeNull();
  });
});

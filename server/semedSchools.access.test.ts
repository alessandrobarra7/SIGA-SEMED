import { describe, expect, it } from "vitest";
import { canManageSchoolClasses, canManageSchools } from "./routers/semedSchools";

describe("permissões persistentes de Unidades e Turmas", () => {
  it("replica a política local de escrita por perfil e módulo", () => {
    expect(canManageSchools({ profile: "Administrador", permissions: [] })).toBe(true);
    expect(canManageSchools({ profile: "Técnico", permissions: ["unidades_escolares"] })).toBe(true);
    expect(canManageSchools({ profile: "Técnico", permissions: ["unidades.turmas"] })).toBe(false);
    expect(canManageSchoolClasses({ profile: "Técnico", permissions: ["unidades.turmas"] })).toBe(true);
    expect(canManageSchools({ profile: "Técnico", permissions: [] })).toBe(false);
    expect(canManageSchools({ profile: "Gestor Escolar", permissions: ["unidades_escolares"] })).toBe(false);
    expect(canManageSchools({ profile: "Secretário Escolar", permissions: ["unidades_escolares"] })).toBe(false);
    expect(canManageSchools({ profile: "Auditoria Externa", permissions: ["unidades_escolares"] })).toBe(false);
    expect(canManageSchools({ profile: "Contadora Municipal", permissions: ["unidades_escolares"] })).toBe(false);
  });
});

// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedUsersPage from "../client/src/pages/SemedUsersPage";
import {
  completeLocalFirstAccess,
  createLocalSemedDatabase,
  createLocalUser,
  defaultModuleKeysForProfile,
  issueLocalProvisionalPassword,
  loginLocalUser,
  setLocalUserActive,
  terminateLocalUserSessions,
  updateLocalUser,
  type SemedLocalUserInput,
} from "../client/src/pages/sigaLocalStore";

const technicianInput: SemedLocalUserInput = {
  displayName: "Técnico Local de Teste",
  registration: "12345678-9",
  cpf: "",
  profile: "Técnico",
  active: true,
  schoolUnitId: "",
  serverRegistrationId: "rh-local-01",
  moduleKeys: ["inicio", "contratos", "documentos"],
};

afterEach(() => cleanup());

describe("administração funcional de usuários", () => {
  it("cadastra por matrícula, emite senha provisória uma única vez e autentica com a credencial local", () => {
    const database = createLocalSemedDatabase();
    const result = createLocalUser(database, technicianInput, "u-admin", "2026-08-25T21:30:00.000Z");
    expect(result.error).toBeNull();
    expect(result.user).toMatchObject({ registration: "12345678-9", username: "12345678-9", profile: "Técnico", mustChangePassword: true });
    expect(result.provisionalPassword).toMatch(/^Siga-[a-f0-9]{10}!$/);
    expect(loginLocalUser(database, "12345678-9", "2026-08-25T21:31:00.000Z", "senha-incorreta")).toBeNull();
    expect(loginLocalUser(database, "12345678-9", "2026-08-25T21:31:00.000Z", result.provisionalPassword)?.user.id).toBe(result.user?.id);
    expect(database.semedUserAuditLog[0].summary).not.toContain(result.provisionalPassword!);
  });

  it("mantém matrícula e CPF no mesmo cadastro e autentica o perfil interno pelos dois identificadores", () => {
    const database = createLocalSemedDatabase();
    const result = createLocalUser(database, { ...technicianInput, cpf: "123.456.789-01" }, "u-admin");
    expect(result.error).toBeNull();
    expect(result.user).toMatchObject({ registration: "12345678-9", cpf: "12345678901", loginType: "matricula" });
    expect(loginLocalUser(database, "12345678-9", undefined, result.provisionalPassword)?.user.id).toBe(result.user?.id);
    expect(loginLocalUser(database, "123.456.789-01", undefined, result.provisionalPassword)?.user.id).toBe(result.user?.id);
  });

  it("conclui primeiro acesso com nova senha e invalida a provisória", () => {
    const database = createLocalSemedDatabase();
    const created = createLocalUser(database, technicianInput, "u-admin")!;
    completeLocalFirstAccess(database, created.user!.id, "2026-08-25T21:32:00.000Z", "NovaSenhaLocal123");
    expect(loginLocalUser(database, technicianInput.registration, "2026-08-25T21:33:00.000Z", created.provisionalPassword)).toBeNull();
    expect(loginLocalUser(database, technicianInput.registration, "2026-08-25T21:33:00.000Z", "NovaSenhaLocal123")?.user.mustChangePassword).toBe(false);
  });

  it("bloqueia matrícula duplicada, exige unidade escolar e impede Técnico de administrar acessos", () => {
    const database = createLocalSemedDatabase();
    expect(createLocalUser(database, technicianInput, "u-admin").error).toBeNull();
    expect(createLocalUser(database, { ...technicianInput, displayName: "Duplicado" }, "u-admin").error).toContain("matrícula");
    expect(createLocalUser(database, { ...technicianInput, registration: "22222222-2", profile: "Gestor Escolar", schoolUnitId: "" }, "u-admin").error).toContain("unidade escolar");
    expect(createLocalUser(database, { ...technicianInput, registration: "33333333-3" }, "u-tecnico1").error).toContain("sem permissão");
  });

  it("cadastra perfil externo por CPF e aplica permissões automáticas ignorando seleção manual", () => {
    const database = createLocalSemedDatabase();
    const result = createLocalUser(database, { ...technicianInput, registration: "", cpf: "123.456.789-01", profile: "Auditoria Externa", moduleKeys: ["usuarios"] }, "u-admin");
    expect(result.error).toBeNull();
    expect(result.user).toMatchObject({ loginType: "cpf", cpf: "12345678901", registration: "" });
    expect(loginLocalUser(database, "123.456.789-01", undefined, result.provisionalPassword)?.user.id).toBe(result.user?.id);
    const granted = database.semedUserPermissions.filter((permission) => permission.userId === result.user?.id).map((permission) => permission.moduleKey);
    expect(granted).toEqual(defaultModuleKeysForProfile("Auditoria Externa"));
    expect(granted).not.toContain("usuarios");
  });

  it("edita perfil, aplica permissões, desativa usuário e encerra sessões", () => {
    const database = createLocalSemedDatabase();
    const created = createLocalUser(database, technicianInput, "u-admin")!;
    loginLocalUser(database, technicianInput.registration, "2026-08-25T21:31:00.000Z", created.provisionalPassword);
    const updated = updateLocalUser(database, created.user!.id, { ...technicianInput, displayName: "Técnico Atualizado", moduleKeys: ["inicio", "rh", "rh.holerite"] }, "u-admin");
    expect(updated.user?.displayName).toBe("Técnico Atualizado");
    expect(database.semedUserPermissions.filter((permission) => permission.userId === created.user!.id).map((permission) => permission.moduleKey)).toEqual(["inicio", "rh", "rh.holerite"]);
    expect(setLocalUserActive(database, created.user!.id, false, "u-admin")).toBe(true);
    expect(database.semedSessions.some((session) => session.userId === created.user!.id)).toBe(false);
    expect(loginLocalUser(database, technicianInput.registration, undefined, created.provisionalPassword)).toBeNull();
  });

  it("gera nova senha, encerra sessões e protege o próprio Administrador contra desativação", () => {
    const database = createLocalSemedDatabase();
    const created = createLocalUser(database, technicianInput, "u-admin")!;
    loginLocalUser(database, technicianInput.registration, undefined, created.provisionalPassword);
    expect(terminateLocalUserSessions(database, created.user!.id, "u-admin")).toBe(1);
    const reset = issueLocalProvisionalPassword(database, created.user!.id, "u-admin");
    expect(reset.provisionalPassword).toMatch(/^Siga-/);
    expect(database.semedUserAuditLog.some((entry) => entry.action === "usuario.senha_provisoria" && !entry.summary.includes(reset.provisionalPassword!))).toBe(true);
    expect(setLocalUserActive(database, "u-admin", false, "u-admin")).toBe(false);
  });

  it("renderiza a página completa, sem o placeholder anterior, e abre o cadastro com matrícula e CPF", () => {
    const database = createLocalSemedDatabase();
    const admin = { ...database.semedUsers[0], mustChangePassword: false };
    render(<SemedUsersPage
      currentUser={admin}
      users={database.semedUsers}
      permissions={database.semedUserPermissions}
      auditLog={database.semedUserAuditLog}
      onCreate={vi.fn()}
      onUpdate={vi.fn()}
      onSetActive={vi.fn()}
      onIssuePassword={vi.fn()}
      onTerminateSessions={vi.fn()}
      onNotify={vi.fn()}
    />);
    expect(screen.getByRole("heading", { name: "Usuários" })).toBeTruthy();
    expect(screen.queryByText("Módulo mapeado")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Novo usuário/i }));
    expect(screen.getByRole("heading", { name: "Cadastrar usuário" })).toBeTruthy();
    expect(screen.getByText("Matrícula para acesso")).toBeTruthy();
    expect(screen.getByText("CPF para acesso")).toBeTruthy();
    expect(screen.getByText("Permissões de módulos")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Perfil"), { target: { value: "Auditoria Externa" } });
    expect((screen.getByLabelText("Matrícula para acesso") as HTMLInputElement).required).toBe(false);
    expect((screen.getByLabelText("CPF para acesso") as HTMLInputElement).required).toBe(true);
    expect(screen.getByText(/Edição manual bloqueada/)).toBeTruthy();
  });

  it("filtra usuários por tipo de login e por permissão concedida", () => {
    const database = createLocalSemedDatabase();
    createLocalUser(database, { ...technicianInput, displayName: "Auditora Externa Local", registration: "", cpf: "98765432100", profile: "Auditoria Externa", moduleKeys: [] }, "u-admin");
    const admin = { ...database.semedUsers[0], mustChangePassword: false };
    render(<SemedUsersPage currentUser={admin} users={database.semedUsers} permissions={database.semedUserPermissions} auditLog={database.semedUserAuditLog} onCreate={vi.fn()} onUpdate={vi.fn()} onSetActive={vi.fn()} onIssuePassword={vi.fn()} onTerminateSessions={vi.fn()} onNotify={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Filtrar por tipo de login"), { target: { value: "cpf" } });
    expect(screen.getByText("Auditora Externa Local")).toBeTruthy();
    expect(screen.queryByText("Técnico SEMED 1")).toBeNull();
    fireEvent.change(screen.getByLabelText("Filtrar por tipo de login"), { target: { value: "Todos" } });
    fireEvent.change(screen.getByLabelText("Filtrar por permissão"), { target: { value: "usuarios" } });
    expect(screen.getByText("Administrador")).toBeTruthy();
    expect(screen.queryByText("Auditora Externa Local")).toBeNull();
  });

  it("oculta as operações administrativas quando o perfil não é Administrador", () => {
    const database = createLocalSemedDatabase();
    const technician = { ...database.semedUsers[1], mustChangePassword: false };
    render(<SemedUsersPage
      currentUser={technician}
      users={database.semedUsers}
      permissions={database.semedUserPermissions}
      auditLog={database.semedUserAuditLog}
      onCreate={vi.fn()}
      onUpdate={vi.fn()}
      onSetActive={vi.fn()}
      onIssuePassword={vi.fn()}
      onTerminateSessions={vi.fn()}
      onNotify={vi.fn()}
    />);
    expect(screen.getByText("Administração restrita")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Novo usuário/i })).toBeNull();
  });
});

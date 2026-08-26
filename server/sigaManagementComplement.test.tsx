// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GovernancePage } from "../client/src/pages/SemedManagementPages";
import { createLocalSemedDatabase, hydrateLocalDatabase, saveLocalManagementApproval, saveLocalManagementAttachment, saveLocalManagementTask } from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

describe("Gestão complementar local", () => {
  it("migra a base v8 para v9 preservando contratos e adicionando os coletores de Gestão", () => {
    const current = createLocalSemedDatabase();
    const legacy = { ...current, schemaVersion: 8 } as Record<string, unknown>;
    delete legacy.semedManagementTasks;
    delete legacy.semedManagementAttachments;
    delete legacy.semedManagementApprovals;
    const restored = hydrateLocalDatabase(JSON.stringify(legacy))!;
    expect(restored.schemaVersion).toBe(9);
    expect(restored.semedRecords).toHaveLength(current.semedRecords.length);
    expect(restored.semedManagementTasks.length).toBeGreaterThan(0);
    expect(restored.semedManagementApprovals.length).toBeGreaterThan(0);
  });

  it("persiste tarefas e anexos com auditoria e segrega a decisão de aprovação", () => {
    const database = createLocalSemedDatabase();
    const task = saveLocalManagementTask(database, { title: "Consolidar acompanhamento local", area: "Gestão", dueDate: "2026-09-03", priority: "Média", status: "Programada", assigneeUserId: "u-tecnico1", summary: "Rotina demonstrativa de gestão.", recordId: "r12", documentId: "" }, "u-admin");
    expect(task.error).toBeNull();
    const complete = saveLocalManagementTask(database, { ...task.task!, status: "Concluída" }, "u-admin");
    expect(complete.task?.status).toBe("Concluída");
    const attachment = saveLocalManagementAttachment(database, { name: "Memória de acompanhamento", area: "Gestão", context: "Rotina", type: "Registro local", summary: "Metadado demonstrativo.", recordId: "", documentId: "d041" }, "u-admin");
    expect(attachment.error).toBeNull();
    database.semedUserPermissions.push({ id: "permission-u-tecnico1-gestao", userId: "u-tecnico1", moduleKey: "gestao", granted: true, grantedBy: "u-admin", grantedAt: "2026-08-26T12:00:00.000Z" });
    const requested = saveLocalManagementApproval(database, { title: "Solicitação técnica local", area: "Gestão", summary: "Solicitação demonstrativa para validação.", recordId: "", documentId: "d041", status: "Pendente", returnReason: "" }, "u-tecnico1");
    expect(requested.error).toBeNull();
    const selfDecision = saveLocalManagementApproval(database, { ...requested.approval!, status: "Aprovada", returnReason: "" }, "u-tecnico1");
    expect(selfDecision.error).toContain("pessoa diferente");
    const approved = saveLocalManagementApproval(database, { ...requested.approval!, status: "Aprovada", returnReason: "" }, "u-admin");
    expect(approved.approval?.status).toBe("Aprovada");
    expect(database.semedGovernanceAuditLog.some((entry) => entry.entityType === "Tarefa de gestão" && entry.action === "executar")).toBe(true);
    expect(database.semedGovernanceAuditLog.some((entry) => entry.entityType === "Solicitação de aprovação" && entry.action === "aprovar")).toBe(true);
  });

  it("expõe criação de tarefa e decisão administrativa no painel", () => {
    const database = createLocalSemedDatabase();
    const onSaveTask = vi.fn(() => null);
    const onSaveApproval = vi.fn(() => null);
    render(<GovernancePage onNavigate={vi.fn()} users={database.semedUsers} tasks={database.semedManagementTasks} attachments={database.semedManagementAttachments} approvals={database.semedManagementApprovals} records={database.semedRecords as never} documents={database.semedDocuments} canApprove={true} onSaveTask={onSaveTask} onSaveAttachment={vi.fn(() => null)} onSaveApproval={onSaveApproval} />);
    fireEvent.click(screen.getByRole("button", { name: "Nova tarefa" }));
    fireEvent.change(screen.getByLabelText("Título"), { target: { value: "Nova tarefa demonstrativa" } });
    fireEvent.change(screen.getByLabelText("Prazo"), { target: { value: "2026-09-04" } });
    fireEvent.change(screen.getByLabelText("Resumo"), { target: { value: "Resumo demonstrativo." } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar tarefa" }));
    expect(onSaveTask).toHaveBeenCalledWith(expect.objectContaining({ title: "Nova tarefa demonstrativa", status: "Programada" }));
    fireEvent.click(screen.getByRole("tab", { name: "Aprovações" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Aprovar" })[0]);
    expect(onSaveApproval).toHaveBeenCalledWith(expect.objectContaining({ status: "Aprovada" }));
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import { GovernancePage, MastersPage } from "../client/src/pages/SemedManagementPages";

describe("páginas de Gestão e Cadastros", () => {
  it("mantém as áreas de gestão e os contextos de cadastro mapeados", () => {
    const governance = renderToStaticMarkup(<GovernancePage onNavigate={() => undefined} />);
    const reports = renderToStaticMarkup(<GovernancePage initialTab="reports" onNavigate={() => undefined} />);
    const attachments = renderToStaticMarkup(<GovernancePage initialTab="attachments" onNavigate={() => undefined} />);
    const approvals = renderToStaticMarkup(<GovernancePage initialTab="approvals" onNavigate={() => undefined} />);
    const masters = renderToStaticMarkup(<MastersPage />);

    expect(governance).toContain("Minhas tarefas");
    expect(governance).toContain("Alertas");
    expect(reports).toContain("Relatórios gerenciais");
    expect(attachments).toContain("Anexos administrativos");
    expect(approvals).toContain("Aprovações");
    expect(masters).toContain("Escolas");
    expect(masters).toContain("Núcleos");
    expect(masters).toContain("Prédios Administrativos");
    expect(masters).toContain("Biblioteca");
    expect(masters).toContain("Novo cadastro");
    expect(`${governance}${reports}${attachments}${approvals}${masters}`).not.toContain("próxima etapa");
  });
});

// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedHomeOperationsPage from "../client/src/pages/SemedHomeOperationsPage";
import { createLocalSemedDatabase } from "../client/src/pages/sigaLocalStore";

afterEach(() => cleanup());

describe("Painel local de Agenda, Mensagens e Notas", () => {
  it("renderiza ações e estados vazios próprios do Início", () => {
    const database = createLocalSemedDatabase();
    render(<SemedHomeOperationsPage user={{ ...database.semedUsers[0], mustChangePassword: false }} users={database.semedUsers} events={[]} messages={[]} messageReads={[]} canWrite onSaveEvent={vi.fn(() => ({ error: null }))} onSaveMessage={vi.fn(() => ({ error: null }))} onMarkMessageRead={vi.fn(() => true)} onNotify={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Agenda e compromissos" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Novo evento/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Mensagens" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Nova mensagem/i })).toBeTruthy();
    expect(screen.getByText("Nenhum evento cadastrado na agenda local.")).toBeTruthy();
    expect(screen.getByText("Nenhum comunicado local disponível.")).toBeTruthy();
  });
});

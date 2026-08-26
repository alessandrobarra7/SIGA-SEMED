// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SemedOperationalShell from "../client/src/pages/SemedOperationalShell";

afterEach(() => cleanup());

function renderShell(isViewAllowed?: (view: Parameters<typeof SemedOperationalShell>[0]["activeView"]) => boolean) {
  const onViewChange = vi.fn();
  render(<SemedOperationalShell user={{ displayName: "Administrador", role: "Administrador" }} activeView="home" onViewChange={onViewChange} onPassword={vi.fn()} onLogout={vi.fn()} isViewAllowed={isViewAllowed} logo="/logo-test.png" ><main>Conteúdo demonstrativo</main></SemedOperationalShell>);
  return onViewChange;
}

describe("Buscador global do shell", () => {
  it("filtra módulos e direciona para o resultado selecionado", () => {
    const onViewChange = renderShell();
    const search = screen.getByRole("searchbox", { name: "Buscar módulos e áreas do sistema" });
    fireEvent.change(search, { target: { value: "veículos" } });
    const result = screen.getByRole("option", { name: /cadastro de veículos/i });
    fireEvent.click(result);
    expect(onViewChange).toHaveBeenCalledWith("fleet");
    expect((search as HTMLInputElement).value).toBe("");
  });

  it("permite Enter no primeiro resultado e não mostra módulos sem leitura", () => {
    const onViewChange = renderShell((view) => view !== "finance");
    const search = screen.getByRole("searchbox", { name: "Buscar módulos e áreas do sistema" });
    fireEvent.change(search, { target: { value: "frota" } });
    fireEvent.keyDown(search, { key: "Enter" });
    expect(onViewChange).toHaveBeenCalledWith("fleet");
    fireEvent.change(search, { target: { value: "financeiro" } });
    expect(screen.queryByRole("option", { name: /financeiro/i })).toBeNull();
    expect(screen.getByText("Nenhum módulo ou contexto encontrado.")).toBeTruthy();
  });
});

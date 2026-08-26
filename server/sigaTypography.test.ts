import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const indexHtml = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");
const shellStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-identity-refresh.css"), "utf8");

describe("tipografia institucional do shell", () => {
  it("carrega famílias tipográficas para o ambiente e mantém a regra visual escopada ao shell", () => {
    expect(indexHtml).toContain("family=IBM+Plex+Sans");
    expect(indexHtml).toContain("family=IBM+Plex+Serif");
    expect(shellStyles).toContain(".siga-shell {");
    expect(shellStyles).toContain('font-family: var(--siga-font-body);');
    expect(shellStyles).toContain('font-family: var(--siga-font-display) !important;');
  });

  it("aplica caixa alta somente aos elementos institucionais de leitura rápida", () => {
    expect(shellStyles).toContain(".siga-nav-item");
    expect(shellStyles).toContain(".siga-nav-submenu button");
    expect(shellStyles).toContain("text-transform: uppercase;");
    expect(shellStyles).toContain("text-transform: none;");
    expect(shellStyles).toContain("/* Tipografia institucional do ambiente autenticado — o login permanece intocado. */");
  });

  it("declara uma escala editorial reutilizável para títulos, contexto, rótulos, metadados, estados e tabelas", () => {
    expect(shellStyles).toContain("--siga-text-page:");
    expect(shellStyles).toContain("--siga-text-section:");
    expect(shellStyles).toContain("--siga-text-label:");
    expect(shellStyles).toContain("--siga-text-meta:");
    expect(shellStyles).toContain("Sistema editorial: todos os módulos internos compartilham os mesmos níveis de leitura.");
    expect(shellStyles).toContain(".siga-finance-status");
    expect(shellStyles).toContain(".siga-fleet-status");
  });
});

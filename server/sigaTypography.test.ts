import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const indexHtml = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");
const indexStyles = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
const shellStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-identity-refresh.css"), "utf8");

describe("tipografia institucional do shell", () => {
  it("mantém Manrope e Source Serif 4 como tipografia institucional do ambiente", () => {
    expect(indexStyles).toContain("family=Manrope");
    expect(indexStyles).toContain("family=Source+Serif+4");
    expect(indexStyles).toContain("family=Fira+Sans");
    expect(indexHtml).not.toContain("IBM+Plex");
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

  it("mantém legendas internas discretas e sem marcadores decorativos", () => {
    expect(indexStyles).toContain("Legendas internas: fonte própria, leitura em frase e sem marcadores decorativos.");
    expect(indexStyles).toContain(".siga-shell .kicker--institutional");
    expect(indexStyles).toContain(".siga-shell .kicker--section");
    expect(indexStyles).toContain(".siga-shell .kicker--card");
    expect(indexStyles).toContain('content: none !important;');
    expect(indexStyles).not.toContain(".siga-shell .siga-kicker:not(.kicker)");
    expect(shellStyles).toContain('--siga-font-caption: "Manrope", sans-serif;');
  });
});

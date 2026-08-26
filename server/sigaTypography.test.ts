import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const indexHtml = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");
const indexStyles = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
const shellStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-identity-refresh.css"), "utf8");
const moduleStylePaths = [
  "siga-pages.css",
  "siga-nutrition.css",
  "siga-stock.css",
  "siga-hr.css",
  "siga-fleet.css",
  "siga-financial-alert.css",
  "siga-schools-educa.css",
  "siga-management-complement.css",
];
const moduleStyles = moduleStylePaths.map((fileName) =>
  readFileSync(resolve(projectRoot, "client/src/pages", fileName), "utf8"),
);

describe("tipografia institucional do shell", () => {
  it("mantém Montserrat e Inter como tipografia institucional do ambiente autenticado", () => {
    expect(indexHtml).toContain("family=Montserrat");
    expect(indexHtml).toContain("family=Inter");
    expect(indexStyles).toContain('--siga-font-display: "Montserrat"');
    expect(indexStyles).toContain('--siga-font-body: "Inter"');
    expect(indexStyles).toContain("--siga-font-impact:");
    expect(indexStyles).toContain("--siga-font-classic:");
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
    expect(indexStyles).toContain("--siga-font-caption: var(--siga-font-body);");
  });

  it("sobrepõe fontes legadas de todos os estilos internos com tokens funcionais", () => {
    expect(moduleStyles).toHaveLength(8);
    expect(moduleStyles.every((styles) => styles.length > 0)).toBe(true);
    expect(shellStyles).toContain("Tokens globais de tipografia");
    expect(shellStyles).toContain(".siga-shell .siga-module-surface :is(");
    expect(shellStyles).toContain("font-family: var(--siga-font-body) !important;");
    expect(shellStyles).toContain("font-family: var(--siga-font-display) !important;");
    expect(shellStyles).toContain("sem atingir o login congelado");
  });
});

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
    expect(indexStyles).toContain("--siga-font-caption: var(--siga-font-dashboard);");
    expect(shellStyles).toContain("--siga-text-label: .86rem;");
    expect(shellStyles).toContain("--siga-text-meta: .82rem;");
    expect(shellStyles).toContain("font-weight: 700 !important;");
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

  it("liga as regras efetivas de Gestão aos tokens globais no arquivo-base", () => {
    const pagesStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-pages.css"), "utf8");
    const complementStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-management-complement.css"), "utf8");

    const rule = (selector: string) => {
      const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = pagesStyles.match(new RegExp(`(?:^|\\n)\\s*${escapedSelector}\\s*\\{([^}]*)\\}`));
      expect(match, `Regra-base ausente: ${selector}`).not.toBeNull();
      return match![1];
    };

    const expectTokenRule = (selector: string, fontToken: string, sizeToken: string) => {
      const cssRule = rule(selector);
      expect(cssRule).toContain(`font-family: ${fontToken}`);
      expect(cssRule).toContain(`font-size: ${sizeToken}`);
      expect(cssRule).not.toMatch(/Source Serif 4|Manrope|font:\s|font-size:\s*[^;]*(?:px|rem)/);
    };

    expectTokenRule(".siga-page-heading h1", "var(--siga-font-display)", "var(--siga-text-page)");
    expectTokenRule(".siga-context-tabs button", "var(--siga-font-body)", "var(--siga-text-label)");
    expectTokenRule(".siga-task-row strong", "var(--siga-font-display)", "var(--siga-text-card)");
    expectTokenRule(".siga-task-row small", "var(--siga-font-body)", "var(--siga-text-meta)");
    expectTokenRule(".siga-task-row em", "var(--siga-font-body)", "var(--siga-text-meta)");
    expectTokenRule(".siga-governance-side-card h2", "var(--siga-font-display)", "var(--siga-text-section)");
    expectTokenRule(".siga-deadline-row strong", "var(--siga-font-display)", "var(--siga-text-card)");
    expectTokenRule(".siga-deadline-row small", "var(--siga-font-body)", "var(--siga-text-meta)");

    const mobileTaskTitle = rule(".siga-management-page .siga-task-row strong");
    expect(mobileTaskTitle).toContain("white-space: normal");
    expect(mobileTaskTitle).toContain("overflow: visible");

    expect(indexStyles).toContain("--siga-text-page:");
    expect(indexStyles).toContain("--siga-text-section:");
    expect(indexStyles).toContain("--siga-text-label:");
    expect(indexStyles).toContain("--siga-text-meta:");
    expect(complementStyles).not.toContain("Gestão: escala própria");
    expect(complementStyles).not.toContain(".siga-shell .siga-management-page");
  });

  it("liga as regras efetivas da página Início aos tokens globais nos arquivos-base", () => {
    const pagesStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-pages.css"), "utf8");
    const homeStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-identity-refresh.css"), "utf8");
    const complementStyles = readFileSync(resolve(projectRoot, "client/src/pages/siga-management-complement.css"), "utf8");

    const ruleFrom = (styles: string, selector: string) => {
      const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = styles.match(new RegExp(`(?:^|[\\n}])\\s*${escapedSelector}\\s*\\{([^}]*)\\}`));
      expect(match, `Regra-base ausente: ${selector}`).not.toBeNull();
      return match![1];
    };

    const expectTokenRule = (styles: string, selector: string, fontToken: string, sizeToken: string) => {
      const cssRule = ruleFrom(styles, selector);
      expect(cssRule).toContain(`font-family: ${fontToken}`);
      expect(cssRule).toContain(`font-size: ${sizeToken}`);
      expect(cssRule).not.toMatch(/Source Serif 4|Manrope|font:\s|font-size:\s*[^;]*(?:px|rem)/);
    };

    expectTokenRule(pagesStyles, ".siga-home-heading h1", "var(--siga-font-display)", "var(--siga-text-page)");
    expectTokenRule(pagesStyles, ".siga-card-heading h2", "var(--siga-font-display)", "var(--siga-text-section)");
    expectTokenRule(pagesStyles, ".siga-week-day small", "var(--siga-font-dashboard)", "var(--siga-text-meta)");
    expectTokenRule(pagesStyles, ".siga-week-day strong", "var(--siga-font-display)", "var(--siga-text-section)");
    expectTokenRule(pagesStyles, ".siga-week-day span", "var(--siga-font-dashboard)", "var(--siga-text-meta)");
    expectTokenRule(pagesStyles, ".siga-home-stat small", "var(--siga-font-dashboard)", "var(--siga-text-meta)");

    expectTokenRule(homeStyles, ".siga-home-editorial-intro h1", "var(--siga-font-display)", "var(--siga-text-page)");
    expectTokenRule(homeStyles, ".siga-editorial-metric strong", "var(--siga-font-display)", "var(--siga-text-section)");
    expectTokenRule(homeStyles, ".siga-editorial-metric small", "var(--siga-font-dashboard)", "var(--siga-text-meta)");
    expectTokenRule(homeStyles, ".siga-home-quick-actions > div:last-child button", "var(--siga-font-dashboard)", "var(--siga-text-label)");

    expectTokenRule(complementStyles, ".siga-home-monthly-deadlines h3", "var(--siga-font-display)", "var(--siga-text-section)");
    expectTokenRule(complementStyles, ".siga-home-monthly-deadlines strong", "var(--siga-font-display)", "var(--siga-text-card)");
    expectTokenRule(complementStyles, ".siga-home-monthly-deadlines small", "var(--siga-font-dashboard)", "var(--siga-text-meta)");
    expect(homeStyles).toContain(".siga-home-monthly-deadlines small,");
    expect(homeStyles).not.toContain(".siga-home-monthly-deadline small,");
  });
});

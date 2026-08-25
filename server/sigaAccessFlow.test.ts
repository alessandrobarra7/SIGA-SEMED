import { describe, expect, it } from "vitest";
import { validateFirstAccess } from "../client/src/pages/sigaFlow";

describe("fluxo de primeiro acesso do SIGA SEMED", () => {
  it("impede confirmação diferente da nova senha", () => {
    expect(validateFirstAccess("SenhaAtual123", "NovaSenha123", "OutraSenha123")).toBe("A confirmação precisa ser igual à nova senha.");
  });

  it("exige nova senha com pelo menos dez caracteres", () => {
    expect(validateFirstAccess("SenhaAtual123", "Curta123", "Curta123")).toBe("A nova senha precisa ter pelo menos 10 caracteres.");
  });

  it("impede a reutilização da senha temporária", () => {
    expect(validateFirstAccess("SenhaAtual123", "SenhaAtual123", "SenhaAtual123")).toBe("A nova senha deve ser diferente da senha atual.");
  });

  it("libera uma senha nova válida", () => {
    expect(validateFirstAccess("SenhaAtual123", "NovaSenha123", "NovaSenha123")).toBe("");
  });
});

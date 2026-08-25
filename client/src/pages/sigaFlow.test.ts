import { describe, expect, it } from "vitest";
import { validateFirstAccess } from "./sigaFlow";

describe("validateFirstAccess", () => {
  it("rejeita confirmação divergente", () => {
    expect(validateFirstAccess("SenhaAtual123", "NovaSenha123", "OutraSenha123")).toBe("A confirmação precisa ser igual à nova senha.");
  });

  it("exige no mínimo dez caracteres", () => {
    expect(validateFirstAccess("SenhaAtual123", "Curta123", "Curta123")).toBe("A nova senha precisa ter pelo menos 10 caracteres.");
  });

  it("impede que a senha temporária seja reaproveitada", () => {
    expect(validateFirstAccess("SenhaAtual123", "SenhaAtual123", "SenhaAtual123")).toBe("A nova senha deve ser diferente da senha atual.");
  });

  it("aceita uma nova senha válida", () => {
    expect(validateFirstAccess("SenhaAtual123", "NovaSenha123", "NovaSenha123")).toBe("");
  });
});

import { describe, expect, it } from "vitest";
import { createDomainPasswordHash, createDomainSessionSecret, hashDomainSecret, verifyDomainPassword } from "./semedDomainAuth";

describe("autenticação de domínio SIGA", () => {
  it("verifica a senha apenas contra o hash scrypt armazenado", () => {
    const stored = createDomainPasswordHash("senha-de-teste-segura");

    expect(stored.passwordHash).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    expect(stored.passwordHash).not.toContain("senha-de-teste-segura");
    expect(verifyDomainPassword("senha-de-teste-segura", stored.passwordHash)).toBe(true);
    expect(verifyDomainPassword("senha-incorreta", stored.passwordHash)).toBe(false);
  });

  it("gera segredo opaco e persiste somente seu hash determinístico", () => {
    const secret = createDomainSessionSecret();
    const firstHash = hashDomainSecret(secret);

    expect(secret).toHaveLength(43);
    expect(firstHash).toMatch(/^[a-f0-9]{64}$/);
    expect(firstHash).toBe(hashDomainSecret(secret));
    expect(firstHash).not.toContain(secret);
  });
});

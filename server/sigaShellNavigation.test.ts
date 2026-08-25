import { describe, expect, it } from "vitest";
import { shellViewLabel } from "../client/src/pages/SemedOperationalShell";

describe("navegação do shell SIGA SEMED", () => {
  it("preserva rótulos dos destinos essenciais do shell", () => {
    expect(shellViewLabel("welcome")).toBe("Boas-vindas");
    expect(shellViewLabel("home")).toBe("Início");
    expect(shellViewLabel("records")).toBe("Contratos");
    expect(shellViewLabel("documents")).toBe("Documentos");
    expect(shellViewLabel("nutrition")).toBe("Nutrição");
    expect(shellViewLabel("fleet")).toBe("Frota");
  });
});

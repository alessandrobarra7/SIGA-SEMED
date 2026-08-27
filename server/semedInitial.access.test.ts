import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function anonymousDomainContext(): TrpcContext {
  return {
    user: null,
    domainUser: null,
    req: { headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("acesso de negócio do SIGA", () => {
  it("bloqueia Cadastros Gerais sem sessão de domínio", async () => {
    const caller = appRouter.createCaller(anonymousDomainContext());
    await expect(caller.semed.masters.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("bloqueia Agenda sem aceitar identificador local como credencial", async () => {
    const caller = appRouter.createCaller(anonymousDomainContext());
    await expect(caller.semed.agenda.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

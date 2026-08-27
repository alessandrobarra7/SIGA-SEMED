import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getDomainSessionActor, type SemedDomainSessionActor } from "../semedDomainAuth";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  domainUser: SemedDomainSessionActor | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let domainUser: SemedDomainSessionActor | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  try {
    domainUser = await getDomainSessionActor(opts.req);
  } catch (error) {
    // A sessão de domínio é opcional; o modo local permanece disponível quando ela não existir.
    domainUser = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    domainUser,
  };
}

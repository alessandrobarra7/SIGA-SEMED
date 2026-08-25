/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSigaLocalRepository } from "../client/src/pages/sigaLocalStore";

describe("hook useSigaLocalRepository", () => {
  beforeEach(() => window.localStorage.clear());

  it("persiste create, edit, baixa e exclusão confirmada na mesma camada usada pela UI", () => {
    const first = renderHook(() => useSigaLocalRepository());
    let recordId = "";
    let documentId = "";

    act(() => {
      recordId = first.result.current.createRecord({ kind: "Processo", number: "401/2026", object: "Fluxo pelo hook", party: "Setor", department: "Administrativo", responsible: "Técnico", amount: 0, financialCategory: "Sem controle", paymentDueDate: "", startDate: "2026-08-25", endDate: "2026-09-25", status: "Em andamento", notes: "novo", alertDays: 30 }).id;
      documentId = first.result.current.createDocument({ kind: "Ofício", number: "902/2026", templateKey: "teste", subject: "Documento pelo hook", destination: "Gabinete", recipient: "Gestão", relatedRecord: "Processo 401/2026", responsible: "Técnico", documentDate: "2026-08-25", dueDate: "2026-08-30", status: "Em elaboração", summary: "Resumo", notes: "Observação" }).id;
      first.result.current.updateDocument(documentId, { kind: "Ofício", number: "902/2026", templateKey: "teste", subject: "Documento atualizado pelo hook", destination: "Gabinete", recipient: "Gestão", relatedRecord: "Processo 401/2026", responsible: "Técnico", documentDate: "2026-08-25", dueDate: "2026-08-30", status: "Em elaboração", summary: "Resumo", notes: "Observação" });
      expect(first.result.current.createPayment({ recordId: "r12", paymentDate: "2026-08-25", amount: 100, notes: "Baixa pelo hook" })).toEqual({ error: null });
    });

    act(() => { expect(first.result.current.deleteRecord(recordId, "remover")).toBe(false); });
    expect(first.result.current.records.some((record) => record.id === recordId)).toBe(true);
    act(() => { expect(first.result.current.deleteRecord(recordId, "EXCLUIR")).toBe(true); });
    first.unmount();

    const rehydrated = renderHook(() => useSigaLocalRepository());
    expect(rehydrated.result.current.records.some((record) => record.id === recordId)).toBe(false);
    expect(rehydrated.result.current.records.find((record) => record.id === "r12")?.payments.some((payment) => payment.amount === 100)).toBe(true);
    expect(rehydrated.result.current.documents.find((document) => document.id === documentId)?.subject).toBe("DOCUMENTO ATUALIZADO PELO HOOK");
  });

  it("persiste Primeiro acesso no hook e libera o próximo login local", () => {
    const first = renderHook(() => useSigaLocalRepository());
    let userId = "";
    act(() => { userId = first.result.current.login("tecnico2")!.user.id; });
    act(() => { expect(first.result.current.completeFirstAccess(userId)?.mustChangePassword).toBe(false); });
    first.unmount();

    const rehydrated = renderHook(() => useSigaLocalRepository());
    act(() => { expect(rehydrated.result.current.login("tecnico2")?.user.mustChangePassword).toBe(false); });
  });
});

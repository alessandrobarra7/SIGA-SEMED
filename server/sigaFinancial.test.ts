import { describe, expect, it } from "vitest";
import { calculateFinancialPosition, parseBrazilianAmount } from "../client/src/pages/sigaLocalStore";

describe("fluxo financeiro visual", () => {
  it("deriva pago e saldo a partir das baixas locais", () => {
    expect(calculateFinancialPosition(1000, [{ id: "p1", recordId: "r1", paymentDate: "2026-01-01", amount: 240, notes: "PARCIAL", createdAt: "2026-01-01" }])).toEqual({ paidAmount: 240, balanceAmount: 760 });
  });

  it("não expõe saldo negativo quando as baixas excedem o valor", () => {
    expect(calculateFinancialPosition(100, [{ id: "p1", recordId: "r1", paymentDate: "2026-01-01", amount: 120, notes: "AJUSTE", createdAt: "2026-01-01" }])).toEqual({ paidAmount: 120, balanceAmount: 0 });
  });

  it("interpreta valor brasileiro positivo para o formulário de baixa", () => {
    expect(parseBrazilianAmount("1.234,56")).toBe(1234.56);
    expect(parseBrazilianAmount("0,00")).toBeNull();
  });
});

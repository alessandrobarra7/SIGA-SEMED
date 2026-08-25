export type LocalPayment = {
  id: string;
  recordId: string;
  date: string;
  amount: number;
  note: string;
};

export function calculateFinancialPosition(contractAmount: number, payments: LocalPayment[]) {
  const paidAmount = payments.reduce((total, payment) => total + payment.amount, 0);
  return { paidAmount, balanceAmount: Math.max(contractAmount - paidAmount, 0) };
}

export function parseBrazilianAmount(value: string) {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

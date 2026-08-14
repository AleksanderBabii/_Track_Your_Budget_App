export function formatCurrency(
  amount: number,
  currency: string = "PLN",
  locale: string = "pl-PL",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

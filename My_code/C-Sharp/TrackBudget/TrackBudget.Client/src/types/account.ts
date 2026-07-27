export type Currency =
  | "PLN"
  | "USD"
  | "EUR"
  | "GBP"
  | "UAH"
  | "JPY"
  | "CHF"
  | "CAD"
  | "AUD"
  | "CNY";

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  createdAt: string;
}

export interface CreateAccountRequest {
  name: string;
  initialBalance: number;
  currency: Currency;
}
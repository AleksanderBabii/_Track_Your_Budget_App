export type Currency =
  | "PLN"
  | "EUR"
  | "USD"
  | "GBP"
  | "UAH";

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
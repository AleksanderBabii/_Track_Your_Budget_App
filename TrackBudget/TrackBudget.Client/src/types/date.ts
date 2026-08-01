import type { Transaction } from "./transaction";

export type GroupedTransactions = Record<string, Transaction[]>;

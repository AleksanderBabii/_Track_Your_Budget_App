export interface Transfer {
  accountId: string;
  amount: number;
  date: string;
  notes: string | null;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  createdAt: string;
}

export interface CreateTransfer {
  amount: number;
  date: string;
  notes: string | null | undefined;
  fromAccountId: string;
  toAccountId: string;
}

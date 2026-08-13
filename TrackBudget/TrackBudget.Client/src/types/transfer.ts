export interface Transfer {
    id: string;
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
    notes: string | null;
    fromAccountId: string;
    toAccountId: string;
}

export interface UpdateTransfer {
    amount: number;
    date: string;
    notes: string | null;
    fromAccountId: string;
    toAccountId: string;
}

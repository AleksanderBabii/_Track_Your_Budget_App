export interface TransactionFilters {
    search: string;
    accountId: string | null;
    categoryId: string | null;
    type: "Income" | "Expense" | "All";
    sortBy: "newest" | "oldest" | "highestAmount" | "lowestAmount";
    startDate: Date | null;
    endDate: Date | null;
}
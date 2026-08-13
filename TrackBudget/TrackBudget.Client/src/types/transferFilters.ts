export interface TransferFilters {
    search: string;
    fromAccountId: string | null;
    toAccountId: string | null;
    sortBy: "newest" | "oldest" | "highestAmount" | "lowestAmount";
    startDate: Date | null;
    endDate: Date | null;
}
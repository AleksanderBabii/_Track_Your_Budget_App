export interface Budget {
    id: string;
    userId: string;
    limit: number;
    spent: number;
    remaining: number;
    month: number;
    year: number;
    categoryId: string;
    categoryName: string;
}

export interface CreateBudget {
    limit: number;
    month: number;
    year: number;
    categoryId: string;
}

export interface UpdateBudget {
    limit: number;
    month: number;
    year: number;
    categoryId: string;
}

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
    userId: string;
    limit: number;
    month: number;
    year: number;
    categoryId: string;
}

export interface UpdateBudget {
    id: string;
    userId: string;
    limit: number;
    month: number;
    year: number;
    categoryId: string;
}

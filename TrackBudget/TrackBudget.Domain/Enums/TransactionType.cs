namespace TrackBudget.Domain.Enums;


public enum TransactionType
{
    Income,
    Expense
}

public enum TransactionSource
{
    Manual,
    CsvImport,
    BankSync
}

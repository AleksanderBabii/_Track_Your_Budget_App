using TrackBudget.Application.DTOs.Imports;
using TrackBudget.Application.Interfaces.Imports;


namespace TrackBudget.Infrastructure.Imports.Csv;

public sealed class CsvTransactionMapper : ICsvTransactionMapper
{
    private static readonly string[] DateHeaders =
    [
        "date",
        "data",
        "transaction date",
        "transactiondate",
        "operation date",
        "operationdate"
    ];

    private static readonly string[] TitleHeaders =
    [
        "description",
        "opis",
        "title",
        "tytuł",
        "transaction",
        "transaction description",
        "merchant",
        "counterparty"
    ];

    private static readonly string[] AmountHeaders =
    [
        "amount",
        "kwota",
        "transaction amount",
        "transactionamount"
    ];

    private static readonly string[] DebitHeaders =
    [
        "debit",
        "debet",
        "withdrawal",
        "outgoing",
        "expense",
        "wydatki"
    ];

    private static readonly string[] CreditHeaders =
    [
        "credit",
        "kredyt",
        "deposit",
        "incoming",
        "income",
        "wpływy"
    ];

    private static readonly string[] NotesHeaders =
    [
        "notes",
        "note",
        "uwagi",
        "comment",
        "comments"
    ];

    public bool TryMap(
        CsvRowDto row,
        out ImportTransactionDto transaction,
        out string? error)
    {
        transaction = new ImportTransactionDto();
        error = null;

        if (!CsvParser.TryGetValue(
                row,
                DateHeaders,
                out var dateValue))
        {
            error = "Date column was not found.";
            return false;
        }

        if (!CsvParser.TryParseDate(
                dateValue,
                out var date))
        {
            error = $"Invalid date: '{dateValue}'.";
            return false;
        }

        if (!CsvParser.TryGetValue(
                row,
                TitleHeaders,
                out var title))
        {
            title = "Imported transaction";
        }

        if (!TryGetAmount(row, out var amount))
        {
            error = "Amount column was not found or contains an invalid value.";
            return false;
        }

        CsvParser.TryGetValue(
            row,
            NotesHeaders,
            out var notes);

        transaction = new ImportTransactionDto
        {
            Date = date,
            Title = string.IsNullOrWhiteSpace(title)
                ? "Imported transaction"
                : title.Trim(),
            Amount = amount,
            Notes = string.IsNullOrWhiteSpace(notes)
                ? null
                : notes.Trim()
        };

        return true;
    }

    private static bool TryGetAmount(
        CsvRowDto row,
        out decimal amount)
    {
        if (CsvParser.TryGetValue(
                row,
                AmountHeaders,
                out var amountValue))
        {
            if (CsvParser.TryParseAmount(
                    amountValue,
                    out amount))
            {
                return true;
            }
        }

        if (CsvParser.TryGetValue(
                row,
                DebitHeaders,
                out var debitValue) &&
            !string.IsNullOrWhiteSpace(debitValue))
        {
            if (CsvParser.TryParseAmount(
                    debitValue,
                    out amount))
            {
                amount = -Math.Abs(amount);
                return true;
            }
        }

        if (CsvParser.TryGetValue(
                row,
                CreditHeaders,
                out var creditValue) &&
            !string.IsNullOrWhiteSpace(creditValue))
        {
            if (CsvParser.TryParseAmount(
                    creditValue,
                    out amount))
            {
                amount = Math.Abs(amount);
                return true;
            }
        }

        amount = 0;
        return false;
    }
}
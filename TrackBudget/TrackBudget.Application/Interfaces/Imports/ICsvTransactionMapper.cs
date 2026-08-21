using TrackBudget.Application.DTOs.Imports;

namespace TrackBudget.Application.Interfaces.Imports;

public interface ICsvTransactionMapper
{
    bool TryMap(
        CsvRowDto row,
        out ImportTransactionDto transaction,
        out string? error);
}
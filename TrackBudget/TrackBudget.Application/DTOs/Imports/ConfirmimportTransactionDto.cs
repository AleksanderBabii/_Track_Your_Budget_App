namespace TrackBudget.Application.DTOs.Imports;
using TrackBudget.Domain.Enums;
public sealed class ConfirmImportTransactionDto
{
    public int RowNumber { get; set; }

    public DateTime Date { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public string? Notes { get; set; }

    public Guid CategoryId { get; set; }
}
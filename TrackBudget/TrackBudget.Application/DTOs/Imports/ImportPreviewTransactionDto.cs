namespace TrackBudget.Application.DTOs.Imports;

public class ImportPreviewTransactionDto
{
    public int RowNumber { get; set; }

    public DateTime Date { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string? Notes { get; set; }

    public string? CategoryName { get; set; }

    public bool IsDuplicate { get; set; }

    public string? Error { get; set; }
}
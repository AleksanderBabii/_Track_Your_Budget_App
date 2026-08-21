namespace TrackBudget.Application.DTOs.Imports;

public class ImportPreviewDto
{
    public int TotalRows { get; set; }
    public int ValidRows { get; set; }
    public int InvalidRows { get; set; }
    public int DuplicateRows { get; set; }
    public List<ImportPreviewTransactionDto> Transactions { get; set; } = new();
}
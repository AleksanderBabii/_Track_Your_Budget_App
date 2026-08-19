namespace TrackBudget.Application.DTOs.Imports;

public class ConfirmImportDto
{
    public Guid AccountId { get; set; }

    public List<ImportTransactionDto> Transactions { get; set; } = [];
}
namespace TrackBudget.Application.DTOs.Imports;

public class ConfirmImportDto
{
    public Guid AccountId { get; set; }

    public List<ConfirmImportTransactionDto> Transactions { get; set; } = new();
}
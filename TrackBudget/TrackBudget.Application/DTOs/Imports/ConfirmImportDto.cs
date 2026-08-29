using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.DTOs.Imports;

public sealed class ConfirmImportDto
{
    public Guid AccountId { get; set; }

    public List<ConfirmImportTransactionDto> Transactions { get; set; } = new List<ConfirmImportTransactionDto>();
}


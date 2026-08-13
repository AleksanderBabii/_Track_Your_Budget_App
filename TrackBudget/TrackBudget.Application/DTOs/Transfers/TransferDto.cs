namespace TrackBudget.Application.DTOs.Transfers;

public class TransferDto
{
    public Guid Id { get; set; }

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public string? Notes { get; set; }

    public Guid FromAccountId { get; set; }

    public string FromAccountName { get; set; } = string.Empty;

    public Guid ToAccountId { get; set; }

    public string ToAccountName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
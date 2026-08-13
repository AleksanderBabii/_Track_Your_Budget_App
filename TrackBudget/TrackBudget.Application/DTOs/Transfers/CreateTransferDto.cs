namespace TrackBudget.Application.DTOs.Transfers;

public class CreateTransferDto
{
    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public string? Notes { get; set; }

    public Guid FromAccountId { get; set; }

    public Guid ToAccountId { get; set; }
}
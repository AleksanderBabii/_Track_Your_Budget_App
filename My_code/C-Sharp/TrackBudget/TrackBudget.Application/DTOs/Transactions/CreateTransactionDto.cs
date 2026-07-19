using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.DTOs.Transactions;

public class CreateTransactionDto
{
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
}
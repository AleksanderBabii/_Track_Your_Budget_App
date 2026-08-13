using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.DTOs.Transactions;

public class TransactionDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public DateTime Date { get; set; }

    public string? Notes { get; set; }

    public Guid AccountId { get; set; }

    public string AccountName { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; }
}
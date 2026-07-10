using TrackBudget.Domain.Common;

namespace TrackBudget.Domain.Entities;

public class Transaction : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Type { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public Guid AccountId { get; set; }

    public Account Account { get; set; } = null!;

    public Guid CategoryId { get; set; }

    public Category Category { get; set; } = null!;

}
using TrackBudget.Domain.Common;

namespace TrackBudget.Domain.Entities;

public class Transfer : BaseEntity
{
    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public string? Notes { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public Guid FromAccountId { get; set; }

    public Account FromAccount { get; set; } = null!;

    public Guid ToAccountId { get; set; }

    public Account ToAccount { get; set; } = null!;
}
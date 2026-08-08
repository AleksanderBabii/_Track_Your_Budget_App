using TrackBudget.Domain.Entities;

public class Budget
{
    public Guid Id { get; set; }

    public decimal Limit { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
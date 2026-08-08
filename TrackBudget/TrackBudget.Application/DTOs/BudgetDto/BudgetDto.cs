using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.DTOs.BudgetDto;

public class BudgetDto
{
    public Guid Id { get; set; }

    public decimal Limit { get; set; }
    public decimal Spent { get; set; }
    public decimal Remaining => Limit - Spent;

    public int Month { get; set; }

    public int Year { get; set; }

    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; }
}
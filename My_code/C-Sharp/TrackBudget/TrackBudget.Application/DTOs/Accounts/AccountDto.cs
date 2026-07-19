using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.DTOs.Accounts;


public class AccountDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public Currency Currency { get; set; }

    public DateTime CreatedAt { get; set; }
}

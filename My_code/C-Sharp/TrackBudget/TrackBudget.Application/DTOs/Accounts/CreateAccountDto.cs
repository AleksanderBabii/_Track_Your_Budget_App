using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.DTOs.Accounts;

public class CreateAccountDto
{
    public string Name { get; set; } = string.Empty;
    public decimal InitialBalance { get; set; }
    public Currency Currency { get; set; }


}

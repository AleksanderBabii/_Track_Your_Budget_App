using TrackBudget.Domain.Common;

namespace TrackBudget.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<Account> Accounts { get; set; } = new List<Account>();

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    public ICollection<Category> Categories { get; set; } = new List<Category>();

}
using TrackBudget.Domain.Common;

namespace TrackBudget.Domain.Entities;

public class Account : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Balance { get; set; }

    public string Currency { get; set; } = "PLN";
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Transfer> OutgoingTransfers { get; set; }
    = new List<Transfer>();

public ICollection<Transfer> IncomingTransfers { get; set; }
    = new List<Transfer>();
}
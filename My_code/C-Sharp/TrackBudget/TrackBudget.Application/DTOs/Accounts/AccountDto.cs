namespace TrackBudget.Application.DTOs.Accounts
{
    public class AccountDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public string Currency { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
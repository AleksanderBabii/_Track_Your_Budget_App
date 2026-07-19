using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.DTOs.Accounts;


    public class UpdateAccountDto
    {
        public string Name { get; set; } = string.Empty;
        public Currency Currency { get; set; }
    }

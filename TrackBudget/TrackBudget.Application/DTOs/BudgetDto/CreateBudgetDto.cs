namespace TrackBudget.Application.DTOs.BudgetDto
{
    public class CreateBudgetDto
    {
        public decimal Limit { get; set; }
        public Guid CategoryId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
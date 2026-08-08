using TrackBudget.Application.DTOs.BudgetDto;

namespace TrackBudget.Application.Interfaces.Services;
public interface IBudgetService
{
    Task<BudgetDto> GetBudgetByIdAsync(Guid budgetId, CancellationToken cancellationToken = default);

    Task<List<BudgetDto>> GetBudgetsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<BudgetDto> CreateBudgetAsync(BudgetDto budgetDto, CancellationToken cancellationToken = default);

    Task UpdateBudgetAsync(BudgetDto budgetDto, CancellationToken cancellationToken = default);

    Task DeleteBudgetAsync(Guid budgetId, CancellationToken cancellationToken = default);
}
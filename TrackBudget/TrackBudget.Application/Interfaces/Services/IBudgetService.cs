using TrackBudget.Application.DTOs.BudgetDto;

namespace TrackBudget.Application.Interfaces.Services;
public interface IBudgetService
{
    Task<BudgetDto> GetBudgetByIdAsync(Guid budgetId, Guid userId, CancellationToken cancellationToken = default);

    Task<List<BudgetDto>> GetBudgetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<BudgetDto> CreateBudgetAsync(CreateBudgetDto createBudgetDto, Guid userId, CancellationToken cancellationToken = default);

    Task UpdateBudgetAsync(UpdateBudgetDto updateBudgetDto, Guid userId, Guid budgetId, CancellationToken cancellationToken = default);

    Task DeleteBudgetAsync(Guid budgetId, Guid userId, CancellationToken cancellationToken = default);
}
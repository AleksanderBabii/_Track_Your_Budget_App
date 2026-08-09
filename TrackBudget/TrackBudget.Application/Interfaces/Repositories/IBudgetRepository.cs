using TrackBudget.Domain.Entities;

public interface IBudgetRepository
{
    Task<Budget?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<List<Budget>> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Budget?> GetByCategoryAndPeriodAsync(Guid categoryId, int month, int year, Guid userId, CancellationToken cancellationToken = default);

    Task AddAsync(Budget budget, CancellationToken cancellationToken = default);

    void Update(Budget budget);

    void Delete(Budget budget);
}
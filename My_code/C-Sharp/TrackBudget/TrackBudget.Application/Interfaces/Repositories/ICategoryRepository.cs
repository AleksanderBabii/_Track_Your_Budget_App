using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllByUserIdAsync(
    Guid userId, CancellationToken cancellationToken = default);

    Task<Category?> GetByIdAsync(
        Guid categoryId, Guid userId,
        CancellationToken cancellationToken = default);

        Task<Category?> GetTrackedByIdAsync(
        Guid categoryId, Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistAsync(
        Guid userId, string name, string type,
        Guid? excludedCategoryId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Category category, CancellationToken cancellationToken = default);

    void Remove(Category category);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

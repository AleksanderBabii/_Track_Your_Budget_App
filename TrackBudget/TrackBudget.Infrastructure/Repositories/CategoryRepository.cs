using Microsoft.EntityFrameworkCore;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Domain.Entities;
using TrackBudget.Infrastructure.Data;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Infrastructure.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    private readonly AppDbContext _dbContext = context;

    public Task<List<Category>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Categories
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Type)
            .ThenBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public Task<Category?> GetByIdAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Categories
        .Include(c => c.Transactions)
        .SingleOrDefaultAsync(
            c => c.Id == categoryId && c.UserId == userId,
            cancellationToken
        );
    }

    public Task<Category?> GetTrackedByIdAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Categories
            .SingleOrDefaultAsync(
                c => c.Id == categoryId && c.UserId == userId,
                cancellationToken
            );
    }

    public Task<bool> ExistAsync(
        Guid userId,
        string name,
        CategoryType type,
        Guid? excludedCategoryId = null,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Categories.AnyAsync(
            category =>
                category.UserId == userId &&
                category.Name.ToLower() == name.ToLower() &&
                category.Type == type &&
                (
                    excludedCategoryId == null ||
                    category.Id != excludedCategoryId
                ),
            cancellationToken
        );
    }

    public async Task AddAsync(
        Category category,
        CancellationToken cancellationToken = default
    )
    {
        await _dbContext.Categories.AddAsync(category, cancellationToken);
    }

    public void Remove(Category category)
    {
        _dbContext.Categories.Remove(category);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
using Microsoft.EntityFrameworkCore;

using TrackBudget.Domain.Entities;
using TrackBudget.Infrastructure.Data;

namespace TrackBudget.Infrastructure.Repositories;

public class BudgetRepository(AppDbContext context) : IBudgetRepository
{
    private readonly AppDbContext _dbContext = context;
    
    public async Task<Budget?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<List<Budget>> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Budgets
            .Include(b => b.Category)
            .Where(b => b.UserId == userId)
            .OrderBy(b => b.Month)
            .ThenBy(b => b.Year)
            .ToListAsync(cancellationToken);
    }

    public async Task<Budget?> GetByCategoryAndPeriodAsync(Guid categoryId, int month, int year, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Month == month && b.Year == year && b.UserId == userId, cancellationToken);
    }

    public async Task AddAsync(Budget budget, CancellationToken cancellationToken = default)
    {
        await _dbContext.Budgets.AddAsync(budget, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public void Update(Budget budget)
    {
        _dbContext.Budgets.Update(budget);
        _dbContext.SaveChanges();
    }

    public void Delete(Budget budget)
    {
        _dbContext.Budgets.Remove(budget);
        _dbContext.SaveChanges();
    }
}
using MapsterMapper;

using TrackBudget.Application.DTOs.BudgetDto;
using TrackBudget.Application.Exceptions;
using TrackBudget.Application.Interfaces.Persistence;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Enums;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class BudgetService(
    IUnitOfWork unitOfWork,
    IMapper mapper
) : IBudgetService
{
    private async Task<Budget> GetOwnedBudgetAsync(Guid budgetId, Guid userId, CancellationToken cancellationToken)
    {
        var budget = await unitOfWork.BudgetRepository.GetByIdAsync(budgetId, cancellationToken);
        if (budget is null || budget.UserId != userId)
        {
            throw new NotFoundException("Budget not found.");
        }

        return budget;
    }

    private static decimal CalculateSpent(Budget budget, IEnumerable<Transaction> transactions)
    {
        return transactions
            .Where(t => t.Type == TransactionType.Expense &&
                        t.CategoryId == budget.CategoryId &&
                        t.Date.Month == budget.Month &&
                        t.Date.Year == budget.Year)
            .Sum(t => t.Amount);
    }

    private BudgetDto MapBudgetDto(Budget budget, IEnumerable<Transaction> transactions)
    {
        var budgetDto = mapper.Map<BudgetDto>(budget);
        budgetDto.Spent = CalculateSpent(budget, transactions);
        return budgetDto;
    }

    public async Task<List<BudgetDto>> GetBudgetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var budgets = await unitOfWork.BudgetRepository.GetAllByUserIdAsync(userId, cancellationToken);
        var transactions = await unitOfWork.TransactionRepository.GetAllByUserIdAsync(userId, cancellationToken);

        var result = mapper.Map<List<BudgetDto>>(budgets);

        foreach (var budgetDto in result)
        {
            var correspondingBudget = budgets.FirstOrDefault(b => b.Id == budgetDto.Id);
            if (correspondingBudget is not null)
            {
                var updatedBudgetDto = MapBudgetDto(correspondingBudget, transactions);
                var index = result.FindIndex(b => b.Id == budgetDto.Id);
                if (index >= 0)
                {
                    result[index] = updatedBudgetDto;
                }
            }
        }

        return result;
    }

    public async Task<BudgetDto> GetBudgetByIdAsync(Guid budgetId, Guid userId, CancellationToken cancellationToken = default)
    {
        var budget = await GetOwnedBudgetAsync(budgetId, userId, cancellationToken);

        var transactions = await unitOfWork.TransactionRepository.GetAllByUserIdAsync(userId, cancellationToken);
    

        return MapBudgetDto(budget, transactions);
    }

    public async Task<BudgetDto> CreateBudgetAsync(CreateBudgetDto createBudgetDto, Guid userId, CancellationToken cancellationToken = default)
    {
        var existingBudget = await unitOfWork.BudgetRepository.GetByCategoryAndPeriodAsync(createBudgetDto.CategoryId, createBudgetDto.Month, createBudgetDto.Year, userId, cancellationToken);
        if (existingBudget is not null)
        {
            throw new AppValidationException("A budget for this category and period already exists.");
        }

        var budget = mapper.Map<Budget>(createBudgetDto);
        budget.Id = Guid.NewGuid();
        budget.UserId = userId;

        await unitOfWork.BudgetRepository.AddAsync(budget, cancellationToken);

        var createdBudget = await unitOfWork.BudgetRepository.GetByIdAsync(budget.Id, cancellationToken) ?? throw new NotFoundException("Budget not found after creation.");

        var result = mapper.Map<BudgetDto>(createdBudget);
        result.Spent = 0;

        return result;
    }

    public async Task UpdateBudgetAsync(UpdateBudgetDto updateBudgetDto, Guid userId, Guid budgetId, CancellationToken cancellationToken = default)
    {
        var budget = await GetOwnedBudgetAsync(budgetId, userId, cancellationToken);

        var existingBudget = await unitOfWork.BudgetRepository.GetByCategoryAndPeriodAsync(
            updateBudgetDto.CategoryId,
            updateBudgetDto.Month,
            updateBudgetDto.Year,
            userId,
            cancellationToken);

        if (existingBudget is not null && existingBudget.Id != budget.Id)
        {
            throw new AppValidationException("A budget for this category and period already exists.");
        }

        mapper.Map(updateBudgetDto, budget);

        unitOfWork.BudgetRepository.Update(budget);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteBudgetAsync(Guid budgetId, Guid userId, CancellationToken cancellationToken = default)
    {
        var budget = await GetOwnedBudgetAsync(budgetId, userId, cancellationToken);

        unitOfWork.BudgetRepository.Delete(budget);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
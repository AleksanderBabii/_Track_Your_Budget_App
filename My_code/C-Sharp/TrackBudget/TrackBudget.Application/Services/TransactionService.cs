using MapsterMapper;

using TrackBudget.Application.DTOs.Transactions;
using TrackBudget.Application.Exceptions;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Interfaces.Persistence;

using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Services;

public class TransactionService(
    ITransactionRepository transactionRepository,
    IAccountRepository accountRepository,
    ICategoryRepository categoryRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork
) : ITransactionService
{
    public async Task<IReadOnlyCollection<TransactionDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var transactions = await transactionRepository.GetAllByUserIdAsync(userId, cancellationToken);
        return mapper.Map<List<TransactionDto>>(transactions);
    }

    public async Task<TransactionDto> GetByIdAsync(
        Guid transactionId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var transaction = await GetOwnedTransactionAsync(transactionId, userId, cancellationToken);
        return mapper.Map<TransactionDto>(transaction);
    }

    public async Task<TransactionDto> CreateAsync(
        Guid userId,
        CreateTransactionDto createTransactionDto,
        CancellationToken cancellationToken = default)
    {
        var account = await GetOwnedAccountAsync(createTransactionDto.AccountId, userId, cancellationToken);
        var category = await GetOwnedCategoryAsync(createTransactionDto.CategoryId, userId, cancellationToken);

        ValidateTransactionType(category.Type, createTransactionDto.Type);

        ApplyBalanceChange(account, createTransactionDto.Amount, createTransactionDto.Type, reverse: false);

        var transaction = new Transaction
        {
            Title = NormalizeTitle(createTransactionDto.Title),
            Amount = createTransactionDto.Amount,
            Type = createTransactionDto.Type,
            Date = NormalizeDateToUtc(createTransactionDto.Date),
            Notes = NormalizeNotes(createTransactionDto.Notes),
            UserId = userId,
            AccountId = account.Id,
            CategoryId = category.Id,
            Account = account,
            Category = category
        };

        await transactionRepository.AddAsync(transaction, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return mapper.Map<TransactionDto>(transaction);
    }

    public async Task<TransactionDto> UpdateAsync(
        Guid transactionId,
        Guid userId,
        UpdateTransactionDto dto,
        CancellationToken cancellationToken = default)
    {
        var transaction = await GetOwnedTransactionAsync(transactionId, userId, cancellationToken);

        var oldAccount = await GetOwnedAccountAsync(transaction.AccountId, userId, cancellationToken);

        var newAccount = transaction.AccountId == dto.AccountId
            ? oldAccount
            : await GetOwnedAccountAsync(dto.AccountId, userId, cancellationToken);

        var category = await GetOwnedCategoryAsync(dto.CategoryId, userId, cancellationToken);

        ValidateTransactionType(category.Type, dto.Type);

        // Validate all balance effects first, then mutate.
        ValidateBalanceTransition(
            oldAccount,
            newAccount,
            transaction.Amount,
            transaction.Type,
            dto.Amount,
            dto.Type
        );

        // Reverse old transaction effect.
        ApplyBalanceChange(
            oldAccount,
            transaction.Amount,
            transaction.Type,
            reverse: true
        );

        // Apply new transaction effect.
        ApplyBalanceChange(
            newAccount,
            dto.Amount,
            dto.Type,
            reverse: false
        );

        transaction.Title = NormalizeTitle(dto.Title);
        transaction.Amount = dto.Amount;
        transaction.Type = dto.Type;
        transaction.Date = NormalizeDateToUtc(dto.Date);
        transaction.Notes = NormalizeNotes(dto.Notes);
        transaction.AccountId = newAccount.Id;
        transaction.CategoryId = category.Id;
        transaction.Account = newAccount;
        transaction.Category = category;
        transaction.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return mapper.Map<TransactionDto>(transaction);
    }

    public async Task DeleteAsync(
        Guid transactionId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var transaction = await GetOwnedTransactionAsync(transactionId, userId, cancellationToken);

        var account = await GetOwnedAccountAsync(transaction.AccountId, userId, cancellationToken);

        ApplyBalanceChange(
            account,
            transaction.Amount,
            transaction.Type,
            reverse: true
        );

        transactionRepository.Remove(transaction);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Transaction> GetOwnedTransactionAsync(
        Guid transactionId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await transactionRepository.GetByIdAsync(transactionId, userId, cancellationToken)
            ?? throw new NotFoundException("Transaction not found.");
    }

    private async Task<Account> GetOwnedAccountAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await accountRepository.GetTrackedByIdAsync(accountId, userId, cancellationToken)
            ?? throw new NotFoundException("Account not found.");
    }

    private async Task<Category> GetOwnedCategoryAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await categoryRepository.GetTrackedByIdAsync(categoryId, userId, cancellationToken)
            ?? throw new NotFoundException("Category not found.");
    }

    private static void ValidateTransactionType(CategoryType categoryType, TransactionType transactionType)
    {
        if (categoryType != (CategoryType)transactionType)
        {
            throw new BusinessRuleException(
                $"Transaction type '{transactionType}' does not match category type '{categoryType}'.");
        }
    }

    private static string NormalizeTitle(string? title)
    {
        return title?.Trim() ?? string.Empty;
    }

    private static DateTime NormalizeDateToUtc(DateTime date)
    {
        return date.Kind switch
        {
            DateTimeKind.Utc => date,
            DateTimeKind.Local => date.ToUniversalTime(),
            DateTimeKind.Unspecified => DateTime.SpecifyKind(date, DateTimeKind.Utc),
            _ => date
        };
    }

    private static void ValidateBalanceTransition(
        Account oldAccount,
        Account newAccount,
        decimal oldAmount,
        TransactionType oldType,
        decimal newAmount,
        TransactionType newType)
    {
        var oldBalanceAfterReverse = ComputeBalanceAfter(
            oldAccount.Balance,
            oldAmount,
            oldType,
            reverse: true
        );

        if (ReferenceEquals(oldAccount, newAccount))
        {
            ComputeBalanceAfter(
                oldBalanceAfterReverse,
                newAmount,
                newType,
                reverse: false
            );

            return;
        }

        ComputeBalanceAfter(
            newAccount.Balance,
            newAmount,
            newType,
            reverse: false
        );
    }

    private static void ApplyBalanceChange(Account account, decimal amount, TransactionType type, bool reverse)
    {
        account.Balance = ComputeBalanceAfter(account.Balance, amount, type, reverse);
    }

    private static decimal ComputeBalanceAfter(decimal currentBalance, decimal amount, TransactionType type, bool reverse)
    {
        switch (type)
        {
            case TransactionType.Income:
                if (reverse)
                {
                    if (currentBalance < amount)
                    {
                        throw new BusinessRuleException("Insufficient balance to reverse the transaction.");
                    }

                    return currentBalance - amount;
                }

                return currentBalance + amount;

            case TransactionType.Expense:
                if (reverse)
                {
                    return currentBalance + amount;
                }

                if (currentBalance < amount)
                {
                    throw new BusinessRuleException("Insufficient balance for the transaction.");
                }

                return currentBalance - amount;

            default:
                throw new BusinessRuleException($"Unsupported transaction type: {type}");
        }
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
    }
}
using TrackBudget.Application.DTOs.Transactions;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ICategoryRepository _categoryRepository;

    public TransactionService(
        ITransactionRepository transactionRepository,
        IAccountRepository accountRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _accountRepository = accountRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IReadOnlyCollection<TransactionDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var transactions = await _transactionRepository.GetAllByUserIdAsync(userId, cancellationToken);
        return transactions.Select(MapToDto).ToList();
    }

    public async Task<TransactionDto?> GetByIdAsync(Guid transactionId, Guid userId, CancellationToken cancellationToken = default)
    {
        var transaction = await GetOwnedTransactionAsync(transactionId, userId, cancellationToken);
        if (transaction == null)
        {
            return null;
        }

        return MapToDto(transaction);
    }

    public async Task<TransactionDto> CreateAsync(Guid userId, CreateTransactionDto createTransactionDto, CancellationToken cancellationToken = default)
    {
        var type = NormalizeType(createTransactionDto.Type);

        var account = await GetOwnedAccountAsync(createTransactionDto.AccountId, userId, cancellationToken);
        if (account == null)
        {
            throw new ArgumentException("Account not found.");
        }

        var category = await GetOwnedCategoryAsync(createTransactionDto.CategoryId, userId, cancellationToken);

        ValidateTransactionType(category, type);

        ApplyTransactionBalance(account, createTransactionDto.Amount, type);

        var transaction = new Transaction
        {
            Title = createTransactionDto.Title.Trim(),
            Amount = createTransactionDto.Amount,
            Type = type,
            Date = createTransactionDto.Date.ToUniversalTime(),
            Notes = NormalizeNotes(createTransactionDto.Notes),
            UserId = userId,
            AccountId = account.Id,
            CategoryId = category.Id,

            Account = account,
            Category = category
        };

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(transaction);
    }

    public async Task<TransactionDto> UpdateAsync(
    Guid transactionId,
    Guid userId,
    UpdateTransactionDto dto,
    CancellationToken cancellationToken = default
)
    {
        var transaction = await GetOwnedTransactionAsync(
            transactionId,
            userId,
            cancellationToken
        );

        var oldAccount = await GetOwnedAccountAsync(
            transaction.AccountId,
            userId,
            cancellationToken
        );

        ReverseTransactionBalance(
            oldAccount,
            transaction.Amount,
            transaction.Type
        );

        var newAccount = transaction.AccountId == dto.AccountId
            ? oldAccount
            : await GetOwnedAccountAsync(
                dto.AccountId,
                userId,
                cancellationToken
            );

        var category = await GetOwnedCategoryAsync(
            dto.CategoryId,
            userId,
            cancellationToken
        );

        var type = NormalizeType(dto.Type);

        ValidateTransactionType(category, type);

        ApplyTransactionBalance(
            newAccount,
            dto.Amount,
            type
        );

        transaction.Title = dto.Title.Trim();
        transaction.Amount = dto.Amount;
        transaction.Type = type;
        transaction.Date = dto.Date.ToUniversalTime();
        transaction.Notes = NormalizeNotes(dto.Notes);
        transaction.AccountId = newAccount.Id;
        transaction.CategoryId = category.Id;
        transaction.Account = newAccount;
        transaction.Category = category;
        transaction.UpdatedAt = DateTime.UtcNow;

        await _transactionRepository.SaveChangesAsync(
            cancellationToken
        );

        return MapToDto(transaction);
    }

    public async Task DeleteAsync(
        Guid transactionId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var transaction = await GetOwnedTransactionAsync(
            transactionId,
            userId,
            cancellationToken
        );

        var account = await GetOwnedAccountAsync(
            transaction.AccountId,
            userId,
            cancellationToken
        );

        ReverseTransactionBalance(
            account,
            transaction.Amount,
            transaction.Type
        );

        _transactionRepository.Remove(transaction);

        await _transactionRepository.SaveChangesAsync(
            cancellationToken
        );
    }

    private async Task<Transaction> GetOwnedTransactionAsync(Guid transactionId, Guid userId, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(transactionId, userId, cancellationToken);
        if (transaction == null)
        {
            throw new ArgumentException("Transaction not found.");
        }

        return transaction;
    }

    private async Task<Account> GetOwnedAccountAsync(Guid accountId, Guid userId, CancellationToken cancellationToken)
    {
        var account = await _accountRepository.GetTrackedByIdAsync(accountId, userId, cancellationToken);
        if (account == null)
        {
            throw new ArgumentException("Account not found.");
        }
        return account;
    }

    private async Task<Category> GetOwnedCategoryAsync(Guid categoryId, Guid userId, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetTrackedByIdAsync(categoryId, userId, cancellationToken);
        if (category == null)
        {
            throw new ArgumentException("Category not found.");
        }
        return category;
    }

    private static void ValidateTransactionType(Category category, string transactionType)
    {
        transactionType = NormalizeType(transactionType);
        if (!string.Equals(category.Type, transactionType, StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException($"Transaction type '{transactionType}' does not match category type '{category.Type}'.");
        }
        if (transactionType != "INCOME" && transactionType != "EXPENSE")
        {
            throw new ArgumentException("Invalid transaction type. Must be 'INCOME' or 'EXPENSE'.");
        }
    }

    private static void ApplyTransactionBalance(Account account, decimal amount, string type)
    {
        if (type == "INCOME")
        {
            account.Balance += amount;
        }
        else
        {
            if (account.Balance < amount)
            {
                throw new InvalidOperationException("Insufficient balance for the transaction.");
            }
            account.Balance -= amount;
        }

        account.UpdatedAt = DateTime.UtcNow;
    }

    private static void ReverseTransactionBalance(Account account, decimal amount, string type)
    {
        if (type == "INCOME")
        {
            if (account.Balance < amount)
            {
                throw new InvalidOperationException("Insufficient balance to reverse the transaction.");
            }
            account.Balance -= amount;
        }
        else
        {
            account.Balance += amount;
        }

        account.UpdatedAt = DateTime.UtcNow;
    }

    private static string NormalizeType(string type)
    {
        return type.Trim().ToUpperInvariant();
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
    }

    private static TransactionDto MapToDto(Transaction transaction)
    {
        return new TransactionDto
        {
            Id = transaction.Id,
            Title = transaction.Title,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Date = transaction.Date,
            Notes = NormalizeNotes(transaction.Notes),

            AccountId = transaction.AccountId,
            AccountName = transaction.Account.Name,

            CategoryId = transaction.CategoryId,
            CategoryName = transaction.Category.Name,

            CreatedAt = transaction.CreatedAt
        };
    }
}
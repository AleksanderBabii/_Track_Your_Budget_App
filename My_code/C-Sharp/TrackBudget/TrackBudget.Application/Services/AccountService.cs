using TrackBudget.Application.DTOs.Accounts;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class AccountService : IAccountService
{
    private readonly IAccountRepository _accountRepository;

    public AccountService(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

    public async Task<IReadOnlyCollection<AccountDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var accounts = await _accountRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        return accounts
            .Select(MapToDto)
            .ToList();
    }

    public async Task<List<AccountDto>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var accounts = await _accountRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        return accounts
            .Select(MapToDto)
            .ToList();
    }

    public async Task<AccountDto?> GetByIdAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var account = await GetOwnedAccountAsync(
            accountId,
            userId,
            cancellationToken
        );

        return MapToDto(account);
    }

    public async Task<AccountDto> CreateAsync(
        CreateAccountDto dto,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var account = new Account
        {
            Name = dto.Name.Trim(),
            Balance = dto.InitialBalance,
            Currency = dto.Currency.Trim().ToUpperInvariant(),
            UserId = userId
        };

        await _accountRepository.AddAsync(
            account,
            cancellationToken
        );

        await _accountRepository.SaveChangesAsync(
            cancellationToken
        );

        return MapToDto(account);
    }

    public async Task<AccountDto?> UpdateAsync(
        Guid accountId,
        UpdateAccountDto dto,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var account = await GetOwnedAccountAsync(
            accountId,
            userId,
            cancellationToken
        );

        account.Name = dto.Name.Trim();
        account.Currency = dto.Currency.Trim().ToUpperInvariant();
        account.UpdatedAt = DateTime.UtcNow;

        await _accountRepository.SaveChangesAsync(
            cancellationToken
        );

        return MapToDto(account);
    }

    public async Task<bool> DeleteAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var account = await GetOwnedAccountAsync(
            accountId,
            userId,
            cancellationToken
        );

        _accountRepository.Remove(account, cancellationToken);

        await _accountRepository.SaveChangesAsync(
            cancellationToken
        );

        return true;
    }

    private async Task<Account> GetOwnedAccountAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken
    )
    {
        var account = await _accountRepository.GetByIdAsync(
            accountId,
            userId,
            cancellationToken
        );

        if (account is null)
        {
            throw new KeyNotFoundException("Account not found.");
        }

        return account;
    }

    private static AccountDto MapToDto(Account account)
    {
        return new AccountDto
        {
            Id = account.Id,
            Name = account.Name,
            Balance = account.Balance,
            Currency = account.Currency,
            CreatedAt = account.CreatedAt
        };
    }
}
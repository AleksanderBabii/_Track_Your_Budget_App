using MapsterMapper;

using TrackBudget.Application.Exceptions;
using TrackBudget.Application.DTOs.Accounts;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;

using TrackBudget.Application.Interfaces.Persistence;

using TrackBudget.Domain.Entities;


namespace TrackBudget.Application.Services;

public class AccountService(
    IAccountRepository accountRepository , 
    IMapper mapper, 
    IUnitOfWork unitOfWork
) : IAccountService
{
    public async Task<IReadOnlyCollection<AccountDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        // All reads are user-scoped to keep accounts isolated per owner.
        var accounts = await accountRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        return mapper.Map<List<AccountDto>>(accounts);
    }

    public async Task<List<AccountDto>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var accounts = await accountRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        return mapper.Map<List<AccountDto>>(accounts);
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

        return mapper.Map<AccountDto>(account);
    }

    public async Task<AccountDto> CreateAsync(
        CreateAccountDto dto,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        // Initial balance is applied at creation and owned by current user.
        var account = new Account
        {
            Name = dto.Name.Trim(),
            Balance = dto.InitialBalance,
            Currency = dto.Currency,
            UserId = userId
        };

        await accountRepository.AddAsync(
            account,
            cancellationToken
        );

        await unitOfWork.SaveChangesAsync(
            cancellationToken
        );

        return mapper.Map<AccountDto>(account);
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
        account.Currency = dto.Currency;
        account.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(
            cancellationToken
        );

        return mapper.Map<AccountDto>(account);
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

        accountRepository.Remove(account, cancellationToken);

        await unitOfWork.SaveChangesAsync(
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
        // Centralized ownership guard reused by get/update/delete operations.
        var account = await accountRepository.GetByIdAsync(
            accountId,
            userId,
            cancellationToken
        );

        if (account is null)
        {
            throw new NotFoundException("Account not found.");
        }

        return account;
    }
}
using MapsterMapper;
using TrackBudget.Application.DTOs.Accounts;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Applicatioin.Exceptions;
using TrackBudget.Domain.Entities;
using TrackBudget.Aplication.Exceptions;

namespace TrackBudget.Application.Services;

public class AccountService(IAccountRepository accountRepository, IMapper mapper) : IAccountService
{
    private readonly IAccountRepository _accountRepository = accountRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<IReadOnlyCollection<AccountDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var accounts = await _accountRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        return _mapper.Map<List<AccountDto>>(accounts);
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

        return _mapper.Map<List<AccountDto>>(accounts);
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

        return _mapper.Map<AccountDto>(account);
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
            Currency = dto.Currency,
            UserId = userId
        };

        await _accountRepository.AddAsync(
            account,
            cancellationToken
        );

        await _accountRepository.SaveChangesAsync(
            cancellationToken
        );

        return _mapper.Map<AccountDto>(account);
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

        await _accountRepository.SaveChangesAsync(
            cancellationToken
        );

        return _mapper.Map<AccountDto>(account);
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
            throw new NotFoundException("Account not found.");
        }

        return account;
    }
}
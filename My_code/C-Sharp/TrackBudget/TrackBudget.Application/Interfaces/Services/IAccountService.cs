using TrackBudget.Application.DTOs.Accounts;

namespace TrackBudget.Application.Interfaces.Services;

public interface IAccountService
{
    Task<IReadOnlyCollection<AccountDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<AccountDto>> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<AccountDto?> GetByIdAsync(Guid accountId, Guid userId, CancellationToken cancellationToken = default);

    Task<AccountDto> CreateAsync(CreateAccountDto createAccountDto, Guid userId, CancellationToken cancellationToken = default);

    Task<AccountDto?> UpdateAsync(Guid accountId, UpdateAccountDto updateAccountDto, Guid userId, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid accountId, Guid userId, CancellationToken cancellationToken = default);
}
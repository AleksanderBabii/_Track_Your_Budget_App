using MapsterMapper;

using TrackBudget.Application.DTOs.Transfers;
using TrackBudget.Application.Exceptions;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Interfaces.Persistence;

using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class TransferService(
    ITransferRepository transferRepository,
    IAccountRepository accountRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork
) : ITransferService
{
    public async Task<IReadOnlyCollection<TransferDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var transfers =
            await transferRepository.GetAllByUserIdAsync(
                userId,
                cancellationToken
            );

        return mapper.Map<List<TransferDto>>(transfers);
    }

    public async Task<TransferDto> GetByIdAsync(
        Guid transferId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var transfer = await transferRepository.GetByIdAsync(
            transferId,
            userId,
            cancellationToken
        );

        if (transfer is null)
        {
            throw new NotFoundException(
                "Transfer not found."
            );
        }

        return mapper.Map<TransferDto>(transfer);
    }

    public async Task<TransferDto> CreateAsync(
        Guid userId,
        CreateTransferDto dto,
        CancellationToken cancellationToken = default
    )
    {
        // Both accounts must belong to current user.
        var fromAccount =
            await accountRepository.GetTrackedByIdAsync(
                dto.FromAccountId,
                userId,
                cancellationToken
            );

        if (fromAccount is null)
        {
            throw new NotFoundException(
                "Source account not found."
            );
        }

        var toAccount =
            await accountRepository.GetTrackedByIdAsync(
                dto.ToAccountId,
                userId,
                cancellationToken
            );

        if (toAccount is null)
        {
            throw new NotFoundException(
                "Destination account not found."
            );
        }

        if (fromAccount.Currency != toAccount.Currency)
        {
            // Currency conversion is intentionally unsupported at this stage.
            throw new BusinessRuleException(
                "Transfers between different currencies are not supported yet."
            );
        }

        if (fromAccount.Balance < dto.Amount)
        {
            // Prevent overdraft on source account.
            throw new BusinessRuleException(
                "The source account does not have enough funds."
            );
        }

        // Transfer moves value atomically by updating both account balances.
        fromAccount.Balance -= dto.Amount;
        toAccount.Balance += dto.Amount;

        fromAccount.UpdatedAt = DateTime.UtcNow;
        toAccount.UpdatedAt = DateTime.UtcNow;

        var transfer = new Transfer
        {
            Amount = dto.Amount,
            Date = dto.Date.ToUniversalTime(),
            Notes = NormalizeNotes(dto.Notes),
            UserId = userId,

            FromAccountId = fromAccount.Id,
            FromAccount = fromAccount,

            ToAccountId = toAccount.Id,
            ToAccount = toAccount
        };

        await transferRepository.AddAsync(
            transfer,
            cancellationToken
        );

        await unitOfWork.SaveChangesAsync(
            cancellationToken
        );

        return mapper.Map<TransferDto>(transfer);
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes)
            ? null
            : notes.Trim();
    }
}
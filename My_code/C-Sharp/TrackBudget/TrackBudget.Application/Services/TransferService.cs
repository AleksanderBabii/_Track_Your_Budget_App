using MapsterMapper;

using TrackBudget.Application.DTOs.Transfers;
using TrackBudget.Application.Exceptions;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;

using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Services;

public class TransferService(
        ITransferRepository transferRepository,
        IAccountRepository accountRepository,
        IMapper mapper
    ) : ITransferService
{
    private readonly ITransferRepository _transferRepository = transferRepository;
    private readonly IAccountRepository _accountRepository = accountRepository;
    private readonly IMapper _mapper = mapper;
    public async Task<IReadOnlyCollection<TransferDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var transfers =
            await _transferRepository.GetAllByUserIdAsync(
                userId,
                cancellationToken
            );

        return _mapper.Map<List<TransferDto>>(transfers);
    }

    public async Task<TransferDto> GetByIdAsync(
        Guid transferId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var transfer = await _transferRepository.GetByIdAsync(
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

        return _mapper.Map<TransferDto>(transfer);
    }

    public async Task<TransferDto> CreateAsync(
        Guid userId,
        CreateTransferDto dto,
        CancellationToken cancellationToken = default
    )
    {
        var fromAccount =
            await _accountRepository.GetTrackedByIdAsync(
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
            await _accountRepository.GetTrackedByIdAsync(
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
            throw new BusinessRuleException(
                "Transfers between different currencies are not supported yet."
            );
        }

        if (fromAccount.Balance < dto.Amount)
        {
            throw new BusinessRuleException(
                "The source account does not have enough funds."
            );
        }

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

        await _transferRepository.AddAsync(
            transfer,
            cancellationToken
        );

        await _transferRepository.SaveChangesAsync(
            cancellationToken
        );

        return _mapper.Map<TransferDto>(transfer);
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes)
            ? null
            : notes.Trim();
    }
}
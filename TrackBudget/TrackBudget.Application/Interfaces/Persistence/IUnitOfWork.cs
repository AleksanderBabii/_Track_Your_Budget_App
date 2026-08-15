using TrackBudget.Application.Interfaces.Repositories;

namespace TrackBudget.Application.Interfaces.Persistence;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default
    );

    IBudgetRepository BudgetRepository { get; }
    ITransactionRepository TransactionRepository { get; }
    ITransferRepository TransferRepository { get; }
    ICategoryRepository CategoryRepository { get; }
    IUserRepository UserRepository { get; }
    IAccountRepository AccountRepository { get; }
}

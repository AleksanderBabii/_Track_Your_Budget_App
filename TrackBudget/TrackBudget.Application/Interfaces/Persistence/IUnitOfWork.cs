namespace TrackBudget.Application.Interfaces.Persistence;
using TrackBudget.Application.Interfaces.Repositories;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default
    );

    IBudgetRepository BudgetRepository { get; }
    ITransactionRepository TransactionRepository { get; }
    ICategoryRepository CategoryRepository { get; }
    IUserRepository UserRepository { get; }
    IAccountRepository AccountRepository { get; }
}
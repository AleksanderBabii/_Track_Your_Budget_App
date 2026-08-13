using TrackBudget.Application.Interfaces.Persistence;
using TrackBudget.Infrastructure.Data;
using TrackBudget.Infrastructure.Repositories;
using TrackBudget.Application.Interfaces.Repositories;

namespace TrackBudget.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _dbContext;
    public IAccountRepository AccountRepository { get; }
    public ICategoryRepository CategoryRepository { get; }
    public ITransactionRepository TransactionRepository { get; }
    public IUserRepository UserRepository { get; }
    public IBudgetRepository BudgetRepository { get; }
    public ITransferRepository TransferRepository { get; }

    public UnitOfWork(AppDbContext dbContext)
    {
        _dbContext = dbContext;

        AccountRepository = new AccountRepository(dbContext);
        CategoryRepository = new CategoryRepository(dbContext);
        TransactionRepository = new TransactionRepository(dbContext);
        TransferRepository = new TransferRepository(dbContext);
        UserRepository = new UserRepository(dbContext);
        BudgetRepository = new BudgetRepository(dbContext);
    }

    public async Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
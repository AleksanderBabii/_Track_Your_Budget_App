using Microsoft.EntityFrameworkCore;

using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users => Set<User>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Transfer> Transfers => Set<Transfer>();
    public DbSet<Budget> Budgets => Set<Budget>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transfer>()
            .HasOne(transfer => transfer.FromAccount)
            .WithMany(account => account.OutgoingTransfers)
            .HasForeignKey(transfer => transfer.FromAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transfer>()
            .HasOne(transfer => transfer.ToAccount)
            .WithMany(account => account.IncomingTransfers)
            .HasForeignKey(transfer => transfer.ToAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transfer>()
            .HasOne(transfer => transfer.User)
            .WithMany(user => user.Transfers)
            .HasForeignKey(transfer => transfer.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Account>()
            .Property(account => account.Currency)
            .HasConversion(
                currency => currency.ToString().ToUpperInvariant(),
                value => Enum.Parse<Currency>(value, ignoreCase: true)
            );

        modelBuilder.Entity<Category>()
            .Property(category => category.Type)
            .HasConversion(
                type => type.ToString().ToUpperInvariant(),
                value => Enum.Parse<CategoryType>(value, ignoreCase: true)
            );

        modelBuilder.Entity<Transaction>()
            .Property(transaction => transaction.Type)
            .HasConversion(
                type => type.ToString().ToUpperInvariant(),
                value => Enum.Parse<TransactionType>(value, ignoreCase: true)
            );

        modelBuilder.Entity<Budget>()
            .HasOne(budget => budget.User)
            .WithMany(user => user.Budgets)
            .HasForeignKey(budget => budget.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Budget>()
            .HasOne(budget => budget.Category)
            .WithMany(category => category.Budgets)
            .HasForeignKey(budget => budget.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Budget>()
            .HasIndex(budget => new
            {
                budget.UserId,
                budget.CategoryId,
                budget.Month,
                budget.Year
            })
            .IsUnique();
    }
}


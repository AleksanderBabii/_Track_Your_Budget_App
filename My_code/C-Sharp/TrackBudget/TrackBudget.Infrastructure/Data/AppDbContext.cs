using Microsoft.EntityFrameworkCore;
using TrackBudget.Domain.Entities;

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
}

}
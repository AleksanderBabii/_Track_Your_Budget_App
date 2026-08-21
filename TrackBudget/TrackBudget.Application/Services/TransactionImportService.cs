using TrackBudget.Application.DTOs.Imports;
using TrackBudget.Application.DTOs.Transactions;
using TrackBudget.Application.Interfaces.Imports;
using TrackBudget.Application.Interfaces.Persistence;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Services;

public sealed class TransactionImportService(
    IUnitOfWork unitOfWork,
    ICsvParser csvParser,
    ICsvTransactionMapper csvTransactionMapper
) : ITransactionImportService
{
    public async Task<ImportPreviewDto> PreviewAsync(
        Stream fileStream,
        Guid userId,
        Guid accountId,
        CancellationToken cancellationToken = default)
    {
        // 1. Validate account
        var account = await unitOfWork.AccountRepository.GetByIdAsync(
            accountId,
            userId,
            cancellationToken);

        if (account is null)
        {
            throw new InvalidOperationException(
                "The selected account does not exist.");
        }

        // 2. Parse CSV
        var parsedCsv = await csvParser.ParseAsync(
            fileStream,
            cancellationToken);

        var preview = new ImportPreviewDto
        {
            TotalRows = parsedCsv.Rows.Count
        };

        // 3. Map every CSV row
        foreach (var row in parsedCsv.Rows)
        {
            if (!csvTransactionMapper.TryMap(
                    row,
                    out var importedTransaction,
                    out var error))
            {
                preview.InvalidRows++;

                preview.Transactions.Add(
                    new ImportPreviewTransactionDto
                    {
                        RowNumber = row.RowNumber,
                        Error = error
                    });

                continue;
            }

            // 4. Determine transaction type
            var transactionType =
                importedTransaction.Amount >= 0
                    ? TransactionType.Income
                    : TransactionType.Expense;

            var absoluteAmount =
                Math.Abs(importedTransaction.Amount);

            // 5. Try to find category
            var category = await FindCategoryAsync(
                userId,
                transactionType,
                importedTransaction.Title,
                cancellationToken);

            // 6. Check duplicate
            var isDuplicate =
                await unitOfWork.TransactionRepository.ExistsAsync(
                    userId,
                    accountId,
                    importedTransaction.Date,
                    absoluteAmount,
                    transactionType,
                    importedTransaction.Title,
                    cancellationToken);

            if (isDuplicate)
            {
                preview.DuplicateRows++;
            }

            preview.ValidRows++;

            preview.Transactions.Add(
                new ImportPreviewTransactionDto
                {
                    RowNumber = row.RowNumber,
                    Date = importedTransaction.Date,
                    Title = importedTransaction.Title,
                    Amount = absoluteAmount,
                    Type = transactionType,
                    Notes = importedTransaction.Notes,

                    CategoryId = category?.Id,
                    CategoryName = category?.Name,

                    IsDuplicate = isDuplicate
                });
        }

        return preview;
    }

    public async Task<List<TransactionDto>> ConfirmAsync(
        ConfirmImportDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        // Validate account first
        var account = await unitOfWork.AccountRepository.GetByIdAsync(
            request.AccountId,
            userId,
            cancellationToken);

        if (account is null)
        {
            throw new InvalidOperationException(
                "The selected account does not exist.");
        }

        var createdTransactions = new List<TransactionDto>();

        foreach (var imported in request.Transactions)
        {
            var type =
                imported.Amount >= 0
                    ? TransactionType.Income
                    : TransactionType.Expense;

            var amount = Math.Abs(imported.Amount);

            if (imported.CategoryId == Guid.Empty)
            {
                continue;
            }

            var category =
                await unitOfWork.CategoryRepository.GetByIdAsync(
                    imported.CategoryId,
                    userId,
                    cancellationToken);

            if (category is null)
            {
                continue;
            }

            var exists =
                await unitOfWork.TransactionRepository.ExistsAsync(
                    userId,
                    request.AccountId,
                    imported.Date,
                    amount,
                    type,
                    imported.Title,
                    cancellationToken);

            if (exists)
            {
                continue;
            }

            var transaction = new Transaction
            {
                UserId = userId,
                AccountId = request.AccountId,
                CategoryId = category.Id,

                Title = imported.Title,
                Amount = amount,
                Type = type,
                Date = imported.Date,
                Notes = imported.Notes,

                Source = TransactionSource.CsvImport
            };

            await unitOfWork.TransactionRepository.AddAsync(
                transaction,
                cancellationToken);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return createdTransactions;
    }

    private async Task<Category?> FindCategoryAsync(
        Guid userId,
        TransactionType transactionType,
        string title,
        CancellationToken cancellationToken)
    {
        var categories =
            await unitOfWork.CategoryRepository.GetAllByUserIdAsync(
                userId,
                cancellationToken);

        var categoryType =
            transactionType == TransactionType.Income
                ? CategoryType.Income
                : CategoryType.Expense;

        var normalizedTitle = title.Trim().ToLowerInvariant();

        return categories
            .Where(category => category.Type == categoryType)
            .FirstOrDefault(category =>
                normalizedTitle.Contains(
                    category.Name.Trim().ToLowerInvariant()));
    }

    private static TransactionDto MapToDto(
        Transaction transaction,
        Account account,
        Category category)
    {
        return new TransactionDto
        {
            Id = transaction.Id,
            Title = transaction.Title,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Date = transaction.Date,
            Notes = transaction.Notes,

            AccountId = account.Id,
            AccountName = account.Name,

            CategoryId = category.Id,
            CategoryName = category.Name,

            CreatedAt = transaction.CreatedAt,
            Source = transaction.Source,
        };
    }
}
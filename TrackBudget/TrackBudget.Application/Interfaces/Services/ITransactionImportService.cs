using TrackBudget.Application.DTOs.Imports;
using TrackBudget.Application.DTOs.Transactions;

namespace TrackBudget.Application.Interfaces.Services;

public interface ITransactionImportService
{
    Task<ImportPreviewDto> PreviewAsync(
        Stream fileStream,
        Guid userId,
        Guid accountId,
        CancellationToken cancellationToken = default);

    Task<List<TransactionDto>> ConfirmAsync(
        ConfirmImportDto request,
        Guid userId,
        CancellationToken cancellationToken = default);
} 
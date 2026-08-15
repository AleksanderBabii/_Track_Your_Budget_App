using TrackBudget.Application.DTOs.Reports;

namespace TrackBudget.Application.Interfaces.Services;

public interface IReportService
{
    Task<ReportDto> GetReportAsync(Guid userId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
}
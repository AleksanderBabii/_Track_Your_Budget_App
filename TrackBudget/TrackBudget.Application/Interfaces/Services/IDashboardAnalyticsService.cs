using TrackBudget.Application.DTOs.Dashboard;
namespace TrackBudget.Application.Interfaces.Services;

public interface IDashboardAnalyticsService
{
    Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(Guid userId, CancellationToken cancellationToken = default);
}


using TrackBudget.Application.DTOs.Dashboard;

namespace TrackBudget.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardDataAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );
}
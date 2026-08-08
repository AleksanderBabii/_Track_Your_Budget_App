using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using System.Security.Claims;

using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService dashboardService;

    private readonly IDashboardAnalyticsService dashboardAnalyticsService;

    public DashboardController(IDashboardService dashboardService, IDashboardAnalyticsService dashboardAnalyticsService)
    {
        this.dashboardService = dashboardService;
        this.dashboardAnalyticsService = dashboardAnalyticsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardData(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var dashboardData = await dashboardService.GetDashboardDataAsync(userId, cancellationToken);

        return Ok(dashboardData);
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetDashboardAnalytics(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var dashboardAnalytics = await dashboardAnalyticsService.GetDashboardAnalyticsAsync(userId, cancellationToken);

        return Ok(dashboardAnalytics);
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;   
using Microsoft.AspNetCore.Mvc;

using TrackBudget.Application.DTOs.Reports;
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/reports")] 
public class ReportController( IReportService reportService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ReportDto>> GetReportAsync(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdValue == null ||
            !Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var report = await reportService.GetReportAsync(userId, from, to, cancellationToken);
        return Ok(report);
    }
}
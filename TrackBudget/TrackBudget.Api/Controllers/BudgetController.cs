using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.DTOs.BudgetDto;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/budgets")]
public class BudgetController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet("{budgetId:guid}")]
    public async Task<ActionResult<BudgetDto>> GetById(Guid budgetId, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var budget = await _budgetService.GetBudgetByIdAsync(budgetId, userId, cancellationToken);

        return Ok(budget);
    }

    [HttpGet]
    public async Task<ActionResult<List<BudgetDto>>> GetByUserId(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var budgets = await _budgetService.GetBudgetByUserIdAsync(userId, cancellationToken);

        return Ok(budgets);
    }

    [HttpPost]
    public async Task<ActionResult<BudgetDto>> Create(CreateBudgetDto budgetDto, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var createdBudget = await _budgetService.CreateBudgetAsync(budgetDto, userId, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { budgetId = createdBudget.Id }, createdBudget);
    }

    [HttpPut("{budgetId:guid}")]
    public async Task<IActionResult> Update(Guid budgetId, UpdateBudgetDto budgetDto, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        await _budgetService.UpdateBudgetAsync(budgetDto, userId, budgetId, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{budgetId:guid}")]
    public async Task<IActionResult> Delete(Guid budgetId, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        await _budgetService.DeleteBudgetAsync(budgetId, userId, cancellationToken);

        return NoContent();
    }
    
}
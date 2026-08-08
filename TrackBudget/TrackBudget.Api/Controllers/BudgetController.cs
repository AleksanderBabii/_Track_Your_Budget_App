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
        var budget = await _budgetService.GetBudgetByIdAsync(budgetId, cancellationToken);

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

        var budgets = await _budgetService.GetBudgetsByUserIdAsync(userId, cancellationToken);

        return Ok(budgets);
    }

    [HttpPost]
    public async Task<ActionResult<BudgetDto>> Create(BudgetDto budgetDto, CancellationToken cancellationToken)
    {
        var createdBudget = await _budgetService.CreateBudgetAsync(budgetDto, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { budgetId = createdBudget.Id }, createdBudget);
    }

    [HttpPut("{budgetId:guid}")]
    public async Task<IActionResult> Update(Guid budgetId, BudgetDto budgetDto, CancellationToken cancellationToken)
    {
        if (budgetId != budgetDto.Id)
        {
            return BadRequest("Budget ID mismatch.");
        }

        await _budgetService.UpdateBudgetAsync(budgetDto, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{budgetId:guid}")]
    public async Task<IActionResult> Delete(Guid budgetId, CancellationToken cancellationToken)
    {
        await _budgetService.DeleteBudgetAsync(budgetId, cancellationToken);

        return NoContent();
    }
    
}
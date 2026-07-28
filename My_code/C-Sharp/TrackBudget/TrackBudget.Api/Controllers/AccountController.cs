using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using TrackBudget.Application.DTOs.Accounts;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Exceptions;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/accounts")]

public class AccountController(IAccountService accountService) : ControllerBase
{
    private readonly IAccountService _accountService = accountService;

    // Every account endpoint is user-scoped; this extracts the authenticated user id
    // from JWT claims and ensures it is a valid Guid.
    private Guid GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedException("Invalid user ID claim.");
        }

        return userId;
    }
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<AccountDto>>> GetAllAsync(
        CancellationToken cancellationToken = default
    )
    {
        // Return only accounts owned by the current user.
        var userId = GetUserIdFromClaims();
        var accounts = await _accountService.GetAllAsync(userId, cancellationToken);
        return Ok(accounts);
    }

    [HttpGet("{accountId:guid}")]
    public async Task<ActionResult<AccountDto>> GetByIdAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        var userId = GetUserIdFromClaims();
        var account = await _accountService.GetByIdAsync(accountId, userId, cancellationToken);

        return Ok(account);
    }

    [HttpPost]
    public async Task<ActionResult<AccountDto>> CreateAsync(CreateAccountDto createAccountDto, CancellationToken cancellationToken = default)
    {
        // Create under current user ownership and return canonical REST location.
        // Using Created(...) avoids runtime route-resolution failures from CreatedAtAction.
        var userId = GetUserIdFromClaims();
        var account = await _accountService.CreateAsync(createAccountDto, userId, cancellationToken);
        return Created($"/api/accounts/{account.Id}", account);
    }

    [HttpPut("{accountId:guid}")]
    public async Task<ActionResult<AccountDto>> UpdateAsync(Guid accountId, UpdateAccountDto updateAccountDto, CancellationToken cancellationToken = default)
    {
        var userId = GetUserIdFromClaims();
        var account = await _accountService.UpdateAsync(accountId, updateAccountDto, userId, cancellationToken);
        return Ok(account);
    }

    [HttpDelete("{accountId:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        await _accountService.DeleteAsync(accountId, GetUserIdFromClaims(), cancellationToken);

        return NoContent();
    }
}
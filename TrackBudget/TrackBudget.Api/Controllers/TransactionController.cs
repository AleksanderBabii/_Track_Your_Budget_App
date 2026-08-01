using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackBudget.Application.DTOs.Transactions;
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(
        ITransactionService transactionService
    )
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<
        ActionResult<IReadOnlyCollection<TransactionDto>>
    > GetAll(
        CancellationToken cancellationToken
    )
    {
        var transactions =
            await _transactionService.GetAllAsync(
                GetCurrentUserId(),
                cancellationToken
            );

        return Ok(transactions);
    }

    [HttpGet("{transactionId:guid}")]
    public async Task<ActionResult<TransactionDto>> GetById(
        Guid transactionId,
        CancellationToken cancellationToken
    )
    {
        var transaction =
            await _transactionService.GetByIdAsync(
                transactionId,
                GetCurrentUserId(),
                cancellationToken
            );

        return Ok(transaction);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create(
        CreateTransactionDto dto,
        CancellationToken cancellationToken
    )
    {
        var transaction =
            await _transactionService.CreateAsync(
                GetCurrentUserId(),
                dto,
                cancellationToken
            );

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                transactionId = transaction.Id
            },
            transaction
        );
    }

    [HttpPut("{transactionId:guid}")]
    public async Task<ActionResult<TransactionDto>> Update(
        Guid transactionId,
        UpdateTransactionDto dto,
        CancellationToken cancellationToken
    )
    {
        var transaction =
            await _transactionService.UpdateAsync(
                transactionId,
                GetCurrentUserId(),
                dto,
                cancellationToken
            );

        return Ok(transaction);
    }

    [HttpDelete("{transactionId:guid}")]
    public async Task<IActionResult> Delete(
        Guid transactionId,
        CancellationToken cancellationToken
    )
    {
        await _transactionService.DeleteAsync(
            transactionId,
            GetCurrentUserId(),
            cancellationToken
        );

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            throw new UnauthorizedAccessException(
                "Invalid authentication token."
            );
        }

        return parsedUserId;
    }
}
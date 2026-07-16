using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackBudget.Application.DTOs.Transfers;
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transfers")]
public class TransfersController : ControllerBase
{
    private readonly ITransferService _transferService;

    public TransfersController(
        ITransferService transferService
    )
    {
        _transferService = transferService;
    }

    [HttpGet]
    public async Task<
        ActionResult<IReadOnlyCollection<TransferDto>>
    > GetAll(
        CancellationToken cancellationToken
    )
    {
        var transfers = await _transferService.GetAllAsync(
            GetCurrentUserId(),
            cancellationToken
        );

        return Ok(transfers);
    }

    [HttpGet("{transferId:guid}")]
    public async Task<ActionResult<TransferDto>> GetById(
        Guid transferId,
        CancellationToken cancellationToken
    )
    {
        var transfer = await _transferService.GetByIdAsync(
            transferId,
            GetCurrentUserId(),
            cancellationToken
        );

        return Ok(transfer);
    }

    [HttpPost]
    public async Task<ActionResult<TransferDto>> Create(
        CreateTransferDto dto,
        CancellationToken cancellationToken
    )
    {
        var transfer = await _transferService.CreateAsync(
            GetCurrentUserId(),
            dto,
            cancellationToken
        );

        return CreatedAtAction(
            nameof(GetById),
            new { transferId = transfer.Id },
            transfer
        );
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
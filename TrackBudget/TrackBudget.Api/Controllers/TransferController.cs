using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackBudget.Application.DTOs.Transfers;
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transfers")]

public class TransferController(ITransferService transferService) : ControllerBase
{
    private readonly ITransferService _transferService = transferService; 

    [HttpGet]
    public async Task<
        ActionResult<IReadOnlyCollection<TransferDto>>
    > GetAll(
        CancellationToken cancellationToken
    )
    {
        var transfers =
            await _transferService.GetAllByUserIdAsync(
                userId: GetCurrentUserId(),
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
        var transfer =
            await _transferService.GetByIdAsync(
                transferId,
                userId: GetCurrentUserId(),
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
        var transfer =
            await _transferService.CreateAsync(
                userId: GetCurrentUserId(),
                dto,
                cancellationToken
            );

        return Ok(transfer);
    }
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            throw new UnauthorizedAccessException(
                "User ID claim not found in the token."
            );
        }

        return Guid.Parse(userIdClaim.Value);
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using TrackBudget.Application.DTOs.Imports;
using TrackBudget.Application.DTOs.Transactions; 
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transactions/import")]
public class TransactionImportController(
    ITransactionImportService transactionImportService
) : ControllerBase
{
    [HttpPost("preview")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ImportPreviewDto>> PreviewImport(
        IFormFile file,
        [FromForm] Guid accountId,
        CancellationToken cancellationToken = default
    )
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }
        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only CSV files are supported.");
        }

        var userId = GetUserId();
        
        await using var stream = file.OpenReadStream();

        var result = await transactionImportService.PreviewAsync(
            stream,
            userId,
            accountId,
            cancellationToken);

        return Ok(result);
    }

    [HttpPost("confirm")]
    public async Task<ActionResult<List<TransactionDto>>> ConfirmImportTransactions(
        [FromBody] ConfirmImportDto confirmImportDto,
        CancellationToken cancellationToken = default
    )
    {
        var userId = GetUserId();

        var result = await transactionImportService.ConfirmAsync(
            confirmImportDto,
            userId,
            cancellationToken);

        return Ok(result);
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException(
                "User ID claim is missing or invalid.");
        }

        return userId;
    }
}
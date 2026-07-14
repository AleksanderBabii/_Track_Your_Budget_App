using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackBudget.Application.DTOs.Categories;
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(
        ICategoryService categoryService
    )
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<
        ActionResult<IReadOnlyCollection<CategoryDto>>
    > GetAll(
        CancellationToken cancellationToken
    )
    {
        var categories = await _categoryService.GetAllAsync(
            GetCurrentUserId(),
            cancellationToken
        );

        return Ok(categories);
    }

    [HttpGet("{categoryId:guid}")]
    public async Task<ActionResult<CategoryDto>> GetById(
        Guid categoryId,
        CancellationToken cancellationToken
    )
    {
        var category = await _categoryService.GetByIdAsync(
            categoryId,
            GetCurrentUserId(),
            cancellationToken
        );

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(
        CreateCategoryDto dto,
        CancellationToken cancellationToken
    )
    {
        var category = await _categoryService.CreateAsync(
            GetCurrentUserId(),
            dto,
            cancellationToken
        );

        return CreatedAtAction(
            nameof(GetById),
            new { categoryId = category.Id },
            category
        );
    }

    [HttpPut("{categoryId:guid}")]
    public async Task<ActionResult<CategoryDto>> Update(
        Guid categoryId,
        UpdateCategoryDto dto,
        CancellationToken cancellationToken
    )
    {
        var category = await _categoryService.UpdateAsync(
            categoryId,
            GetCurrentUserId(),
            dto,
            cancellationToken
        );

        return Ok(category);
    }

    [HttpDelete("{categoryId:guid}")]
    public async Task<IActionResult> Delete(
        Guid categoryId,
        CancellationToken cancellationToken
    )
    {
        await _categoryService.DeleteAsync(
            categoryId,
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
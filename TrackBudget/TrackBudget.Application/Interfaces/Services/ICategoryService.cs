using TrackBudget.Application.DTOs.Categories;

namespace TrackBudget.Application.Interfaces.Services;

public interface ICategoryService
{
    Task<IReadOnlyCollection<CategoryDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<CategoryDto> GetByIdAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<CategoryDto> CreateAsync(
        Guid userId,
        CreateCategoryDto dto,
        CancellationToken cancellationToken = default
    );

    Task<CategoryDto> UpdateAsync(
        Guid categoryId,
        Guid userId,
        UpdateCategoryDto dto,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken = default
    );
}
using TrackBudget.Application.DTOs.Categories;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class CategoryService(
    ICategoryRepository categoryRepository
) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;

    public async Task<IReadOnlyCollection<CategoryDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var categories =
            await _categoryRepository.GetAllByUserIdAsync(
                userId,
                cancellationToken
            );

        return [.. categories.Select(MapToDto)];
    }

    public async Task<CategoryDto> GetByIdAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var category = await GetOwnedCategoryAsync(
            categoryId,
            userId,
            cancellationToken
        );

        return MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(
        Guid userId,
        CreateCategoryDto dto,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(dto);

        var name = dto.Name.Trim();
        var type = NormalizeType(dto.Type);

        var exists = await _categoryRepository.ExistAsync(
            userId,
            name,
            type,
            cancellationToken: cancellationToken
        );

        if (exists)
        {
            throw new InvalidOperationException(
                "A category with this name and type already exists."
            );
        }

        var category = new Category
        {
            Name = name,
            Type = type,
            UserId = userId
        };

        await _categoryRepository.AddAsync(
            category,
            cancellationToken
        );

        await _categoryRepository.SaveChangesAsync(
            cancellationToken
        );

        return MapToDto(category);
    }

    public async Task<CategoryDto> UpdateAsync(
        Guid categoryId,
        Guid userId,
        UpdateCategoryDto dto,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(dto);

        var category = await GetOwnedCategoryAsync(
            categoryId,
            userId,
            cancellationToken
        );

        var name = dto.Name.Trim();
        var type = NormalizeType(dto.Type);

        var exists = await _categoryRepository.ExistAsync(
            userId,
            name,
            type,
            categoryId,
            cancellationToken
        );

        if (exists)
        {
            throw new InvalidOperationException(
                "A category with this name and type already exists."
            );
        }

        category.Name = name;
        category.Type = type;
        category.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.SaveChangesAsync(
            cancellationToken
        );

        return MapToDto(category);
    }

    public async Task DeleteAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var category = await GetOwnedCategoryAsync(
            categoryId,
            userId,
            cancellationToken
        );

        if (category.Transactions.Count > 0)
        {
            throw new InvalidOperationException(
                "A category used by transactions cannot be deleted."
            );
        }

        _categoryRepository.Remove(category);

        await _categoryRepository.SaveChangesAsync(
            cancellationToken
        );
    }

    private async Task<Category> GetOwnedCategoryAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken
    )
    {
        var category = await _categoryRepository.GetByIdAsync(
            categoryId,
            userId,
            cancellationToken
        );

        return category
            ?? throw new KeyNotFoundException(
                "Category not found."
            );
    }

    private static string NormalizeType(string type)
    {
        return type.Trim().ToUpperInvariant();
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
            CreatedAt = category.CreatedAt
        };
    }
}
using MapsterMapper;

using TrackBudget.Application.DTOs.Categories;
using TrackBudget.Application.Exceptions;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Interfaces.Persistence;

using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Services;

public class CategoryService(
    ICategoryRepository categoryRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork
) : ICategoryService
{

    public async Task<IReadOnlyCollection<CategoryDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var categories =
            await categoryRepository.GetAllByUserIdAsync(
                userId,
                cancellationToken
            );

        return mapper.Map<List<CategoryDto>>(categories);
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

        return mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> CreateAsync(
        Guid userId,
        CreateCategoryDto createCategoryDto,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(createCategoryDto);

        var name = createCategoryDto.Name.Trim();
        var categoryType = ToCategoryType(createCategoryDto.Type);

        var exists = await categoryRepository.ExistAsync(
            userId,
            name,
            categoryType,
            cancellationToken: cancellationToken
        );

        if (exists)
        {
            throw new BusinessRuleException(
                "A category with this name and type already exists."
            );
        }

        var category = new Category
        {
            Name = name,
            Type = categoryType,
            UserId = userId
        };

        await categoryRepository.AddAsync(
            category,
            cancellationToken
        );

        await unitOfWork.SaveChangesAsync(
            cancellationToken
        );

        return mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> UpdateAsync(
        Guid categoryId,
        Guid userId,
        UpdateCategoryDto updateCategoryDto,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(updateCategoryDto);

        var category = await GetOwnedCategoryAsync(
            categoryId,
            userId,
            cancellationToken
        );

        var name = updateCategoryDto.Name.Trim();
        var categoryType = ToCategoryType(updateCategoryDto.Type);

        var exists = await categoryRepository.ExistAsync(
            userId,
            name,
            categoryType,
            categoryId,
            cancellationToken
        );

        if (exists)
        {
            throw new BusinessRuleException(
                "A category with this name and type already exists."
            );
        }

        category.Name = name;
        category.Type = categoryType;
        category.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(
            cancellationToken
        );

        return mapper.Map<CategoryDto>(category);
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
            throw new BusinessRuleException(
                "A category used by transactions cannot be deleted."
            );
        }

        categoryRepository.Remove(category);

        await unitOfWork.SaveChangesAsync(
            cancellationToken
        );
    }

    private async Task<Category> GetOwnedCategoryAsync(
        Guid categoryId,
        Guid userId,
        CancellationToken cancellationToken
    )
    {
        var category = await categoryRepository.GetByIdAsync(
            categoryId,
            userId,
            cancellationToken
        );

        return category
            ?? throw new NotFoundException(
                "Category not found."
            );
    }

    private static CategoryType ToCategoryType(TransactionType transactionType)
    {
        return transactionType switch
        {
            TransactionType.Income => CategoryType.Income,
            TransactionType.Expense => CategoryType.Expense,
            _ => throw new ArgumentOutOfRangeException(nameof(transactionType), "Invalid category type.")
        };
    }
}
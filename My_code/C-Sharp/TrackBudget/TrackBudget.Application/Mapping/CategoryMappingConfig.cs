using Mapster;
using TrackBudget.Application.DTOs.Categories;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Mapping;

public class CategoryMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Category, CategoryDto>();
    }
}
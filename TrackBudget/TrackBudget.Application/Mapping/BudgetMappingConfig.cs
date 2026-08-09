using Mapster;

using TrackBudget.Application.DTOs.BudgetDto;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Mapping;

public class BudgetMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Budget, BudgetDto>()
            .Map(dest => dest.CategoryName, src => src.Category != null ? src.Category.Name : string.Empty);

        config.NewConfig<CreateBudgetDto, Budget>();
        config.NewConfig<UpdateBudgetDto, Budget>();
    }
}
using Mapster;
using TrackBudget.Application.DTOs.Transfers;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Mapping;

public class TransferMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Transfer, TransferDto>()
        .Map(dest => dest.FromAccountName, src => src.FromAccount.Name)
        .Map(dest => dest.ToAccountName, src => src.ToAccount.Name);
    }
}
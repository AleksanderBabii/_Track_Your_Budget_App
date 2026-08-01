using Mapster;
using TrackBudget.Application.DTOs.Accounts;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Mapping;

public class AccountMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Account, AccountDto>();
    }
}
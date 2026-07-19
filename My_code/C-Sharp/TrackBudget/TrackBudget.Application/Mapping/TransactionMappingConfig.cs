using Mapster;
using TrackBudget.Application.DTOs.Transactions;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Mapping;

public class TransactionMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Transaction, TransactionDto>()
        .Map(dest => dest.AccountName, src => src.Account.Name)
        .Map(dest => dest.CategoryName, src => src.Category.Name);
    }
}
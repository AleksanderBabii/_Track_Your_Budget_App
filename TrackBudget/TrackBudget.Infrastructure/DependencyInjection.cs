using Microsoft.Extensions.DependencyInjection;

using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Services;

namespace TrackBudget.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IReportService, ReportService>();

        return services;
    }
}
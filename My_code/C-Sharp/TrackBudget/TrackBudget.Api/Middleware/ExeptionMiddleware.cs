using System.Net;
using System.Text.Json;
using TrackBudget.Api.Middleware;

namespace TrackBudget.Api.Middleware;

public class ExeptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExeptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExeptionMiddleware(RequestDelegate next, ILogger<ExeptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var rootException = exception.GetBaseException();

            var details = _env.IsDevelopment()
                ? $"""
           Root exception: {rootException.Message}

           Exception type: {rootException.GetType().FullName}

           Stack trace:
           {exception.StackTrace}
           """
                : null;

            var response = _env.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, exception.Message, details)
                : new ApiException(context.Response.StatusCode, "Internal Server Error");

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}
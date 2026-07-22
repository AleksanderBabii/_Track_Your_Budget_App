using System.Text.Json;
using TrackBudget.Application.Exceptions;

namespace TrackBudget.Api.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next, 
    ILogger<ExceptionMiddleware> logger, 
    IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

            context.Response.ContentType = "application/json";
            
            var statusCode = exception switch
            {
                AppValidationException => StatusCodes.Status400BadRequest,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                ForbiddenException => StatusCodes.Status403Forbidden,
                NotFoundException => StatusCodes.Status404NotFound,
                BusinessRuleException => StatusCodes.Status409Conflict,
                _ => StatusCodes.Status500InternalServerError  
            };

            context.Response.StatusCode = statusCode;

            var response = env.IsDevelopment()
                ? new ApiException(
                    statusCode, 
                    exception.Message, 
                    exception.StackTrace) 
                : new ApiException(
                    statusCode, 
                    exception.Message);

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}
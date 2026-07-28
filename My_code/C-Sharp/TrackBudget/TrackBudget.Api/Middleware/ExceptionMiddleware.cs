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
            
            // Map domain/application exceptions to consistent HTTP status codes.
            var statusCode = exception switch
            {
                AppValidationException => StatusCodes.Status400BadRequest,
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                ForbiddenException => StatusCodes.Status403Forbidden,
                NotFoundException => StatusCodes.Status404NotFound,
                BusinessRuleException => StatusCodes.Status409Conflict,
                _ => StatusCodes.Status500InternalServerError  
            };

            context.Response.StatusCode = statusCode;

            // Include stack trace details only in development.
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
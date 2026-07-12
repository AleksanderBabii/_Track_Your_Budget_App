using Microsoft.AspNetCore.Mvc;
using TrackBudget.Application.DTOs.Auth;
using TrackBudget.Application.Interfaces.Services;

namespace TrackBudget.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(
        RegisterDto dto, CancellationToken cancellationToken)
    {


        var result = await _authService.RegisterAsync(dto, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, result);


    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(
        LoginDto dto, CancellationToken cancellationToken)
    {

        var result = await _authService.LoginAsync(dto, cancellationToken);

        return Ok(result);


    }
}
using System;
using System.Collections.Generic;
using System.Text;
using TrackBudget.Application.DTOs.Auth;

namespace TrackBudget.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);

    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}

public class AuthResponseDto
{
    
}
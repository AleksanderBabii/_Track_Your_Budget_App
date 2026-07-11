using Microsoft.EntityFrameworkCore;
using TrackBudget.Application.DTOs.Auth;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Entities;
using TrackBudget.Infrastructure.Authentication;
using TrackBudget.Infrastructure.Data;

namespace TrackBudget.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly JwtProvider _jwtProvider;

    public AuthService(
        AppDbContext dbContext,
        JwtProvider jwtProvider)
    {
        _dbContext = dbContext;
        _jwtProvider = jwtProvider;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        var emailExists = await _dbContext.Users
            .AnyAsync(user => user.Email == normalizedEmail);

        if (emailExists)
        {
            throw new InvalidOperationException(
                "A user with this email already exists."
            );
        }

        var user = new User
        {
            Username = dto.Username.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .SingleOrDefaultAsync(user => user.Email == normalizedEmail);

        if (
            user is null ||
            !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)
        )
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password."
            );
        }

        return CreateAuthResponse(user);
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        return new AuthResponseDto
        {
            Token = _jwtProvider.GenerateToken(user),
            Username = user.Username,
            Email = user.Email
        };
    }
}
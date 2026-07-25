using System.ComponentModel.DataAnnotations;

using TrackBudget.Application.DTOs.Auth;
using TrackBudget.Application.Interfaces.Authentication;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Exceptions;
using TrackBudget.Application.Interfaces.Persistence;

using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class AuthService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtProvider jwtProvider,
    IUnitOfWork unitOfWork) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var userName = dto.Username.Trim();
        var normalizedEmail = dto.Email.Trim().ToLower();

        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(normalizedEmail) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new UnauthorizedException("Username, email, and password are required.");
        }

        var existingUser = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (existingUser != null)
        {
            throw new UnauthorizedException("User with this email already exists.");
        }

        var hashedPassword = passwordHasher.HashPassword(dto.Password);
        var user = new User
        {
            Username = userName,
            Email = normalizedEmail,
            PasswordHash = hashedPassword,
            CreatedAt = DateTime.UtcNow
        };

        await userRepository.AddUserAsync(user, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var token = jwtProvider.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            }
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();
        var user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (user == null || !passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        var token = jwtProvider.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            }
        };
    }
}
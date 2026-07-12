using TrackBudget.Application.DTOs.Auth;
using TrackBudget.Application.Interfaces.Authentication;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var userName = dto.Username.Trim();
        var normalizedEmail = dto.Email.Trim().ToLower();

        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(normalizedEmail) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new Exception("Username, email, and password are required.");
        }

        var existingUser = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
        
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists.");
        }

        var hashedPassword = _passwordHasher.HashPassword(dto.Password);
        var user = new User
        {
            Username = userName,
            Email = normalizedEmail,
            PasswordHash = hashedPassword,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddUserAsync(user, cancellationToken);

        var token = _jwtProvider.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();
        var user = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password.");
        }

        var token = _jwtProvider.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }
}
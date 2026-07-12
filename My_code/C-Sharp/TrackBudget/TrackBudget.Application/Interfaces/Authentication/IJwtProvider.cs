using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Interfaces.Authentication;

public interface IJwtProvider
{
    string GenerateToken(User user);
}
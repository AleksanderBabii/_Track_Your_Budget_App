using System;
using System.Collections.Generic;
using System.Text;

namespace TrackBudget.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;

        public UserDto User { get; set; } = default!;
    }

    public class UserDto
    {
        public Guid Id { get; init; }

        public string Username { get; init; } = string.Empty;

        public string Email { get; init; } = string.Empty;
    }
}

using FluentValidation;
using TrackBudget.Application.DTOs.Accounts;

namespace TrackBudget.Application.Validators.Accounts;

public class UpdateAccountValidator : AbstractValidator<UpdateAccountDto>
{
    private static readonly string[] AllowedCurrencies = { "PLN", "USD", "EUR","GBP","UAH","JPY","CHF","CAD","AUD","CNY" };

    public UpdateAccountValidator()
    {
        RuleFor(account => account.Name)
            .NotEmpty()
            .WithMessage("Account name is required.")
            .MinimumLength(3)
            .WithMessage("Account name must be at least 3 characters long.")
            .MaximumLength(50)
            .WithMessage("Account name must be at most 50 characters long.");

        RuleFor(account => account.Currency)
            .NotEmpty()
            .WithMessage("Currency is required.")
            .Must(currency => AllowedCurrencies.Contains(
                currency.Trim().ToUpperInvariant()
            ))
            .WithMessage("Currency is not supported.");
    }
}
using FluentValidation;
using TrackBudget.Application.DTOs.Accounts;

namespace TrackBudget.Application.Validators.Accounts;

public class CreateAccountValidator : AbstractValidator<CreateAccountDto>
{
    private static readonly string[] AllowedCurrencies = { "PLN", "USD", "EUR","GBP","UAH","JPY","CHF","CAD","AUD","CNY" };

    public CreateAccountValidator()
    {
        RuleFor(account => account.Name)
        .NotEmpty()
        .WithMessage("Account name is required.")
        .MinimumLength(3)
        .WithMessage("Account name must be at least 3 characters long.")
        .MaximumLength(50)
        .WithMessage("Account name must be at most 50 characters long.");

        RuleFor(account => account.InitialBalance)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Initial balance must be greater than or equal to 0.");

        RuleFor(account => account.Currency)
            .NotEmpty()
            .WithMessage("Currency is required.")
            .Must(currency => AllowedCurrencies.Contains(
                currency.Trim().ToUpperInvariant()
            ))
            .WithMessage("Currency is not supported.");
    }
}
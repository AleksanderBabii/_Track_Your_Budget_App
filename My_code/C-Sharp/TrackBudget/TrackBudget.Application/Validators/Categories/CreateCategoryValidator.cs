using FluentValidation;
using TrackBudget.Application.DTOs.Categories;

namespace TrackBudget.Application.Validators.Categories;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
    private static readonly string[] AllowedTypes = new[] { "Income", "Expense" };

    public CreateCategoryValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty()
            .MinimumLength(1)
            .WithMessage("Name is required.")
            .MaximumLength(100)
            .WithMessage("Name must not exceed 100 characters.");

        RuleFor(c => c.Type)
            .NotEmpty()
            .WithMessage("Type is required.")
            .Must(type => AllowedTypes.Contains(type.Trim().ToUpperInvariant()))
            .WithMessage("Type must be either 'Income' or 'Expense'.");
    }
}
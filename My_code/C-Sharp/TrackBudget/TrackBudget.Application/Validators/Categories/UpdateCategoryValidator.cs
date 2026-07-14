using FluentValidation;
using TrackBudget.Application.DTOs.Categories;

namespace TrackBudget.Application.Validators.Categories;

public class UpdateCategoryValidator :
    AbstractValidator<UpdateCategoryDto>
{
    private static readonly string[] AllowedTypes = new[]
    {
        "Income",
        "Expense"
    };

    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(3)
            .WithMessage("Name must be at least 3 characters long.")
            .MaximumLength(50)
            .WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Type)
            .NotEmpty()
            .Must(type => AllowedTypes.Contains(type.Trim().ToUpperInvariant()))
            .WithMessage("Type must be either 'Income' or 'Expense'.");
    }
}
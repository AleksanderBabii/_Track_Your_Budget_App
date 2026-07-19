using FluentValidation;
using TrackBudget.Application.DTOs.Categories;

namespace TrackBudget.Application.Validators.Categories;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{

    public CreateCategoryValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty()
            .MinimumLength(1)
            .WithMessage("Name is required.")
            .MaximumLength(100)
            .WithMessage("Name must not exceed 100 characters.");

        RuleFor(c => c.Type)
            .IsInEnum()
            .WithMessage("Type must be either 'Income' or 'Expense'.");
    }
}
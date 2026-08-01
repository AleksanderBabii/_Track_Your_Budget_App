using FluentValidation;
using TrackBudget.Application.DTOs.Categories;

namespace TrackBudget.Application.Validators.Categories;

public class UpdateCategoryValidator :
    AbstractValidator<UpdateCategoryDto>
{

    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(3)
            .WithMessage("Name must be at least 3 characters long.")
            .MaximumLength(50)
            .WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Type must be either 'Income' or 'Expense'.");
    }
}
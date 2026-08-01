using FluentValidation;
using TrackBudget.Application.DTOs.Transactions;

namespace TrackBudget.Application.Validators.Transactions;

public class CreateTransactionValidator : AbstractValidator<CreateTransactionDto>
{
    public CreateTransactionValidator()
    {
        RuleFor(tr => tr.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

        RuleFor(tr => tr.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.");

        RuleFor(tr => tr.Type)
            .IsInEnum().WithMessage("Type is required.")
            .WithMessage("Type must be either 'Income' or 'Expense'.");

        RuleFor(tr => tr.Date)
            .LessThanOrEqualTo(DateTime.Now).WithMessage("Date cannot be in the future.");

        RuleFor(tr => tr.AccountId)
            .NotEmpty().WithMessage("AccountId is required.");

        RuleFor(tr => tr.CategoryId)
            .NotEmpty().WithMessage("CategoryId is required.");

        RuleFor(tr => tr.Notes)
        .MaximumLength(500).WithMessage("Notes must not exceed 500 characters.");
    }
}
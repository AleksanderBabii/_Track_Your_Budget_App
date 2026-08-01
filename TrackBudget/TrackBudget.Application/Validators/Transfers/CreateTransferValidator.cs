using FluentValidation;
using TrackBudget.Application.DTOs.Transfers;

namespace TrackBudget.Application.Validators.Transfers;

public class CreateTransferValidator
    : AbstractValidator<CreateTransferDto>
{
    public CreateTransferValidator()
    {
        RuleFor(transfer => transfer.Amount)
            .GreaterThan(0);

        RuleFor(transfer => transfer.Date)
            .NotEmpty();

        RuleFor(transfer => transfer.FromAccountId)
            .NotEmpty();

        RuleFor(transfer => transfer.ToAccountId)
            .NotEmpty();

        RuleFor(transfer => transfer)
            .Must(transfer =>
                transfer.FromAccountId != transfer.ToAccountId
            )
            .WithMessage(
                "Source and destination accounts must be different."
            );

        RuleFor(transfer => transfer.Notes)
            .MaximumLength(500)
            .WithMessage("Notes cannot exceed 500 characters.");
    }
}
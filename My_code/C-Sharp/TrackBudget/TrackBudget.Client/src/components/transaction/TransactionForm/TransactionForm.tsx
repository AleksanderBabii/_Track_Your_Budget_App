import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../../common/Input/Input";
import { Textarea } from "../../common/Textarea/Textarea";
import { Button } from "../../common/Button/Button";

import { AccountSelect } from "../../common/AccountSelect";
import { CategorySelect } from "../../common/CategorySelect";

import {
    transactionSchema,
    type TransactionFormValues,
} from "../../../utils/transactionSchema";

import styles from "./TransactionForm.module.scss";

interface TransactionFormProps {
    defaultValues?: Partial<TransactionFormValues>;

    isSubmitting?: boolean;

    submitLabel?: string;

    onCancel: () => void;

    onSubmit: (
        values: TransactionFormValues
    ) => Promise<void> | void;
}

export function TransactionForm({
    defaultValues,
    isSubmitting = false,
    submitLabel = "Save",
    onCancel,
    onSubmit,
}: TransactionFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),

        defaultValues: {
            title: defaultValues?.title ?? "",
            amount: defaultValues?.amount ?? 0,
            accountId: defaultValues?.accountId ?? "",
            categoryId: defaultValues?.categoryId ?? "",
            date: defaultValues?.date ?? new Date(),
            notes: defaultValues?.notes ?? "",
        },
    });

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <Input
                label="Title"
                placeholder="Groceries"
                error={errors.title?.message}
                disabled={isSubmitting}
                required
                autoFocus
                {...register("title")}
            />

            <Input
                type="number"
                label="Amount"
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.amount?.message}
                disabled={isSubmitting}
                required
                {...register("amount", {
                    valueAsNumber: true,
                })}
            />

            <AccountSelect
                control={control}
                name="accountId"
            />

            <CategorySelect
                control={control}
                name="categoryId"
            />

            <Input
                type="date"
                label="Date"
                error={errors.date?.message}
                disabled={isSubmitting}
                required
                {...register("date", {
                    valueAsDate: true,
                })}
            />

            <Textarea
                label="Notes"
                rows={4}
                placeholder="Additional notes (optional)"
                error={errors.notes?.message}
                disabled={isSubmitting}
                {...register("notes")}
            />

            <div className={styles.actions}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
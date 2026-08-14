import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategorySelect } from "../../common/CategorySelect/CategorySelect";
import { Button } from "../../common/Button/Button";
import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";

import {
  budgetSchema,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
  type BudgetFormValues,
} from "../../../utils/budgetSchema";

import styles from "./BudgetForm.module.scss";

interface BudgetFormProps {
  onSubmit: (values: BudgetFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<BudgetFormValues>;
  isEditMode?: boolean;
}

export function BudgetForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Submit",
  defaultValues = {},
}: BudgetFormProps) {
  const currentDate = new Date();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      limit: defaultValues.limit,
      month: defaultValues.month ?? currentDate.getMonth() + 1,
      year: defaultValues.year ?? currentDate.getFullYear(),
      categoryId: defaultValues.categoryId,
    },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <CategorySelect
        control={control}
        name="categoryId"
        label="Category"
        disabled={isSubmitting}
      />

      <Input
        type="string"
        label="Category Name"
        placeholder="Enter category name"
        error={errors.categoryName?.message}
        disabled={isSubmitting}
        required
        {...register("categoryName")}
      />

      <Input
        type="number"
        label="Budget Limit"
        placeholder="Enter budget limit"
        error={errors.limit?.message}
        disabled={isSubmitting}
        required
        min={0.01}
        step={0.01}
        {...register("limit", { valueAsNumber: true })}
      />

      <Select
        label="Month"
        options={MONTH_OPTIONS}
        error={errors.month?.message}
        disabled={isSubmitting}
        showPlaceholder={false}
        required
        {...register("month", { valueAsNumber: true })}
      />

      <Select
        label="Year"
        options={YEAR_OPTIONS}
        error={errors.year?.message}
        disabled={isSubmitting}
        showPlaceholder={false}
        required
        {...register("year", { valueAsNumber: true })}
      />

      <div className={styles.actions}>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

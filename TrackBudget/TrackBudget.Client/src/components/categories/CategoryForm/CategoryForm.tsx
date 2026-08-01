import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../../common/Button/Button";
import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";

import {
  categorySchema,
  categoryTypeValues,
  type CategoryFormValues,
} from "../../../utils/categorySchema";

import styles from "./CategoryForm.module.scss";

const typeOptions = categoryTypeValues.map((type) => ({
  value: type,
  label: type,
}));

interface CategoryFormProps {
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<CategoryFormValues>;
  isEditMode?: boolean;
}

export function CategoryForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Submit",
  defaultValues = {},
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues.name ?? "",
      type: defaultValues.type ?? "Expense",
    },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Category Name"
        placeholder="Enter category name"
        error={errors.name?.message}
        disabled={isSubmitting}
        required
        autoFocus
        {...register("name")}
      />

      <Select
        label="Category Type"
        options={typeOptions}
        error={errors.type?.message}
        disabled={isSubmitting}
        showPlaceholder={false}
        required
        {...register("type")}
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

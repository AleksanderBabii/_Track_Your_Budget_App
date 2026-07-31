import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Select } from "../Select/Select";

import { useCategories } from "../../../hooks/categoryHooks/useCategories";

import type { CategoryType } from "../../../types/category";

interface CategorySelectProps<T extends FieldValues> {
  control: Control<T>;

  name: FieldPath<T>;

  type?: CategoryType;

  label?: string;

  disabled?: boolean;
}

export function CategorySelect<T extends FieldValues>({
  control,
  name,
  type,
  label = "Category",
  disabled,
}: CategorySelectProps<T>) {
  const { data: categories = [], isLoading } = useCategories();

  const filteredCategories = type
    ? categories.filter((category) => category.type === type)
    : categories;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          label={label}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          options={filteredCategories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          placeholder="Choose category"
          error={fieldState.error?.message}
          disabled={disabled || isLoading}
          required
        />
      )}
    />
  );
}

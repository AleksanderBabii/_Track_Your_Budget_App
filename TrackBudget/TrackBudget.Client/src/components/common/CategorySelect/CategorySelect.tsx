import type { ChangeEvent } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Select } from "../Select/Select";

import { useCategories } from "../../../hooks/categoriesHooks/useCategories";

import type { CategoryType } from "../../../types/category";

type SharedProps = {
  type?: CategoryType;
  label?: string;
  disabled?: boolean;
};

type ControlledProps = SharedProps & {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  control?: never;
  name?: never;
};

type FormProps<T extends FieldValues> = SharedProps & {
  control: Control<T>;
  name: FieldPath<T>;
  value?: never;
  onChange?: never;
};

type CategorySelectProps<T extends FieldValues> = ControlledProps | FormProps<T>;

export function CategorySelect<T extends FieldValues>(props: CategorySelectProps<T>) {
  const { data: categories = [], isLoading } = useCategories();

  const filteredCategories = "type" in props && props.type
    ? categories.filter((category) => category.type === props.type)
    : categories;

  if ("control" in props && "name" in props) {
    const { control, name, label = "Category", disabled } = props;
    const fieldName = name as FieldPath<T>;

    return (
      <Controller
        control={control}
        name={fieldName}
        render={({ field, fieldState }) => (
          <Select
            label={label}
            value={field.value ?? ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              field.onChange(e.target.value || null)
            }
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

  const { label = "Category", disabled, value, onChange } = props;
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value || null);
  };

  return (
    <Select
      label={label}
      value={value ?? ""}
      onChange={handleChange}
      options={filteredCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }))}
      placeholder="Choose category"
      disabled={disabled || isLoading}
      required
    />
  );
}

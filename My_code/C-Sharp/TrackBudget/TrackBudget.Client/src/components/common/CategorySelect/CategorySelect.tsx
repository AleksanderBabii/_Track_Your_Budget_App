import { Select } from "../Select/Select";

import { useCategories } from "../../../hooks/useCategories";

import type { CategoryType } from "../../../types/category";

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  type?: CategoryType;
  error?: string;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  type,
  onChange,
  error,
  disabled,
}: CategorySelectProps) {
  const { data: categories = [], isLoading } = useCategories();

  const filteredCategories = type
    ? categories.filter((category) => category.type === type)
    : categories;

  return (
    <Select
      label="Category"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={filteredCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }))}
      placeholder="Select a category"
      error={error}
      disabled={disabled || isLoading}
      required
    />
  );
}

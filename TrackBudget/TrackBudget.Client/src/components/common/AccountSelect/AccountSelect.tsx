import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";

import { Select } from "../Select/Select";

import { useAccounts } from "../../../hooks/accountsHooks/useAccounts";

interface AccountSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  disabled?: boolean;
}

export function AccountSelect<T extends FieldValues>({
  control,
  name,
  label = "Account",
  disabled,
}: AccountSelectProps<T>) {
  const { data: accounts = [], isLoading } = useAccounts();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          label={label}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          options={accounts.map((account) => ({
            value: account.id,
            label: `${account.name} (${account.currency})`,
          }))}
          placeholder={isLoading ? "Loading accounts..." : "Select an account"}
          error={fieldState.error?.message}
          disabled={disabled || isLoading}
          required
        />
      )}
    />
  );
}

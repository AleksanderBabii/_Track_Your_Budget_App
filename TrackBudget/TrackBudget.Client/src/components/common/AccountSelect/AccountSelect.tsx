import type { ChangeEvent } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";

import { Select } from "../Select/Select";

import { useAccounts } from "../../../hooks/accountsHooks/useAccounts";

type SharedProps = {
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

type AccountSelectProps<T extends FieldValues> = ControlledProps | FormProps<T>;

export function AccountSelect<T extends FieldValues>(
  props: AccountSelectProps<T>,
) {
  const { data: accounts = [], isLoading } = useAccounts();

  if ("control" in props && "name" in props) {
    const { control, name, label = "Account", disabled } = props;
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
            options={accounts.map((account) => ({
              value: account.id,
              label: `${account.name} (${account.currency})`,
            }))}
            placeholder={
              isLoading ? "Loading accounts..." : "Select an account"
            }
            error={fieldState.error?.message}
            disabled={disabled || isLoading}
            required
          />
        )}
      />
    );
  }

  const { label = "Account", disabled, value, onChange } = props;
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value || null);
  };

  return (
    <Select
      label={label}
      value={value ?? ""}
      onChange={handleChange}
      options={accounts.map((account) => ({
        value: account.id,
        label: `${account.name} (${account.currency})`,
      }))}
      placeholder={isLoading ? "Loading accounts..." : "Select an account"}
      disabled={disabled || isLoading}
      required
    />
  );
}

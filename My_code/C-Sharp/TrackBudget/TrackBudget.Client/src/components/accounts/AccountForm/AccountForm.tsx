import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../../common/Button/Button";
import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";

import {
  accountSchema,
  currencyValues,
  type AccountFormValues,
} from "../../../utils/accountSchema";

import styles from "./AccountForm.module.scss";

const currencyLabels: Record<(typeof currencyValues)[number], string> = {
  PLN: "PLN - Polish Zloty",
  EUR: "EUR - Euro",
  USD: "USD - United States Dollar",
  GBP: "GBP - British Pound Sterling",
  UAH: "UAH - Ukrainian Hryvnia",
  JPY: "JPY - Japanese Yen",
  CHF: "CHF - Swiss Franc",
  CAD: "CAD - Canadian Dollar",
  AUD: "AUD - Australian Dollar",
  CNY: "CNY - Chinese Yuan",
};

const currencyOptions = currencyValues.map((currency) => ({
  value: currency,
  label: currencyLabels[currency],
}));

interface AccountFormProps {
  onSubmit: (values: AccountFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<AccountFormValues>;
}

export function AccountForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Submit",
  defaultValues = {},
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    // Zod schema is the single source of truth for form validation.
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: defaultValues.name ?? "",
      initialBalance: defaultValues.initialBalance ?? 0,
      currency: defaultValues.currency ?? "PLN",
    },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Account Name"
        placeholder="Enter account name"
        error={errors.name?.message}
        disabled={isSubmitting}
        required
        autoFocus
        {...register("name")}
      />

      <Input
        label="Initial Balance"
        type="number"
        min={0}
        step={0.01}
        placeholder="Enter initial balance"
        error={errors.initialBalance?.message}
        disabled={isSubmitting}
        required
        {...register("initialBalance", {
          // Keep numeric field as number, not string.
          valueAsNumber: true,
        })}
      />

      <Select
        label="Currency"
        options={currencyOptions}
        error={errors.currency?.message}
        disabled={isSubmitting}
        showPlaceholder={false}
        required
        {...register("currency")}
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

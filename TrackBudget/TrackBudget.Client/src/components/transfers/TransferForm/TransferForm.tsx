import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../../common/Input/Input";
import { Textarea } from "../../common/Textarea/Textarea";
import { Button } from "../../common/Button/Button";

import { AccountSelect } from "../../common/AccountSelect";
import { useAccounts } from "../../../hooks/accountsHooks/useAccounts";

import {
  transferSchema,
  type TransferFormValues,
} from "../../../utils/transferSchema";

import styles from "./TransferForm.module.scss";

interface TransferFormProps {
  defaultValues?: Partial<TransferFormValues>;

  isSubmitting?: boolean;

  submitLabel?: string;

  onCancel: () => void;

  onSubmit: (values: TransferFormValues) => Promise<void> | void;
}

export function TransferForm({
  defaultValues,
  isSubmitting = false,
  submitLabel = "Save",
  onCancel,
  onSubmit,
}: TransferFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? 0,
      fromAccountId: defaultValues?.fromAccountId ?? "",
      toAccountId: defaultValues?.toAccountId ?? "",
      date: defaultValues?.date ?? new Date(),
      notes: defaultValues?.notes ?? "",
    },
  });

  const selectedFromAccountId = useWatch({
    control,
    name: "fromAccountId",
  });

  const selectedToAccountId = useWatch({
    control,
    name: "toAccountId",
  });

  const { data: accounts = [] } = useAccounts();
  const selectedFromAccount = accounts.find(
    (account) => account.id === selectedFromAccountId,
  );
  const selectedToAccount = accounts.find(
    (account) => account.id === selectedToAccountId,
  );
  const currency =
    selectedFromAccount?.currency ?? selectedToAccount?.currency ?? "";

  const amountHint = currency
    ? `Amount will be recorded in ${currency}.`
    : "Select an account to apply its currency.";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="amount">Amount</label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          disabled={isSubmitting}
          {...register("amount", { valueAsNumber: true })}
        />
        <small className={styles.hint}>{amountHint}</small>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fromAccountId">From Account</label>
        <AccountSelect
          control={control}
          name="fromAccountId"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="toAccountId">To Account</label>
        <AccountSelect
          control={control}
          name="toAccountId"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Date</label>
        <Input
          id="date"
          type="date"
          error={errors.date?.message}
          disabled={isSubmitting}
          {...register("date", { valueAsDate: true })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="notes">Notes</label>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Additional notes (optional)"
          error={errors.notes?.message}
          disabled={isSubmitting}
          {...register("notes")}
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

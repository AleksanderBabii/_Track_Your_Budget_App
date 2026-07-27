import type { SelectHTMLAttributes } from "react";
import { forwardRef, useId } from "react";
import clsx from "clsx";

import styles from "./Select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  showPlaceholder?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      placeholder = "Select an option",
      options,
      showPlaceholder = true,
      id,
      className,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    const hasMessage = Boolean(error || hint);

    return (
      <div className={clsx(styles.field, className)}>
        {label && (
          <label className={styles.label} htmlFor={selectId}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={selectId}
            className={clsx(styles.select, error && styles.selectError)}
            aria-invalid={Boolean(error)}
            aria-describedby={hasMessage ? messageId : undefined}
            required={required}
            disabled={disabled}
            {...props}
          >
            {showPlaceholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <span className={styles.arrow} aria-hidden="true">
            ▼
          </span>
        </div>

        {error ? (
          <span id={messageId} className={styles.error} role="alert">
            {error}
          </span>
        ) : (
          hint && (
            <span id={messageId} className={styles.hint}>
              {hint}
            </span>
          )
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

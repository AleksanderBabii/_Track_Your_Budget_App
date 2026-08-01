import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";
import clsx from "clsx";

import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
} // Add any additional props you want to support      

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const generetedId = useId();
    const inputId = id ?? generetedId;
    const messageId = `${inputId}-message`;

    return (
      <div className={clsx(styles.field, className)}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(styles.input, error && styles.inputError)}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          required={required}
          {...props}
        />

        {error ? (
          <span
            id={messageId}
            className={clsx(styles.message, styles.error)}
            role="alert"
          >
            {error}
          </span>
        ) : (
          hint && (
            <span id={messageId} className={clsx(styles.message, styles.hint)}>
              {hint}
            </span>
          )
        )}
      </div>
    );
  },
); // Forward ref to support ref forwarding

Input.displayName = "Input"; // Set display name for better debugging and React DevTools support

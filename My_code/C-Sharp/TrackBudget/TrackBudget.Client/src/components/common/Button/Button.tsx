import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
    children,
    variant = "primary",
    size = "medium",
    fullWidth = false,
    isLoading = false,
    disabled,
    className,
    type = "button",
    ...props
  }: ButtonProps) {
    return (
        <button
            type={type}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                isLoading && styles.loading,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
}
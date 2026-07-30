import {
    forwardRef,
    type TextareaHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Textarea.module.scss";

interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

export const Textarea = forwardRef<
    HTMLTextAreaElement,
    TextareaProps
>(
    (
        {
            label,
            error,
            required,
            className,
            id,
            ...props
        },
        ref
    ) => {
        return (
            <div className={styles.container}>
                {label && (
                    <label
                        htmlFor={id}
                        className={styles.label}
                    >
                        {label}

                        {required && (
                            <span className={styles.required}>
                                *
                            </span>
                        )}
                    </label>
                )}

                <textarea
                    id={id}
                    ref={ref}
                    className={clsx(
                        styles.textarea,
                        error && styles.error,
                        className
                    )}
                    {...props}
                />

                {error && (
                    <span className={styles.errorMessage}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

import styles from "./Card.module.scss";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  padding?: "none" | "small" | "medium" | "large";
}

export function Card({
  children,
  title,
  subtitle,
  actions,
  padding = "medium",
  className,
  ...props
}: CardProps) {
  return (
    <section
      className={clsx(styles.card, styles[padding], className)}
      {...props}
    >
      {(title || subtitle || actions) && (
        <header className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}

            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}

      <div className={styles.content}>{children}</div>
    </section>
  );
}

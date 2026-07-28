import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkTo: string;
}
export function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    // Shared layout for login/register screens.
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <div className={styles.logo}>TB</div>
          <div>
            <strong className={styles.barandName}>TrackBudget</strong>

            <p className={styles.brandDescribtion}>
              Take control of your money.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          {/* Card header + routed form content */}
          <header className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>{title}</h1>
            <p className={styles.cardSubtitle}>{subtitle}</p>
          </header>

          {children}

          <p className={styles.cardFooter}>
            {footerText}{" "}
            <Link className={styles.cardFooterLink} to={footerLinkTo}>
              {footerLink}
            </Link>
          </p>
        </div>
      </section>

      <aside className={styles.visual}>
        {/* Marketing/preview block shown on larger auth layouts */}
        <div className={styles.visualContent}>
          <span className={styles.eyebrow}> Your financial overview</span>
          <h2 className={styles.visualTitle}>
            Know where your money goes and make better decisions.
          </h2>
          <p className={styles.visualDescription}>
            {" "}
            Manage accounts, categorize spending, record transactions and track
            your progress in one place.
          </p>

          <div className={styles.previewCard}>
            <div>
              <span>Total balance</span>
              <strong> 12 0000 PLN </strong>
            </div>

            <div className={styles.previewStats}>
              <span>Income</span>
              <strong> 12 0000 PLN </strong>

              <span>Expenses</span>
              <strong> -2 0000 PLN </strong>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}

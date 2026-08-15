import { useMemo, useState } from "react";

import { useReport } from "../../hooks/reportHooks/useReport";

import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";

import styles from "./Report.module.css";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function Report() {
  const today = useMemo(() => new Date(), []);

  const firstDayOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );

  const [fromDate, setFromDate] = useState(formatDate(firstDayOfMonth));
  const [toDate, setToDate] = useState(formatDate(today));

  const { report, isLoading, isError, error } = useReport(fromDate, toDate);

  const dateError = useMemo(() => {
    if (!fromDate || !toDate) {
      return "Both From date and To date are required.";
    }
    if (fromDate > toDate) {
      return "From date cannot be later than To date.";
    }
    return null;
  }, [fromDate, toDate]);

  if (isLoading) {
    return <LoadingState message="Loading report..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error?.message || "An error occurred while loading the report."
        }
      />
    );
  }

  return (
    <div className={styles.reportContainer}>
      <div className={styles.header}>
        <div>
          <h1>Report</h1>
          <p>View your financial report for a specific date range.</p>
        </div>
      </div>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        {dateError && <p className={styles.error}>{dateError}</p>}
      </section>

      {!dateError && report && (
        <>
          <section className={styles.reportSummary}>
            <div className={styles.card}>
              <span>Total Income</span>
              <strong>${report.totalIncome.toFixed(2)}</strong>
            </div>

            <div className={styles.card}>
              <span>Total Expenses</span>
              <strong>${report.totalExpense.toFixed(2)}</strong>
            </div>

            <div className={styles.card}>
              <span>Net Balance</span>
              <strong>${report.netBalance.toFixed(2)}</strong>
            </div>
          </section>

          <section className={styles.reportByCategory}>
            <h2>Expenses by Category</h2>

            {report.expensesByCategory.length === 0 ? (
              <p>No expenses recorded in this date range.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.expensesByCategory.map(
                    (item: { category: string; amount: number }) => (
                      <tr key={item.category}>
                        <td>{item.category}</td>
                        <td>${item.amount.toFixed(2)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </section>

          <section className={styles.reportByCategory}>
            <h2>Income by Category</h2>

            {report.incomeByCategory.length === 0 ? (
              <p>No income recorded in this date range.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.incomeByCategory.map(
                    (item: { category: string; amount: number }) => (
                      <tr key={item.category}>
                        <td>{item.category}</td>
                        <td>${item.amount.toFixed(2)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </section>

          <section className={styles.reportTransfers}>
            <h2>Transfers</h2>

            {report.transfers.length === 0 ? (
              <p>No transfers recorded in this date range.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.transfers.map(
                    (transfer: {
                      date: string;
                      fromAccount: string;
                      toAccount: string;
                      amount: number;
                    }) => (
                      <tr
                        key={`${transfer.date}-${transfer.fromAccount}-${transfer.toAccount}`}
                      >
                        <td>{transfer.date}</td>
                        <td>{transfer.fromAccount}</td>
                        <td>{transfer.toAccount}</td>
                        <td>${transfer.amount.toFixed(2)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}

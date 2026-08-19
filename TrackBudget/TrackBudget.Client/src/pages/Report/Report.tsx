import { useMemo, useState } from "react";

import { useReport } from "../../hooks/reportHooks/useReport";
import { useAccounts } from "../../hooks/accountsHooks/useAccounts";

import { exportReportToCsv } from "../../utils/exportReport.ts";

import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { Button } from "../../components/common/Button/Button.tsx";

import { ExpenseChart } from "../../components/reports/ExpenseChart/ExpenseChart";
import { IncomeChart } from "../../components/reports/IncomeChart/IncomeChart";
import { MonthlyReportChart } from "../../components/reports/MonthlyReportChart/MonthlyReportChart";

import styles from "./Report.module.scss";

type ReportPresset =
  | "This Month"
  | "Last Month"
  | "Last 3 Month"
  | "This Year"
  | "Last Year";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// This function calculates the date range based on the selected preset.

function getPresetDateRange(preset: ReportPresset): {
  from: string;
  to: string;
} {
  const today = new Date();

  let fromDate: Date;
  let toDate: Date;

  switch (preset) {
    case "This Month":
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = today;
      break;
    case "Last Month":
      fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      toDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "Last 3 Month":
      fromDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      toDate = today;
      break;
    case "This Year":
      fromDate = new Date(today.getFullYear(), 0, 1);
      toDate = today;
      break;
    case "Last Year":
      fromDate = new Date(today.getFullYear() - 1, 0, 1);
      toDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
  }

  return { from: formatDate(fromDate), to: formatDate(toDate) };
}

export function Report() {
  const { data: accounts = [] } = useAccounts();

  const currencies = useMemo(
    () =>
      Array.from(
        new Set(accounts.map((account) => account.currency).filter(Boolean)),
      ),
    [accounts],
  );

  const currency = currencies.length === 1 ? currencies[0] : null;

  const formatAmount = (amount: number) => {
    if (!currency) {
      return amount.toFixed(2);
    }

    return new Intl.NumberFormat(undefined, {
      currency,
    }).format(amount);
  };

  const today = useMemo(() => new Date(), []);

  const firstDayOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );

  const [fromDate, setFromDate] = useState(formatDate(firstDayOfMonth));

  const [toDate, setToDate] = useState(formatDate(today));

  const handlePresetChange = (preset: ReportPresset) => {
    const { from, to } = getPresetDateRange(preset);

    setFromDate(from);
    setToDate(to);
  };

  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useReport(fromDate, toDate);

  console.log("REPORT DATA:", report);

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

      {report && (
        <Button
          type="button"
          onClick={() => 
            exportReportToCsv(report)
          }
          disabled={Boolean(reportError)}>
            Export CSV
          </Button>
        
      )}

      <section className={styles.filters}>
        <div className={styles.presets}>
          <label htmlFor="preset">Preset:</label>
          <button
            type="button"
            onClick={() => handlePresetChange("This Month")}
          >
            This Month
          </button>

          <button
            type="button"
            onClick={() => handlePresetChange("Last Month")}
          >
            Last Month
          </button>

          <button
            type="button"
            onClick={() => handlePresetChange("Last 3 Month")}
          >
            Last 3 Month
          </button>

          <button type="button" onClick={() => handlePresetChange("This Year")}>
            This Year
          </button>

          <button type="button" onClick={() => handlePresetChange("Last Year")}>
            Last Year
          </button>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="fromDate">From:</label>

          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="toDate">To:</label>

          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>

        {dateError && <p className={styles.error}>{dateError}</p>}
      </section>

      {!dateError && report && (
        <>
          {/* SUMMARY */}

          <section className={styles.reportSummary}>
            <div className={styles.card}>
              <span>Total Income</span>

              <strong>${formatAmount(report.summary.totalIncome)}</strong>
            </div>

            <div className={styles.card}>
              <span>Total Expenses</span>

              <strong>${formatAmount(report.summary.totalExpenses)}</strong>
            </div>

            <div className={styles.card}>
              <span>Net Balance</span>

              <strong>${formatAmount(report.summary.netChange)}</strong>
            </div>

            <div className={styles.card}>
              <span>Total Transfers</span>

              <strong>${formatAmount(report.summary.totalTransfers)}</strong>
            </div>
          </section>

          {/* EXPENSES */}

          <section className={styles.reportByCategory}>
            <h2>Expenses by Category</h2>

            <ExpenseChart data={report.expensesByCategory} />

            {report.expensesByCategory.length === 0 ? (
              <p>No expenses recorded in this date range.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Transactions</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.expensesByCategory.map((category) => (
                      <tr key={category.categoryId}>
                        <td>{category.categoryName}</td>

                        <td>{category.transactionCount}</td>

                        <td>${category.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* INCOME */}

          <section className={styles.reportByCategory}>
            <h2>Income by Category</h2>

            <IncomeChart data={report.incomeByCategory} />

            {report.incomeByCategory.length === 0 ? (
              <p>No income recorded in this date range.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Transactions</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.incomeByCategory.map((category) => (
                      <tr key={category.categoryId}>
                        <td>{category.categoryName}</td>

                        <td>{category.transactionCount}</td>

                        <td>${category.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* MONTHLY REPORT */}

          <section className={styles.reportMonthly}>
            <h2>Monthly Report</h2>

            <MonthlyReportChart data={report.monthlyReports} />

            {report.monthlyReports.length === 0 ? (
              <p>No data recorded in this date range.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.monthlyReports.map((month) => (
                      <tr key={month.month}>
                        <td>{month.month}</td>
                        <td>${month.totalIncome.toFixed(2)}</td>
                        <td>${month.totalExpenses.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* TRANSFERS */}

          <section className={styles.reportTransfers}>
            <h2>Transfers</h2>

            {report.transfers.length === 0 ? (
              <p>No transfers recorded in this date range.</p>
            ) : (
              <div className={styles.tableWrapper}>
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
                    {report.transfers.map((transfer) => (
                      <tr key={transfer.transferId}>
                        <td>{new Date(transfer.date).toLocaleDateString()}</td>

                        <td>{transfer.fromAccountName}</td>

                        <td>{transfer.toAccountName}</td>

                        <td>${transfer.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

import type { Report } from "../types/report";

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportReportToCsv(
  report: Report,
  filename = "track-budget-report.csv",
): void {
  const rows: string[][] = [];

  rows.push([
    "TrackBudget Report",
  ]);

  rows.push([
    `From: ${report.from}`,
    `To: ${report.to}`,
  ]);

  rows.push([]);

  rows.push([
    "Summary",
  ]);

  rows.push([
    "Total Income",
    String(report.summary.totalIncome),
  ]);

  rows.push([
    "Total Expenses",
    String(report.summary.totalExpenses),
  ]);

  rows.push([
    "Net Balance",
    String(report.summary.netChange),
  ]);

  rows.push([
    "Total Transfers",
    String(report.summary.totalTransfers),
  ]);

  rows.push([]);

  rows.push([
    "Expenses by Category",
  ]);

  rows.push([
    "Category",
    "Amount",
    "Transactions",
  ]);

  for (const category of report.expensesByCategory) {
    rows.push([
      category.categoryName,
      String(category.amount),
      String(category.transactionCount),
    ]);
  }

  rows.push([]);

  rows.push([
    "Income by Category",
  ]);

  rows.push([
    "Category",
    "Amount",
    "Transactions",
  ]);

  for (const category of report.incomeByCategory) {
    rows.push([
      category.categoryName,
      String(category.amount),
      String(category.transactionCount),
    ]);
  }

  rows.push([]);

  rows.push([
    "Monthly",
  ]);

  rows.push([
    "Month",
    "Income",
    "Expenses",
  ]);

  for (const month of report.monthlyReports) {
    rows.push([
      month.month,
      String(month.totalIncome),
      String(month.totalExpenses),
    ]);
  }

  rows.push([]);

  rows.push([
  "Transfers",
]);

rows.push([
  "Date",
  "From Account",
  "To Account",
  "Amount",
  "Notes",
]);

for (const transfer of report.transfers) {
  rows.push([
    transfer.date,
    transfer.fromAccountName,
    transfer.toAccountName,
    String(transfer.amount),
    transfer.notes ?? "",
  ]);
}

  const csv = rows
    .map((row) =>
      row
        .map((value) => escapeCsvValue(value))
        .join(","),
    )
    .join("\n");

  const blob = new Blob(
    ["\uFEFF" + csv],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
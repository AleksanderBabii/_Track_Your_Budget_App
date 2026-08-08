import axios from "axios";

import { useMemo, useState } from "react";

import { useDashboard } from "../../hooks/dashboardHooks/useDashboard";
import { useAccounts } from "../../hooks/accountHooks/useAccounts";
import { useTransactions } from "../../hooks/transactionHooks/useTransactions";
import { useAuthStore } from "../../store/authStore";
import type { Transaction } from "../../types/transaction";
import type { DashboardAnalytics } from "../../types/dashboardAnalytics";

import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";

import { SummaryCard } from "../../components/dashboard/SummaryCard/SummaryCard";
import { SummaryGrid } from "../../components/dashboard/SummaryGrid/SummaryGrid";
import { RecentTransactions } from "../../components/dashboard/RecentTransactions/RecentTransactions";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader/DashboardHeader";
import { DashboardContent } from "../../components/dashboard/DashboardContent/DashboardContent";
import { useDashboardAnalytics } from "../../hooks/dashboardHooks/useDashboardAnalytics";
import { IncomeExpenseChart } from "../../components/dashboard/Analytics/IncomeExpenseChart/IncomeExpenseChart";
import { ExpenseCategoryChart } from "../../components/dashboard/Analytics/ExpenseCategoryChart/ExpenseCategoryChart";
import { ChartCard } from "../../components/dashboard/Analytics/ChartCard/ChartCard";
import { AnalyticsGrid } from "../../components/dashboard/Analytics/AnalyticsGrid/AnalyticsGrid";
import { MonthlyBalanceChart } from "../../components/dashboard/Analytics/MonthlyBalance/MonthlyBalanceChart";

import styles from "./Dashboard.module.scss";
import { QuickStats } from "../../components/dashboard/QuickStats/QuickStats";

export function Dashboard() {
  const { data: dashboardData, isLoading, isError, error } = useDashboard();
  const { data: accounts = [] } = useAccounts();
  const { data: allTransactions = [] } = useTransactions();
  const { data: analyticsData } = useDashboardAnalytics();
  const userName = useAuthStore((state) => state.user?.username ?? "User");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId],
  );

  const selectedAccountTransactions = useMemo(() => {
    if (!selectedAccountId) {
      return [] as Transaction[];
    }

    return allTransactions.filter(
      (transaction) => transaction.accountId === selectedAccountId,
    );
  }, [allTransactions, selectedAccountId]);

  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return selectedAccountTransactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        const isCurrentMonth =
          transactionDate.getMonth() === month &&
          transactionDate.getFullYear() === year;

        if (!isCurrentMonth) {
          return acc;
        }

        if (transaction.type === "Income") {
          acc.income += transaction.amount;
        }

        if (transaction.type === "Expense") {
          acc.expenses += transaction.amount;
        }

        return acc;
      },
      { income: 0, expenses: 0 },
    );
  }, [selectedAccountTransactions]);

  const recentTransactions = useMemo(() => {
    if (!selectedAccountId) {
      return dashboardData?.recentTransactions ?? [];
    }

    return [...selectedAccountTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [
    dashboardData?.recentTransactions,
    selectedAccountId,
    selectedAccountTransactions,
  ]);

  const selectedAccountAnalytics = useMemo<DashboardAnalytics | null>(() => {
    if (!selectedAccountId) {
      return null;
    }

    const monthTotals = new Map<
      string,
      { income: number; expenses: number; balance: number }
    >();
    const categoryTotals = new Map<string, number>();

    for (const transaction of selectedAccountTransactions) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const currentMonth = monthTotals.get(monthKey) ?? {
        income: 0,
        expenses: 0,
        balance: 0,
      };

      if (transaction.type === "Income") {
        currentMonth.income += transaction.amount;
        currentMonth.balance += transaction.amount;
      } else {
        currentMonth.expenses += transaction.amount;
        currentMonth.balance -= transaction.amount;

        const categoryName = transaction.categoryName?.trim() || "Uncategorized";
        categoryTotals.set(
          categoryName,
          (categoryTotals.get(categoryName) ?? 0) + transaction.amount,
        );
      }

      monthTotals.set(monthKey, currentMonth);
    }

    const sortedMonths = [...monthTotals.keys()].sort();

    return {
      incomeExpenseAnalytics: sortedMonths.map((month) => ({
        month,
        income: monthTotals.get(month)?.income ?? 0,
        expenses: monthTotals.get(month)?.expenses ?? 0,
      })),
      categoryAnalytics: [...categoryTotals.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([category, total]) => ({ category, total })),
      monthlyBalanceAnalytics: sortedMonths.map((date) => ({
        date,
        balance: monthTotals.get(date)?.balance ?? 0,
      })),
    };
  }, [selectedAccountId, selectedAccountTransactions]);

  const chartAnalytics = selectedAccountAnalytics ?? analyticsData;

  const totalBalance = selectedAccount
    ? selectedAccount.balance
    : (dashboardData?.totalBalance ?? 0);

  const monthlyIncome = selectedAccountId
    ? monthlyTotals.income
    : (dashboardData?.monthlyIncome ?? 0);

  const monthlyExpenses = selectedAccountId
    ? monthlyTotals.expenses
    : (dashboardData?.monthlyExpenses ?? 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;

  if (isLoading) {
    return <LoadingState message="Loading dashboard data..." />;
  }

  if (isError) {
    const errorDescription = axios.isAxiosError(error)
      ? `Error loading dashboard data (${error.response?.status ?? "request failed"}).`
      : "Error loading dashboard data.";

    return <ErrorState title="Error" description={errorDescription} />;
  }

  return (
    <div className={styles.dashboard}>
      <DashboardHeader
        userName={userName}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
      />

      <SummaryGrid>
        <SummaryCard
          title="Total Balance"
          value={totalBalance}
          icon={<span>💰</span>}
          variant="primary"
        />

        <SummaryCard
          title="Monthly Income"
          value={monthlyIncome}
          icon={<span>📈</span>}
          variant="success"
        />

        <SummaryCard
          title="Monthly Expenses"
          value={monthlyExpenses}
          icon={<span>📉</span>}
          variant="error"
        />

        <SummaryCard
          title="Monthly Savings"
          value={monthlySavings}
          icon={<span>💵</span>}
          variant="secondary"
        />
      </SummaryGrid>

      <DashboardContent
        leftContent={<RecentTransactions transactions={recentTransactions} />}
        rightContent={
          <QuickStats
            accountsCount={accounts.length}
            categoriesCount={dashboardData?.categoriesCount ?? 0}
            transactionsCount={allTransactions.length}
          />
        }
      />

      <AnalyticsGrid>

        <ChartCard title="Income vs Expenses" description="A comparison of your income and expenses for the current month.">
          <IncomeExpenseChart data={chartAnalytics?.incomeExpenseAnalytics ?? []} />
        </ChartCard>

        <ChartCard title="Category Breakdown" description="A breakdown of your expenses by category for the current month.">
          <ExpenseCategoryChart data={chartAnalytics?.categoryAnalytics ?? []} />
        </ChartCard>

        <ChartCard title="Monthly Balance" description="Your balance trend over the past 12 months.">
          <MonthlyBalanceChart data={chartAnalytics?.monthlyBalanceAnalytics ?? []} />
        </ChartCard>
      </AnalyticsGrid>
    </div>
  );
}

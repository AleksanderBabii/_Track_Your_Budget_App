import axios from "axios";
import { useMemo, useState } from "react";
import { useDashboard } from "../../hooks/dashboardHooks/useDashboard";
import { useAccounts } from "../../hooks/accountsHooks/useAccounts";
import { useCategories } from "../../hooks/categoriesHooks/useCategories";
import { useTransactions } from "../../hooks/transactionsHooks/useTransactions";
import { useAuthStore } from "../../store/authStore";
import type { Transaction } from "../../types/transaction";

import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";

import { SummaryCard } from "../../components/dashboard/SummaryCard/SummaryCard";
import { SummaryGrid } from "../../components/dashboard/SummaryGrid/SummaryGrid";
import { RecentTransactions } from "../../components/dashboard/RecentTransactions/RecentTransactions";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader/DashboardHeader";
import { QuickStats } from "../../components/dashboard/QuickStats/QuickStats";
import { AnalyticsGrid } from "../../components/dashboard/Analytics/AnalyticsGrid";
import { ChartCard } from "../../components/dashboard/Analytics/ChartCard";
import { IncomeExpenseChart } from "../../components/dashboard/Analytics/IncomeExpenseChart";
import { ExpenseCategoryChart } from "../../components/dashboard/Analytics/ExpenseCategoryChart";
import { MonthlyBalanceChart } from "../../components/dashboard/Analytics/MonthlyBalanceChart";

import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const { data: dashboardData, isLoading, isError, error } = useDashboard();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const { data: allTransactions = [] } = useTransactions();
  const userName = useAuthStore((state) => state.user?.username ?? "User");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId],
  );

  const selectedAccountTransactions = useMemo(() => {
    if (!selectedAccountId) {
      return [] as Transaction[];
    }

    return allTransactions.filter((transaction) => transaction.accountId === selectedAccountId);
  }, [allTransactions, selectedAccountId]);

  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return selectedAccountTransactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        const isCurrentMonth =
          transactionDate.getMonth() === month && transactionDate.getFullYear() === year;

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
  }, [dashboardData?.recentTransactions, selectedAccountId, selectedAccountTransactions]);

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

  const chartTransactions = selectedAccountId
    ? selectedAccountTransactions
    : allTransactions;

  const incomeExpenseData = useMemo(() => {
    const monthlyMap = new Map<string, { month: string; income: number; expenses: number }>();

    for (const transaction of chartTransactions) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthlyMap.get(monthKey) ?? { month: monthKey, income: 0, expenses: 0 };

      if (transaction.type === "Income") {
        existing.income += transaction.amount;
      } else {
        existing.expenses += transaction.amount;
      }

      monthlyMap.set(monthKey, existing);
    }

    return [...monthlyMap.values()]
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [chartTransactions]);

  const expenseCategoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    for (const transaction of chartTransactions) {
      if (transaction.type !== "Expense") {
        continue;
      }

      const category = transaction.categoryName?.trim() || "Uncategorized";
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + transaction.amount);
    }

    return [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([category, total]) => ({ category, total }));
  }, [chartTransactions]);

  const monthlyBalanceData = useMemo(() => {
    const monthlyMap = new Map<string, number>();

    for (const transaction of chartTransactions) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const currentValue = monthlyMap.get(monthKey) ?? 0;
      const nextValue =
        transaction.type === "Income"
          ? currentValue + transaction.amount
          : currentValue - transaction.amount;

      monthlyMap.set(monthKey, nextValue);
    }

    return [...monthlyMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, balance]) => ({ month, balance }));
  }, [chartTransactions]);

  const quickStats = useMemo(() => {
    const apiAccountsCount = dashboardData?.accountsCount ?? 0;
    const apiCategoriesCount = dashboardData?.categoriesCount ?? 0;
    const apiTransactionsCount = dashboardData?.transactionsCount ?? 0;

    return {
      accountsCount: apiAccountsCount > 0 ? apiAccountsCount : accounts.length,
      categoriesCount: apiCategoriesCount > 0 ? apiCategoriesCount : categories.length,
      transactionsCount: apiTransactionsCount > 0 ? apiTransactionsCount : allTransactions.length,
    };
  }, [dashboardData, accounts.length, categories.length, allTransactions.length]);

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

        <RecentTransactions transactions={recentTransactions} />
      </SummaryGrid>

      <QuickStats
        accountsCount={quickStats.accountsCount}
        categoriesCount={quickStats.categoriesCount}
        transactionsCount={quickStats.transactionsCount}
      />

      <AnalyticsGrid>
        <ChartCard
          title="Income vs Expenses"
          description="Monthly trend for your selected scope."
          isEmpty={incomeExpenseData.length === 0}
        >
          <IncomeExpenseChart data={incomeExpenseData} />
        </ChartCard>

        <ChartCard
          title="Expense Categories"
          description="Top expense categories by amount."
          isEmpty={expenseCategoryData.length === 0}
        >
          <ExpenseCategoryChart data={expenseCategoryData} />
        </ChartCard>

        <ChartCard
          title="Monthly Net Balance"
          description="Income minus expenses per month."
          isEmpty={monthlyBalanceData.length === 0}
        >
          <MonthlyBalanceChart data={monthlyBalanceData} />
        </ChartCard>
      </AnalyticsGrid>

    </div>
  );
}

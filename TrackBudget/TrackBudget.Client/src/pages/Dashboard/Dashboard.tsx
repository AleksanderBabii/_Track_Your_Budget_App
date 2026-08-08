import axios from "axios";
import { useMemo, useState } from "react";
import { useDashboard } from "../../hooks/dashboardHooks/useDashboard";
import { useAccounts } from "../../hooks/accountHooks/useAccounts";
import { useTransactions } from "../../hooks/transactionHooks/useTransactions";
import { useAuthStore } from "../../store/authStore";
import type { Transaction } from "../../types/transaction";

import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";

import { SummaryCard } from "../../components/dashboard/SummaryCard/SummaryCard";
import { SummaryGrid } from "../../components/dashboard/SummaryGrid/SummaryGrid";
import { RecentTransactions } from "../../components/dashboard/RecentTransactions/RecentTransactions";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader/DashboardHeader";
import { QuickStats } from "../../components/dashboard/QuickStats/QuickStats";

import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const { data: dashboardData, isLoading, isError, error } = useDashboard();
  const { data: accounts = [] } = useAccounts();
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
        accountsCount={dashboardData?.accountsCount ?? 0}
        categoriesCount={dashboardData?.categoriesCount ?? 0}
        transactionsCount={dashboardData?.transactionsCount ?? 0}
      />

    </div>
  );
}

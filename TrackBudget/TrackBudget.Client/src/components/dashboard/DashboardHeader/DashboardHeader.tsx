import React from "react";

import { Select } from "../../common/Select/Select";

import type { Account } from "../../../types/account";

import styles from "./DashboardHeader.module.scss";

interface DashboardHeaderProps {
  userName: string;
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountChange: (accountId: string | null) => void;
}

export function DashboardHeader({
  userName,
  accounts,
  selectedAccountId,
  onAccountChange,
}: DashboardHeaderProps) {
  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = event.target.value || null;
    onAccountChange(accountId);
  };

  return (
    <header className={styles.dashboardHeader}>
      <h1 className={styles.title}>Welcome, {userName}!</h1>
      <div className={styles.accountSelector}>
        <label htmlFor="account-select">Select Account:</label>
        <Select
          id="account-select"
          value={selectedAccountId || ""}
          onChange={handleAccountChange}
          options={accounts.map((account) => ({
            value: account.id,
            label: account.name,
          }))}
        />
      </div>
    </header>
  );
}

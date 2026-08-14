import { TransactionList } from "../../transaction/TransactionList/TransactionList";
import type { Transaction } from "../../../types/transaction";
import styles from "./RecentTransactions.module.scss";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section className={styles.recentTransactions}>
      <h2 className={styles.title}>Recent Transactions</h2>
      <TransactionList
        transactions={transactions}
        onEdit={(data) => console.log("Edit transaction", data)}
        onDelete={(data) => console.log("Delete transaction", data)}
      />
    </section>
  );
}

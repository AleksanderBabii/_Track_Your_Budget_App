import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { Button } from "../../common/Button/Button";
import { Card } from "../../common/Card/Card";

import type { Currency } from "../../../types/account";
import type { Transaction } from "../../../types/transaction";

import styles from "./TransactionCard.module.scss";

interface TransactionCardProps {
  transaction: Transaction;
  currency?: Currency;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export function TransactionCard({
  transaction,
  currency = "USD",
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isIncome = transaction.type === "Income";
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(transaction.amount);

  return (
    <Card className={styles.transactionCard}>
      <div className={styles.left}  >
        <div
          className={
            isIncome
              ? styles.transactionCardIconIncome
              : styles.transactionCardIconExpense
          }
        >
          {isIncome ? (
            <FiArrowUpCircle />
          ) : (
            <FiArrowDownCircle />
          )}
        </div>

        <div className={styles.transactionCardDetails}>
          <h3 className={styles.transactionCardTitle}>{transaction.title}</h3>
          <p className={styles.transactionCardCategory}>
            {transaction.categoryId}
          </p>
          <span className={styles.transactionCardName}>
            {transaction.accountName}
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <strong
          className={
            isIncome
              ? styles.transactionCardAmountIncome
              : styles.transactionCardAmountExpense
          }
        >
          {isIncome ? "+" : "-"}{formattedAmount}
        </strong>

        <small
          className={
            isIncome
              ? styles.transactionCardDateIncome
              : styles.transactionCardDateExpense
          }
        >
          {new Date(transaction.date).toLocaleDateString()}
        </small>

        <div className={styles.transactionCardActions}>
          <Button
          variant="ghost"
            onClick={() => onEdit(transaction)}
            aria-label="Edit Transaction"
          >
            <FiEdit2 />
          </Button>

          <Button
            variant="ghost"
            onClick={() => onDelete(transaction.id)}
            aria-label="Delete Transaction"
          >
            <FiTrash2 />
          </Button>
        </div>
      </div>
    </Card>
  );
}
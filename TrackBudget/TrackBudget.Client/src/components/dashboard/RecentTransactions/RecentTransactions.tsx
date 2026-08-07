import { TransactionList } from "../../transaction/TransactionList/TransactionList";
import type { Transaction } from "../../../types/transaction";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {

    return (
        <div>
            <h2>Recent Transactions</h2>
            <TransactionList 
            transactions={transactions} 
            onEdit={data => console.log("Edit transaction", data)}
            onDelete={data => console.log("Delete transaction", data)}
            />
        </div>
    );
}
import { useState } from "react";

import { useAccounts } from "../../hooks/accountsHooks/useAccounts";
import { usePreviewCsvImport } from "../../hooks/importHooks/usePreviewCsvImport";

import { Select } from "../../components/common/Select/Select";
import { Button } from "../../components/common/Button/Button";
import { Input } from "../../components/common/Input/Input";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";

import type { ImportPreview } from "../../types/import";

import styles from "./Import.module.css";

export function Import() {
  const { data: accounts = [] } = useAccounts();

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const previewMutation = usePreviewCsvImport();

  const [accountId, setAccountId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  }

  async function handlePreview() {
    if (!file || !accountId) {
      setValidationError("Please select an account and a CSV file to preview.");
      return;
    }

    setValidationError(null);

    const result = await previewMutation.mutateAsync({
      file,
      accountId,
    });

    setPreview(result);
  }

  return (
    <div className={styles.importContainer}>
      <div className={styles.importHeader}>
        <h1>Import Transactions</h1>
        <p>
          Select a CSV file from your bank to preview your transactions before
          importing.
        </p>
      </div>

      <section className={styles.importForm}>
        <div className={styles.importGroup}>
          <label htmlFor="account">Select Account:</label>

          <Select
            id="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            options={accountOptions}
            placeholder="Select an account"
          />
        </div>

        <div className={styles.importGroup}>
          <label htmlFor="file">Select CSV File:</label>
          <Input
            type="file"
            id="csv"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>

        {file && <p className={styles.fileName}>Selected file: {file.name}</p>}
        {validationError && <ErrorState message={validationError} />}
        <Button
          onClick={handlePreview}
          disabled={!file || !accountId || previewMutation.isPending}
        >
          {previewMutation.isPending ? "Previewing..." : "Preview Import"}
        </Button>
      </section>
      {preview && (
        <section className={styles.preview}>
          <div className={styles.previewHeader}>
            <div>
              <h2>Import Preview</h2>

              <p>Review the transactions before importing them.</p>
            </div>

            <div className={styles.previewStats}>
              <span>Total: {preview.totalRows}</span>

              <span>Valid: {preview.validRows}</span>

              <span>Invalid: {preview.invalidRows}</span>

              <span>Duplicates: {preview.duplicateRows}</span>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {preview.transactions.map((transaction) => (
                  <tr key={transaction.rowNumber}>
                    <td>{transaction.rowNumber}</td>

                    <td>{new Date(transaction.date).toLocaleDateString()}</td>

                    <td>{transaction.title}</td>

                    <td>{transaction.amount.toFixed(2)}</td>

                    <td>{transaction.type}</td>

                    <td>{transaction.categoryName ?? "Uncategorized"}</td>

                    <td>
                      {transaction.error ? (
                        <span className={styles.invalid}>
                          {transaction.error}
                        </span>
                      ) : transaction.isDuplicate ? (
                        <span className={styles.duplicate}>Duplicate</span>
                      ) : (
                        <span className={styles.valid}>Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

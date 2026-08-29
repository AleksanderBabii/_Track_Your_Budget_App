import { useState } from "react";
import { createPortal } from "react-dom";

import { useAccounts } from "../../../hooks/accountsHooks/useAccounts";
import { usePreviewCsvImport } from "../../../hooks/importHooks/usePreviewCsvImport";
import { useConfirmCsvImport } from "../../../hooks/importHooks/useConfirmCsvImport";

import { Select } from "../../common/Select/Select";
import { Button } from "../../common/Button/Button";
import { Input } from "../../common/Input/Input";
import { ErrorState } from "../../common/ErrorState/ErrorState";

import type { ImportPreview } from "../../../types/import";

import styles from "./ImportCsvModal.module.scss";

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportFileFormat = "csv" | "xlsx" | "xls";

type BankFormat =
  | "auto detect"
  | "pko"
  | "ing"
  | "mBank"
  | "millennium"
  | "alior"
  | "pekao"
  | "santander"
  | "erste s bank polska"
  | "revolut"
  | "bnp paribas"
  | "credit agricole"
  | "getin bank"
  | "idea bank"
  | "plus bank"
  | "santander consumer bank"
  | "t-mobile usługi bankowe"
  | "bank pocztowy"
  | "bank polska kasa opieki"
  | "eurobank"
  | "nest bank"
  | "toyota bank"
  | "bank nowy bfg sa"
  | "bank spółdzielczy"
  | "banki spółdzielcze"
  | "banki spółdzielcze (bs)"
  | "banki spółdzielcze (bs) - polska"
  | "banki spółdzielcze (bs) - zagranica"
  | "banki spółdzielcze (bs) - inne"
  | "banki spółdzielcze (bs) - nieznane"
  | "custom";

export function ImportCsvModal({ isOpen, onClose }: ImportCsvModalProps) {
  const previewMutation = usePreviewCsvImport();

  const importMutation = useConfirmCsvImport();

  const { data: accounts = [] } = useAccounts();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileFormat, setFileFormat] = useState<ImportFileFormat>("csv");

  const [validationError, setValidationError] = useState<string | null>(null);

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const [isImporting, setIsImporting] = useState(false);

  const [preview, setPreview] = useState<ImportPreview | null>(null);

  const [selectedBankFormat, setSelectedBankFormat] =
    useState<BankFormat>("auto detect");

  if (!isOpen) {
    return null;
  }

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const fileFormatOptions: { value: ImportFileFormat; label: string }[] = [
    { value: "csv", label: "CSV" },
    { value: "xlsx", label: "XLSX" },
    { value: "xls", label: "XLS" },
  ];

  const bankFormatOptions: { value: BankFormat; label: string }[] = [
    { value: "auto detect", label: "Auto Detect" },
    { value: "pko", label: "PKO" },
    { value: "ing", label: "ING" },
    { value: "mBank", label: "mBank" },
    { value: "millennium", label: "Millennium" },
    { value: "alior", label: "Alior" },
    { value: "pekao", label: "Pekao" },
    { value: "santander", label: "Santander" },
    { value: "erste s bank polska", label: "Erste S Bank Polska" },
    { value: "revolut", label: "Revolut" },
    { value: "bnp paribas", label: "BNP Paribas" },
    { value: "credit agricole", label: "Credit Agricole" },
    { value: "getin bank", label: "Getin Bank" },
    { value: "idea bank", label: "Idea Bank" },
    { value: "plus bank", label: "Plus Bank" },
    { value: "santander consumer bank", label: "Santander Consumer Bank" },
    { value: "t-mobile usługi bankowe", label: "T-Mobile Usługi Bankowe" },
    { value: "bank pocztowy", label: "Bank Pocztowy" },
    { value: "bank polska kasa opieki", label: "Bank Polska Kasa Opieki" },
    { value: "eurobank", label: "Eurobank" },
    { value: "nest bank", label: "Nest Bank" },
    { value: "toyota bank", label: "Toyota Bank" },
    { value: "bank nowy bfg sa", label: "Bank Nowy BFG SA" },
    { value: "bank spółdzielczy", label: "Bank Spółdzielczy" },
    { value: "banki spółdzielcze", label: "Banki Spółdzielcze" },
    { value: "banki spółdzielcze (bs)", label: "Banki Spółdzielcze (BS)" },
    {
      value: "banki spółdzielcze (bs) - polska",
      label: "Banki Spółdzielcze (BS) - Polska",
    },
    {
      value: "banki spółdzielcze (bs) - zagranica",
      label: "Banki Spółdzielcze (BS) - Zagranica",
    },
    {
      value: "banki spółdzielcze (bs) - inne",
      label: "Banki Spółdzielcze (BS) - Inne",
    },
    {
      value: "banki spółdzielcze (bs) - nieznane",
      label: "Banki Spółdzielcze (BS) - Nieznane",
    },
    { value: "custom", label: "Custom" },
  ];

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setValidationError(null);
  }

  async function handlePreview() {
    if (!selectedAccountId) {
      setValidationError("Please select an account.");
      return;
    }

    if (!selectedFile) {
      setValidationError("Please select a file to import.");
      return;
    }

    setValidationError(null);

    setPreview(null);

    try {
      const result = await previewMutation.mutateAsync({
        file: selectedFile,
        accountId: selectedAccountId,
      });
      setPreview(result);
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : "Failed to preview the import.",
      );
    }
  }

  function handleClose() {
    setSelectedAccountId("");
    setSelectedFile(null);
    setFileFormat("csv");
    setSelectedBankFormat("auto detect");
    setValidationError(null);
    onClose();
  }

  async function handleConfirmImport() {
    if (!preview || !selectedAccountId) {
      return;
    }

    const transactions = preview.transactions
      .filter((transaction) => !transaction.error && !transaction.isDuplicate)
      .map((transaction) => ({
        rowNumber: transaction.rowNumber,
        date: transaction.date,
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        notes: transaction.notes,
        categoryId: transaction.categoryId,
      }));

    if (transactions.length === 0) {
      setValidationError(
        "There are no valid transactions available for import.",
      );

      return;
    }

    setValidationError(null);

    try {
      await importMutation.mutateAsync({
        accountId: selectedAccountId,
        transactions,
      });

      handleClose();
    } catch {
      setValidationError("Failed to import transactions. Please try again.");
    }
  }

  return createPortal(
    <div
      className={styles.modalOverlay}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-csv-title"
      >
        <header className={styles.modalHeader}>
          <div>
            <h2 id="import-csv-title">Import Transactions</h2>
            <p>Select a file and an account to import transactions.</p>
          </div>
          <Button onClick={handleClose} aria-label="Close modal">
            X
          </Button>
        </header>

        <div className={styles.modalBody}>
          {validationError && <ErrorState message={validationError} />}

          <div className={styles.formGroup}>
            <Select
              label="Select File Format"
              options={fileFormatOptions}
              value={fileFormat}
              onChange={(event) =>
                setFileFormat(event.target.value as ImportFileFormat)
              }
            />

            {preview && (
              <section className={styles.previewSection}>
                <div className={styles.previewHeader}>
                  <div>
                    <h3>Preview Import</h3>
                    <p>
                      Review the transactions below before confirming the
                      import.
                    </p>
                  </div>
                  <div className={styles.previewSummary}>
                    <span>Total: {preview.totalRows}</span>
                    <span>Valid: {preview.validRows}</span>
                    <span>Invalid: {preview.invalidRows}</span>
                    <span>Duplicates: {preview.duplicateRows}</span>
                  </div>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.previewTable}>
                    <thead>
                      <tr>
                        <th>Row</th>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {preview.transactions.map((transactions) => (
                        <tr key={transactions.rowNumber}>
                          <td>{transactions.rowNumber}</td>
                          <td>
                            {new Date(transactions.date).toLocaleDateString()}
                          </td>
                          <td>{transactions.title}</td>
                          <td>{transactions.description}</td>
                          <td>{transactions.amount.toFixed(2)}</td>
                          <td>{transactions.type}</td>
                          <td>{transactions.notes || "N/A"}</td>
                          <td>{transactions.categoryId || "N/A"}</td>
                          <td>{transactions.categoryName || "N/A"}</td>
                          <td>
                            {transactions.error ? (
                              <span className={styles.invalid}>
                                {transactions.error}
                              </span>
                            ) : transactions.isDuplicate ? (
                              <span className={styles.duplicate}>
                                Duplicate
                              </span>
                            ) : (
                              <span className={styles.valid}>Valid</span>
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

          <div className={styles.formGroup}>
            <Select
              label="Select Bank Format"
              options={bankFormatOptions}
              value={selectedBankFormat}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedBankFormat(event.target.value as BankFormat)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <Select
              label="Select Account"
              options={accountOptions}
              value={selectedAccountId}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedAccountId(event.target.value as string)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              type="file"
              id="fileInput"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              {selectedFile ? selectedFile.name : "Choose a file..."}
            </label>
          </div>

          {selectedFile && (
            <div className={styles.selectedFile}>
              <span>Selected file: {selectedFile.name}</span>
              <strong>{selectedFile.name}</strong>
            </div>
          )}
        </div>

        <footer className={styles.modalFooter}>
          {!preview ? (
            <>
              <Button type="button" onClick={handleClose}>
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handlePreview}
                disabled={
                  !selectedAccountId ||
                  !selectedFile ||
                  previewMutation.isPending
                }
              >
                {previewMutation.isPending ? "Analyzing..." : "Preview Import"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => {
                  setPreview(null);
                }}
              >
                Back to File Selection
              </Button>

              <Button
                type="button"
                onClick={handleConfirmImport}
                disabled={importMutation.isPending}
              >
                {importMutation.isPending ? "Importing..." : "Confirm Import"}
              </Button>
            </>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
}

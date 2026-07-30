import { Select} from "../Select/Select";

import { useAccounts } from "../../../hooks/useAccounts";

interface AccountSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function AccountSelect({ value, onChange, error, disabled }: AccountSelectProps) {
  const { data: accounts = [], isLoading } = useAccounts();

  return (
    <Select
    label="Account"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    options={accounts.map((account) => ({
      value: account.id,
      label: `${account.name} (${account.currency})`,
    }))}
    error={error}
    placeholder={isLoading ? "Loading accounts..." : "Select an account"}
    disabled={disabled || isLoading}
  />
  );
}
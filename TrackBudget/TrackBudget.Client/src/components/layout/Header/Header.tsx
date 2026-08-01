import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";

import { useAuthStore } from "../../../store/authStore";

import styles from "./Header.module.scss";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Accounts",
  "/categories": "Categories",
  "/transactions": "Transactions",
  "/transfers": "Transfers",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Header() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const userInitial = (user?.username?.charAt(0) ?? "U").toUpperCase();

  const pageTitle = titles[location.pathname] ?? "TrackBudget";

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{pageTitle}</h1>

        <span>
          Welcome back, <strong>{user?.username ?? "User"}</strong>
        </span>
      </div>

      <div className={styles.right}>
        <button className={styles.notification}>
          <FiBell size={20} />
        </button>

        <div className={styles.avatar}>
          {userInitial}
        </div>
      </div>
    </header>
  );
}

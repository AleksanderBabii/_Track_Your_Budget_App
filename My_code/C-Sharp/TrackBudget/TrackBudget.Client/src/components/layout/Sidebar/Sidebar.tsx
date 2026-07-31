import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import { navigationItems } from "../../../config/navigation";
import { useAuthStore } from "../../../store/authStore";

import { NavigationItem } from "../Navigation/Navigation";

import { Button } from "../../common/Button/Button";

import styles from "./Sidebar.module.scss";

interface SidebarProps {
  isCollapsed: boolean;
  isCompactViewport?: boolean;
  onToggle: () => void;
}

export function Sidebar({
  isCollapsed,
  isCompactViewport = false,
  onToggle,
}: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isVisualCollapsed = isCollapsed && !isCompactViewport;
  // Fallback keeps avatar stable before profile data is loaded.
  const userInitial = (user?.username?.charAt(0) ?? "U").toUpperCase();

  const handleLogout = () => {
    // Clear session state and move to public auth route.
    logout();
    navigate("/login", { replace: true }); // Use replace to prevent going back to the previous page after logout
  };

  return (
    <aside
      className={clsx(styles.sidebar, isVisualCollapsed && styles.sidebarCollapsed)}
      aria-label="Main navigation"
    >
      <div>
        <div className={styles.topRow}>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={onToggle}
            aria-label={isVisualCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isVisualCollapsed}
          >
            {isVisualCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <div className={clsx(styles.logo, isVisualCollapsed && styles.logoCollapsed)}>
          <div className={styles.logoImage}> TB </div>

          <div className={styles.logoText}>
            <strong>TrackBudget</strong>

            <p>Track your budget with ease</p>
          </div>
        </div>

        <nav className={styles.navigation}>
          {/* Navigation labels collapse to icons when sidebar is compact. */}
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.path}
              item={item}
              isCollapsed={isVisualCollapsed}
            />
          ))}
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={clsx(styles.user, isVisualCollapsed && styles.userCollapsed)}>
          <div className={styles.avatar}>
            {userInitial}
          </div>

          <div className={styles.userText}>
            <strong>{user?.username}</strong>
            <span>{user?.email}</span>
          </div>
        </div>
        <Button
          className={clsx(styles.logoutButton, isVisualCollapsed && styles.logoutButtonCollapsed)}
          onClick={handleLogout}
          variant="ghost"
          aria-label="Logout"
        >
          <FiLogOut />
          <span className={styles.logoutText}>Logout</span>
        </Button>
      </div>
    </aside>
  );
}

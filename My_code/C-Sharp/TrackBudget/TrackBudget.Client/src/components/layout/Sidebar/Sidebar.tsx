import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { navigationItems } from "../../../config/navigation";
import { useAuthStore } from "../../../store/authStore";

import { NavigationItem } from "../Navigation/Navigation";

import { Button } from "../../common/Button/Button";

import styles from "./Sidebar.module.scss";

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // Use replace to prevent going back to the previous page after logout
  };

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>
          <div className={styles.logoImage}> TB </div>

          <div>
            <strong>TrackBudget</strong>

            <p>Track your budget with ease</p>
          </div>
        </div>

        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <NavigationItem key={item.path} item={item} isActive />
          ))}
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {user?.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.username}</strong>
            <span>{user?.email}</span>
          </div>
        </div>
        <Button
          className={styles.logoutButton}
          onClick={handleLogout}
          variant="ghost"
        >
          <FiLogOut />
          Logout
        </Button>
        \
      </div>
    </aside>
  );
}

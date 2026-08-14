import { NavLink } from "react-router-dom";
import clsx from "clsx";

import type { NavigationItem as NavigationItemType } from "../../../config/navigation";

import styles from "./Navigation.module.scss";

interface NavigationItemProps {
  item: NavigationItemType;
  isCollapsed?: boolean;
}

export function NavigationItem({
  item,
  isCollapsed = false,
}: NavigationItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      // NavLink computes active route and applies highlighted style.
      className={({ isActive }) =>
        clsx(styles.navigationItem, isActive && styles.active)
      }
    >
      <Icon className={styles.icon} />
      <span
        className={clsx(styles.label, isCollapsed && styles.labelCollapsed)}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

import { NavLink } from "react-router-dom";
import clsx from "clsx";

import type { NavigationItem as NavigationItemType } from "../../../config/navigation";

import styles from "./Navigation.module.scss";

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

export function NavigationItem({ item }: NavigationItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        clsx(styles.navigationItem, isActive && styles.active)
      }
    >
      <Icon className={styles.icon} />
      <span className={styles.label}>{item.label}</span>
    </NavLink>
  );
}

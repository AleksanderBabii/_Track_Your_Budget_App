import type { IconType } from "react-icons";
import {
    FiBarChart2,
    FiCreditCard,
    FiDollarSign,
    FiFolder,
    FiHome,
    FiRepeat,
    FiSettings,
    FiUser,
} from "react-icons/fi";

export interface NavigationItem {
    label: string;
    path: string;
    icon: IconType;
    subItems?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: FiHome,
    },
    {
        label: "Accounts",
        path: "/accounts",
        icon: FiCreditCard,
    },
    {
        label: "Categories",
        path: "/categories",
        icon: FiFolder,
    },
    {
        label: "Transactions",
        path: "/transactions",
        icon: FiDollarSign,
    },
    {
        label: "Transfers",
        path: "/transfers",
        icon: FiRepeat,
    },
    {
        label: "Reports",
        path: "/reports",
        icon: FiBarChart2,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: FiSettings,
    },
    {
        label: "Profile",
        path: "/profile",
        icon: FiUser,
    },
];
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Outlet } from "react-router-dom";

import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

import styles from "./AppLayout.module.scss";

const SIDEBAR_COLLAPSED_KEY = "trackbudget_sidebar_collapsed";
const TABLET_BREAKPOINT_QUERY = "(max-width: 1024px)";

function getInitialSidebarCollapsedState(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    // Stored user preference wins across sessions.
    const storedValue = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    if (storedValue === "true") {
        return true;
    }

    if (storedValue === "false") {
        return false;
    }

    // First-visit fallback: collapse on tablet/mobile widths.
    return window.matchMedia(TABLET_BREAKPOINT_QUERY).matches;
}

export const AppLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        getInitialSidebarCollapsedState,
    );

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQueryList = window.matchMedia(TABLET_BREAKPOINT_QUERY);
        const hasStoredPreference =
            window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) !== null;

        if (hasStoredPreference) {
            // Do not auto-toggle if user explicitly chose a state.
            return;
        }

        const handleViewportChange = (event: MediaQueryListEvent) => {
            setIsSidebarCollapsed(event.matches);
        };

        mediaQueryList.addEventListener("change", handleViewportChange);

        return () => {
            mediaQueryList.removeEventListener("change", handleViewportChange);
        };
    }, []);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const nextValue = !prev;
            // Persist explicit user choice.
            window.localStorage.setItem(
                SIDEBAR_COLLAPSED_KEY,
                String(nextValue),
            );
            return nextValue;
        });
    };

    return (
        <div className={styles.appLayout}>
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={handleToggleSidebar}
            />

            <div
                className={clsx(
                    styles.mainContent,
                    isSidebarCollapsed && styles.mainContentExpanded,
                )}
            >
                <Header />

                <Outlet />
            </div>
        </div>
    );
};
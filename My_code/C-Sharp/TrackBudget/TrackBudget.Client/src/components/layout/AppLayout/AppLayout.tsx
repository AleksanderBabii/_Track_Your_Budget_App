import {Outlet} from "react-router-dom";

import {Header} from "../Header/Header";
import {Sidebar} from "../Sidebar/Sidebar";

import styles from "./AppLayout.module.scss";

export const AppLayout = () => {
    return (
        <div className={styles.appLayout}>
            <Sidebar />

            <div className={styles.mainContent}>
                <Header />

                <Outlet />
            </div>
        </div>
    );
}
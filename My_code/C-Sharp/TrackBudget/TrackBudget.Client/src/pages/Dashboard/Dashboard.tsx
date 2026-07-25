import {useNavigate} from "react-router-dom";

import { Button } from "../../components/common/Button/Button";
import { useAuthStore } from "../../store/authStore";

import styles from "./Dashboard.module.scss";

export function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/login", {replace: true});
    }

    return (
        <main className={styles.container}>
            <h1>Dashboard</h1>

            <p>Welcome to the dashboard! This is a protected route that requires authentication.</p>

            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
        </main>
    );
}

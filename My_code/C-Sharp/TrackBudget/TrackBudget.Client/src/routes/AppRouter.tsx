import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout/AppLayout";

import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Accounts } from "../pages/Accounts/Accounts";
import { Categories } from "../pages/Categories/Categories";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { TransactionPage } from "../pages/TransactionPage/TransactionPage";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

function PlaceholderPage({ title }: { title: string }) {
  return <div>{title} Page</div>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/accounts" element={<Accounts />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/transactions" element={<TransactionPage/>} />

        <Route path="/transfers" element={<PlaceholderPage title="Transfers" />} />

        <Route path="/reports" element={<PlaceholderPage title="Reports" />} />

        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

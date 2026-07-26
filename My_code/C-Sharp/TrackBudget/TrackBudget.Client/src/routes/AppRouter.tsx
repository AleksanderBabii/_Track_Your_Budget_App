import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout/AppLayout";

import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

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
      />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/accounts" element={<div>Accounts Page</div>} />

      <Route path="/categories" element={<div>Categories Page</div>} />

      <Route path="/transactions" element={<div>Transactions Page</div>} />

      <Route path="/transfers" element={<div>Transfers Page</div>} />

      <Route path="/reports" element={<div>Reports Page</div>} />

      <Route path="/settings" element={<div>Settings Page</div>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

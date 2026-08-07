import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout/AppLayout";
import { LoadingState } from "../components/common/LoadingState/LoadingState";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

const Dashboard = lazy(() =>
  import("../pages/Dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const Accounts = lazy(() =>
  import("../pages/Accounts/Accounts").then((module) => ({
    default: module.Accounts,
  })),
);
const Categories = lazy(() =>
  import("../pages/Categories/Categories").then((module) => ({
    default: module.Categories,
  })),
);
const Login = lazy(() =>
  import("../pages/Login/Login").then((module) => ({
    default: module.Login,
  })),
);
const Register = lazy(() =>
  import("../pages/Register/Register").then((module) => ({
    default: module.Register,
  })),
);
const TransactionPage = lazy(() =>
  import("../pages/TransactionPage/TransactionPage").then((module) => ({
    default: module.TransactionPage,
  })),
);

function PlaceholderPage({ title }: { title: string }) {
  return <div>{title} Page</div>;
}

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingState message="Loading page..." />}>
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

          <Route path="/transactions" element={<TransactionPage />} />

          <Route path="/transfers" element={<PlaceholderPage title="Transfers" />} />

          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />

          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

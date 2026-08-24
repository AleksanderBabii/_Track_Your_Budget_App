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
  import("../pages/Transactions/Transactions").then((module) => ({
    default: module.Transactions,
  })),
);

const TransfersPage = lazy(() =>
  import("../pages/Transfer/Transfers").then((module) => ({
    default: module.Transfers,
  })),
);

const BudgetPage = lazy(() =>
  import("../pages/Budget/Budget").then((module) => ({
    default: module.BudgetPage,
  })),
);

const ReportPage = lazy(() =>
  import("../pages/Report/Report").then((module) => ({
    default: module.Report,
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

          <Route path="/budgets" element={<BudgetPage />} />

          <Route path="/transfers" element={<TransfersPage />} />

          <Route path="/reports" element={<ReportPage />} />
          
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

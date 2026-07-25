import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import {useAuthStore} from "../store/authStore";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

    return <>{children}</>;
}
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { hasAccessToken } from "@/lib/auth";

export function ProtectedRoute() {
  const location = useLocation();

  if (!hasAccessToken()) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// Import your auth selector or hook (adjust according to your auth state setup)
import { useSelector } from "react-redux";

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Replace this with your actual user state/selector
  const user = useSelector((state: any) => state.auth?.user);
  const token = useSelector((state: any) => state.auth?.token);

  // 1. If not logged in, redirect to login
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user's role matches ADMIN (adjust checking based on your user object)
  const isAdmin = user?.role === "ADMIN" || user?.role?.name === "ADMIN";

  if (!isAdmin) {
    // If logged in but not Admin, redirect to Home (or an Unauthorized page)
    return <Navigate to="/" replace />;
  }

  // Render children or nested Outlet
  return children ? <>{children}</> : <Outlet />;
};

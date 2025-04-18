import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const PublicRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.applicant.accessToken
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

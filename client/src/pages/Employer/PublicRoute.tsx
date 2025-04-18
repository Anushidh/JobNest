import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const PublicRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.employer.accessToken
  );

  if (isAuthenticated) {
    return <Navigate to="/employer" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

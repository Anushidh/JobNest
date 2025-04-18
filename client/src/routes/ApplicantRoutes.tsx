import { Route, Routes, useLocation } from "react-router";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

import { RootState } from "../app/store";
import ApplicantLayout from "../layouts/ApplicantLayout";
import {
  AllJobs,
  ApplicantSignin,
  ApplicantSignup,
  Dashboard,
  EditApplicantProfile,
  Home,
  JobDetail,
  OtpForm,
  Plans,
} from "../pages/Applicant";
import PublicRoute from "../pages/Applicant/PublicRoute";

const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.applicant.accessToken
  );
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

const Applicant = () => {
  return (
    <Routes>
      <Route element={<ApplicantLayout />}>
        <Route path="" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<EditApplicantProfile />} />
          <Route path="/view-jobs" element={<AllJobs />} />
          <Route path="/job/:jobId" element={<JobDetail />} />
          <Route path="/plans" element={<Plans />} />
        </Route>
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<ApplicantSignup />} />
        <Route path="/signin" element={<ApplicantSignin />} />
        <Route path="/verify" element={<OtpForm />} />
      </Route>
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  );
};

export default Applicant;

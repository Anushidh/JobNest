import { Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

import EmployerLayout from "../layouts/EmployerLayout";
import PublicRoute from "../pages/Employer/PublicRoute";
import {
  Applications,
  Dashboard,
  EmployerSignup,
  EmployerSignIn,
  OtpForm,
  JobPostForm,
  EmployerSettings,
  PostedJobs,
  EditJobForm,
  EmployerPlans,
} from "../pages/Employer";



const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.employer.accessToken
  );

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/employer/signin" state={{ from: location }} replace />
  );
};

const EmployerRoutes = () => {
  return (
    <Routes>
      <Route element={<EmployerLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="applicants" element={<Applications />} />
          <Route path="post-job" element={<JobPostForm />} />
          <Route path="edit-job/:jobId" element={<EditJobForm />} />
          <Route path="posted-jobs" element={<PostedJobs />} />
          <Route path="plans" element={<EmployerPlans />} />
          <Route path="settings" element={<EmployerSettings />} />
        </Route>
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="signup" element={<EmployerSignup />} />
        <Route path="signin" element={<EmployerSignIn />} />
        <Route path="verify" element={<OtpForm />} />
      </Route>
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
};

export default EmployerRoutes;

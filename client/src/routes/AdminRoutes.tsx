import { Navigate, Route, Routes } from "react-router";

import { AdminSignin, ApplicantsTable, EmployersTable } from "../pages/Admin";
import AdminLayout from "../layouts/AdminLayout";

const Admin = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/applicants" element={<ApplicantsTable />} />
        <Route path="/employers" element={<EmployersTable />} />
        <Route path="/view-jobs" element={<div>Admin View Jobs</div>} />
        <Route path="/job/:jobId" element={<div>Admin Job Detail</div>} />
        <Route path="/plans" element={<div>Admin Plans</div>} />
      </Route>
      <Route path="/signin" element={<AdminSignin />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  );
};

export default Admin;

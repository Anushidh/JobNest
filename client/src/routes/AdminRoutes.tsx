import { Navigate, Route, Routes } from "react-router";

import {
  AdminSignin,
  ApplicantPlanEditForm,
  ApplicantPlansTable,
  ApplicantsTable,
  EmployerPlanEditForm,
  EmployerPlanForm,
  EmployerPlansTable,
  EmployersTable,
} from "../pages/Admin";
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
        <Route path="/employer-plans" element={<EmployerPlansTable />} />
        {/* <Route path="/employer-plans/:planId" element={<div>Plan Detail</div>} /> */}
        <Route path="/employer-plans/create" element={<EmployerPlanForm />} />
        <Route
          path="/employer-plans/edit/:planId"
          element={<EmployerPlanEditForm />}
        />
        <Route path="/applicant-plans" element={<ApplicantPlansTable />} />
        <Route
          path="/applicant-plans/edit/:planId"
          element={<ApplicantPlanEditForm />}
        />
      </Route>
      <Route path="/signin" element={<AdminSignin />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  );
};

export default Admin;

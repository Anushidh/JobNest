import { useNavigate } from "react-router";
import { useGetAllEmployerPlansQuery } from "../../api/endpoints/planApi";
import { EmployerPlan } from "../../types/employerTypes";

const EmployerPlansTable = () => {
  const { data: plans, isLoading, error } = useGetAllEmployerPlansQuery();
  const navigate = useNavigate();

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-4 text-red-500">Failed to load plans.</p>
    );

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Employer Plans</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          + Add Plan
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm text-gray-700">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left px-3 py-2">Plan Name</th>
            <th className="text-left px-3 py-2">Job Posts</th>
            <th className="text-left px-3 py-2">Credits</th>
            <th className="text-left px-3 py-2">Price ($)</th>
            <th className="text-left px-3 py-2">Duration</th>
            <th className="text-left px-3 py-2">Applicants</th>
            <th className="text-left px-3 py-2">Support</th>
            <th className="text-left px-3 py-2">Featured</th>
            <th className="text-left px-3 py-2">Analytics</th>
            <th className="text-left px-3 py-2">Highlight</th>
            <th className="text-left px-3 py-2">Branding</th>
            <th className="text-left px-3 py-2">Insights</th>
            <th className="text-left px-3 py-2">Resumes</th>
            <th className="text-left px-3 py-2">Description</th>
            <th className="text-left px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans?.map((plan: EmployerPlan) => (
            <tr key={plan.name} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2 capitalize font-medium">{plan.name}</td>
              <td className="px-3 py-2">{plan.jobPostLimit}</td>
              <td className="px-3 py-2">{plan.credits}</td>
              <td className="px-3 py-2">${plan.price}</td>
              <td className="px-3 py-2">{plan.durationInDays} days</td>
              <td className="px-3 py-2">
                {plan.canViewApplicants ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">
                {plan.prioritySupport ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">{plan.featuredJobSlots}</td>
              <td className="px-3 py-2">
                {plan.analyticsAccess ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">
                {plan.highlightCompany ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">
                {plan.customBranding ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">
                {plan.candidateInsights ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">
                {plan.canDownloadResumes ? "Yes" : "No"}
              </td>
              <td className="px-3 py-2">{plan.planDescription || "—"}</td>
              <td className="px-3 py-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                  onClick={() => navigate(`/admin/employer-plans/edit/${plan._id}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployerPlansTable;

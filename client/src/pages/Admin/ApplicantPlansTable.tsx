import { useNavigate } from "react-router";
import { useGetAllApplicantPlansQuery } from "../../api/endpoints/planApi";
import { ApplicantPlan } from "../../types/applicantTypes";

const ApplicantPlansTable = () => {
  const { data: plans, isLoading, error } = useGetAllApplicantPlansQuery();
  const navigate = useNavigate();
  console.log(plans);
  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-4 text-red-500">Failed to load plans.</p>
    );

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Applicant Plans</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          + Add Plan
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm text-gray-700">
        <thead className="bg-gray-100 border-b text-center">
          <tr>
            <th className="px-3 py-2">Plan Name</th>
            <th className="px-3 py-2">Job Applications</th>
            <th className="px-3 py-2">Credits</th>
            <th className="px-3 py-2">Price (₹)</th>
            <th className="px-3 py-2">Duration</th>
            <th className="px-3 py-2">Chat Access</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans?.map((plan: ApplicantPlan) => (
            <tr key={plan._id} className="border-b hover:bg-gray-50">
              <td className="text-center px-3 py-2 capitalize font-medium">{plan.name}</td>
              <td className="text-center px-3 py-2">{plan.jobApplyLimit}</td>
              <td className="text-center px-3 py-2">{plan.credits}</td>
              <td className="text-center px-3 py-2">₹{plan.price}</td>
              <td className="text-center px-3 py-2">{plan.durationInDays} days</td>
              <td className="text-center px-3 py-2">{plan.canAccessChat ? "Yes" : "No"}</td>
              <td className="text-center px-3 py-2">{plan.planDescription || "—"}</td>
              <td className="text-center px-3 py-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                  onClick={() =>
                    navigate(`/admin/applicant-plans/edit/${plan._id}`)
                  }
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

export default ApplicantPlansTable;

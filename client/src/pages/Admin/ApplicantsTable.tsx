import { useState } from "react";
import {
  useGetAllApplicantsQuery,
  useToggleApplicantBlockStatusMutation,
} from "../../api/endpoints/adminApi";

const ApplicantsTable = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, refetch } = useGetAllApplicantsQuery({
    page,
    limit,
  });
  const [toggleBlock] = useToggleApplicantBlockStatusMutation();

  const handleToggleBlock = async (id: string, currentStatus: boolean) => {
    await toggleBlock(id).unwrap();
    refetch();
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-md" />
    );
  }

  if (isError) {
    return <div className="text-red-500">Error loading applicants</div>;
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Profile Picture</th>
            <th className="px-4 py-2 text-center">Verified</th>
            <th className="px-4 py-2 text-center">Plan</th>
            <th className="px-4 py-2 text-center">Plan Expires At</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.applicants.map((applicant) => (
            <tr key={applicant._id} className="border-t">
              <td className="px-4 py-2 text-center">{applicant.name}</td>
              <td className="px-4 py-2 text-center">{applicant.email}</td>
              <td className="px-4 py-2 text-center">
                {applicant.profilePicture ? (
                  <img
                    src={applicant.profilePicture}
                    alt={`${applicant.name}'s profile`}
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto" />
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    applicant.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {applicant.isVerified ? "Verified" : "Not Verified"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                {applicant.plan ? (
                  <span className="text-sm text-blue-600">Active Plan</span>
                ) : (
                  <span className="text-sm text-gray-600">No Plan</span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {applicant.planExpiresAt ? (
                  <span className="text-sm">
                    {new Date(applicant.planExpiresAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">N/A</span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    applicant.isBlocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {applicant.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!applicant.isBlocked}
                      onChange={() =>
                        handleToggleBlock(applicant._id, applicant.isBlocked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-200"></div>
                  </label>
                  <span className="text-sm">
                    {applicant.isBlocked ? "Unblock" : "Block"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t text-sm">
        <div className="text-gray-600">
          Showing {data?.applicants.length} of {data?.total} applicants
        </div>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>
            Page {page} of {data?.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data?.pages || p, p + 1))}
            disabled={page === data?.pages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsTable;

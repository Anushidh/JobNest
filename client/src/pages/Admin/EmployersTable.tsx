import { useState } from "react";
import {
  useGetAllEmployersQuery,
  useToggleEmployerBlockStatusMutation,
} from "../../api/endpoints/adminApi";

const EmployersTable = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, refetch } = useGetAllEmployersQuery({
    page,
    limit,
  });
  const [toggleBlock] = useToggleEmployerBlockStatusMutation();

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
    return <div className="text-red-500">Error loading employers</div>;
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-center">Company Name</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Company Logo</th>
            <th className="px-4 py-2 text-center">Verified</th>
            <th className="px-4 py-2 text-center">Industry</th>
            <th className="px-4 py-2 text-center">Plan</th>
            <th className="px-4 py-2 text-center">Plan Expires At</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.employers.map((employer) => (
            <tr key={employer._id} className="border-t">
              <td className="px-4 py-2 text-center">{employer.companyName}</td>
              <td className="px-4 py-2 text-center">{employer.email}</td>
              <td className="px-4 py-2 text-center">
                {employer.companyLogo ? (
                  <img
                    src={employer.companyLogo}
                    alt={`${employer.companyName} logo`}
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto" />
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employer.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {employer.isVerified ? "Verified" : "Not Verified"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">{employer.industry}</td>
              <td className="px-4 py-2 text-center">
                {employer.plan ? (
                  <span className="text-sm text-blue-600">Active Plan</span>
                ) : (
                  <span className="text-sm text-gray-600">No Plan</span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {employer.planExpiresAt ? (
                  <span className="text-sm">
                    {new Date(employer.planExpiresAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">N/A</span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employer.isBlocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {employer.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!employer.isBlocked}
                      onChange={() =>
                        handleToggleBlock(employer._id, employer.isBlocked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-200"></div>
                  </label>
                  <span className="text-sm">
                    {employer.isBlocked ? "Unblock" : "Block"}
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
          Showing {data?.employers.length} of {data?.total} employers
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

export default EmployersTable;

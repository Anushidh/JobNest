import { useParams } from "react-router";
import {
  useGetApplicationsForJobQuery,
  useToggleApplicationStatusMutation,
} from "../../api/endpoints/jobApi";

const JobApplications = () => {
  const { jobId } = useParams();

  const {
    data: applications,
    error,
    isLoading,
    refetch,
  } = useGetApplicationsForJobQuery(jobId);
  const [toggleApplicationStatus] = useToggleApplicationStatusMutation();

  const handleToggleStatus = async (appId: string) => {
    await toggleApplicationStatus(appId).unwrap();

    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading applications: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4">Job Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-600 border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-center">Applicant</th>
              <th className="p-2 border text-center">Email</th>
              <th className="p-2 border text-center">Resume</th>
              <th className="p-2 border text-center">Status</th>
              <th className="p-2 border text-center">Applied On</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((app: any, index: number) => (
              <tr
                key={app._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border text-center">
                  {app.applicant?.name}
                </td>
                <td className="p-2 border text-center">
                  {app.applicant?.email}
                </td>
                <td className="p-2 border text-center">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </td>
                <td
                  className={`p-2 border text-center capitalize font-semibold
    ${
      app.status === "pending"
        ? "text-yellow-600"
        : app.status === "accepted"
        ? "text-green-600"
        : "text-red-600"
    }
  `}
                >
                  {app.status}
                </td>

                <td className="p-2 border text-center">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleToggleStatus(app._id)}
                    className="px-4 py-2 rounded-full font-semibold text-[13px] text-white bg-[rgb(88,81,211)] hover:bg-[rgb(72,67,180)] transition-colors duration-200"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobApplications;

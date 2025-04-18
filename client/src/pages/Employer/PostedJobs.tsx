import { useNavigate } from "react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useDeleteJobMutation,
  useGetEmployerJobsQuery,
} from "../../api/endpoints/jobApi";
import { toast } from "react-toastify";

const PostedJobs = () => {
  const navigate = useNavigate();
  const {
    data: jobs = [],
    isLoading,
    isError,
    error,
  } = useGetEmployerJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const MySwal = withReactContent(Swal);
  
  const handleDelete = async (jobId: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this job?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteJob(jobId).unwrap();
        toast.success("Job deleted successfully");
        // Optionally, refetch or update local state here
      } catch (error: unknown) {
        let errorMessage = "Something went wrong.";

        if (typeof error === "object" && error !== null && "status" in error) {
          const err = error as FetchBaseQueryError;

          if ("data" in err) {
            if (typeof err.data === "string") {
              errorMessage = err.data;
            } else if (typeof err.data === "object" && err.data !== null) {
              errorMessage =
                (err.data as { message?: string }).message || errorMessage;
            }
          }
        }

        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) return <p>Loading jobs...</p>;
  if (isError) return <p>Error loading jobs: {error?.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4">Posted Jobs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-600 border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-center">Title</th>
              <th className="p-2 border text-center">Job Type</th>
              <th className="p-2 border text-center">Location</th>
              <th className="p-2 border text-center">Salary</th>
              <th className="p-2 border text-center">Experience</th>
              <th className="p-2 border text-center">Deadline</th>
              <th className="p-2 border text-center">Status</th>
              <th className="p-2 border text-center">Applications</th>
              <th className="p-2 border text-center">Featured</th>
              <th className="p-2 border text-center">Posted</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr
                key={job._id || index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border text-center">{job.title}</td>
                <td className="p-2 border text-center capitalize">
                  {job.jobType}
                </td>
                <td className="p-2 border text-center capitalize">
                  {job.location}
                </td>
                <td className="p-2 border text-center">
                  ₹{job.salary?.min?.toLocaleString?.("en-IN")} - ₹
                  {job.salary?.max?.toLocaleString?.("en-IN")}
                </td>

                <td className="p-2 border text-center capitalize">
                  {job.experienceLevel}
                </td>
                <td className="p-2 border text-center">
                  {new Date(job.deadline).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center capitalize">
                  {job.status}
                </td>
                <td className="p-2 border text-center">
                  {job.applications?.length || 0}
                </td>
                <td className="p-2 border text-center">
                  {job.isFeatured ? "Yes" : "No"}
                </td>
                <td className="p-2 border text-center">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  <button
                    className="px-4 py-2 rounded-full font-semibold text-[13px] text-white bg-[rgb(88,81,211)] hover:bg-[rgb(72,67,180)] transition-colors duration-200 mr-2"
                    onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 rounded-full font-semibold text-[13px] text-[rgb(88,81,211)] border-2 border-[rgb(88,81,211)] bg-transparent hover:bg-[rgb(88,81,211)] hover:text-white transition duration-200"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
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

export default PostedJobs;

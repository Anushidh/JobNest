import { toast } from "react-toastify";

import { useApplyForJobMutation } from "../../api/endpoints/jobApi";
import { Job } from "../../types/applicantTypes";
import { Link } from "react-router";

const MainJobCard = ({
  job,
  hasApplied,
  onApplied,
}: {
  job: Job;
  hasApplied: boolean;
  onApplied: () => void;
}) => {
  const [applyForJob] = useApplyForJobMutation();
  const handleApply = async () => {
    if (hasApplied) return;
    await applyForJob({ jobId: job._id }).unwrap();
    toast.success("Job application submitted!");
    onApplied();
  };
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {/* First Row */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <img
            src={job.companyLogo || "https://via.placeholder.com/50"}
            alt="Company Logo"
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.companyName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApply}
            disabled={hasApplied}
            className="text-sm font-semibold bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </button>

          {/* <button
            className="text-sm font-semibold bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300"
            disabled={hasApplied}
          >
            Not Interested
          </button> */}
        </div>
      </div>

      {/* Location, experience, salary */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📍 {job.location || "Remote"}</span>
          <span>🧠 {job.experienceLevel || "0-1 yrs"}</span>
          <span>
            💰{" "}
            {job.salary
              ? `₹${job.salary.min} - ₹${job.salary.max}`
              : "Not Disclosed"}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {(job.skillsRequired || []).map((skill: string, idx: number) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
        <Link
          to={`/job/${job._id}`} // Link to the job detail page with jobId
          className="text-sm text-indigo-600 hover:underline"
        >
          View More
        </Link>
      </div>

      {/* Description */}
      <div className="mt-3 text-sm text-gray-600">
        <p className="line-clamp-2">{job.description?.slice(0, 150)}...</p>
        <Link
          to={`/job/${job._id}`} // Link to the job detail page with jobId
          className="mt-1 text-indigo-600 hover:underline text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default MainJobCard;

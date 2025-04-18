import { useDeleteSavedJobMutation } from "../../api/endpoints/jobApi";
import { Job } from "../../types/applicantTypes";

interface MainSavedCardProps {
  job: Job;
  onDeleteSuccess: () => void; // Callback function to be called on successful deletion
}

const MainSavedCard = ({ job, onDeleteSuccess }: MainSavedCardProps) => {
  const [deleteSavedJob, { isLoading }] = useDeleteSavedJobMutation();

  const handleDelete = async () => {
    try {
      await deleteSavedJob(job._id).unwrap();
      console.log("Deleted from saved jobs");
      onDeleteSuccess();
    } catch (err) {
      console.error("Failed to delete saved job:", err);
    }
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

        <div className="flex flex-col items-end gap-2">
          <button
            className="text-gray-500 hover:text-red-600 text-lg"
            onClick={handleDelete}
            disabled={isLoading}
          >
            🗑️
          </button>
          <div className="flex gap-2">
            <button className="text-sm font-semibold bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700">
              Apply Now
            </button>
            <button className="text-sm font-semibold bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300">
              Not Interested
            </button>
          </div>
        </div>
      </div>

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

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {(job.skillsRequired || []).map((skill: string, idx: number) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
        <button className="text-sm text-indigo-600 hover:underline">
          View More
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p className="line-clamp-2">{job.description?.slice(0, 150)}...</p>
        <button className="mt-1 text-indigo-600 hover:underline text-sm">
          Read More
        </button>
      </div>
    </div>
  );
};

export default MainSavedCard;

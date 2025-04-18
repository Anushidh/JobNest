import { useListJobsQuery } from "../../api/endpoints/jobApi";
import { Link } from "react-router";

const JobCards = () => {
  const { data: jobs = [], isLoading } = useListJobsQuery({
    page: 1,
    limit: 5,
    search: "",
    jobType: [],
    location: [],
    experienceLevel: [],
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-gray-600 font-semibold">
          More jobs for you
        </h3>
        <Link
          to="/jobs"
          className="text-sm text-indigo-600 font-semibold hover:underline"
        >
          View All Jobs →
        </Link>
      </div>

      {isLoading ? (
        <div className="text-gray-600">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded-lg shadow text-sm flex flex-col items-center text-center"
            >
              <img
                src={job.companyLogo || "https://via.placeholder.com/50"}
                alt="Company Logo"
                className="w-14 h-14 object-contain mb-2"
              />
              <div className="text-gray-600">{job.title}</div>
              <div className="text-gray-500 text-xs">{job.location}</div>
              <Link
                to={`/jobs/${job._id}`}
                className="mt-2 text-[rgb(88,81,211)] text-xs font-semibold"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobCards;

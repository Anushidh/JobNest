import { useState } from "react";
import { useGetSavedJobsQuery } from "../../api/endpoints/jobApi";

import { Job } from "../../types/applicantTypes";
import MainSavedCard from "../../components/Applicant/MainSavedCard";

const SavedJobs = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: savedJobs = [],
    isLoading,
    isError,
    refetch,
  } = useGetSavedJobsQuery({ page, limit });

  if (isLoading) return <div>Loading saved jobs...</div>;
  if (isError) return <div>Error fetching saved jobs.</div>;

  return (
    <div className="p-6">
      {savedJobs.length === 0 ? (
        <p>No saved jobs found.</p>
      ) : (
        <>
          {savedJobs.map((job: Job) => (
            <MainSavedCard key={job._id} job={job} onDeleteSuccess={refetch} />
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              ← Prev
            </button>

            <span className="text-gray-700 font-semibold text-sm">
              Page {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedJobs;

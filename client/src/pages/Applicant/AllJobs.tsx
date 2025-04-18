import { useState } from "react";
import { useSelector } from "react-redux";

import { useListJobsQuery } from "../../api/endpoints/jobApi";
import { Job } from "../../types/applicantTypes";
import MainJobCard from "../../components/Applicant/MainJobCard";
import { RootState } from "../../app/store";

const AllJobs = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const [filterState, setFilterState] = useState({
    jobType: [],
    location: [],
    experienceLevel: [],
  });
  const [appliedFilters, setAppliedFilters] = useState(filterState);

  const limit = 5;

  const {
    data: jobs = [],
    isLoading,
    refetch,
  } = useListJobsQuery({
    page,
    limit,
    search: searchInput,
    jobType: appliedFilters.jobType,
    location: appliedFilters.location,
    experienceLevel: appliedFilters.experienceLevel,
  });
  console.log(jobs.length);
  const applicantId =
    useSelector((state: RootState) => state.applicant.applicant?._id) || "";

  // Reusable checkbox handler
  const toggleCheckbox = (
    value: string,
    key: "jobType" | "location" | "experienceLevel"
  ) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const applyFilters = () => {
    console.log(appliedFilters);
    setAppliedFilters({ ...filterState });
    setPage(1); // Reset to first page after applying filters
  };

  return (
    <div className="flex px-2 py-8 gap-2 bg-gray-100 min-h-screen">
      {/* Left Section: Filters */}
      <div className="w-[270px] bg-white p-4 rounded-lg shadow space-y-4">
        {/* Job Type Filter */}
        <div className="w-[270px] bg-white p-4 rounded-lg shadow space-y-4">
          {/* Job Type Filter */}
          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-1">
              Job Type
            </h3>
            {["full-time", "part-time", "contract", "internship"].map(
              (type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`jobType-${type}`}
                    checked={filterState.jobType.includes(type)}
                    onChange={() => toggleCheckbox(type, "jobType")}
                  />
                  <label
                    htmlFor={`jobType-${type}`}
                    className="text-sm text-gray-700 capitalize"
                  >
                    {type}
                  </label>
                </div>
              )
            )}
          </div>

          {/* Work Mode Filter */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">
              Work Mode
            </h3>
            {["onsite", "hybrid", "remote"].map((mode) => (
              <div key={mode} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`location-${mode}`}
                  checked={filterState.location.includes(mode)}
                  onChange={() => toggleCheckbox(mode, "location")}
                />
                <label
                  htmlFor={`location-${mode}`}
                  className="text-sm text-gray-700 capitalize"
                >
                  {mode}
                </label>
              </div>
            ))}
          </div>

          {/* Experience Level Filter */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">
              Experience Level
            </h3>
            {["entry", "mid", "senior", "lead"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`exp-${level}`}
                  checked={filterState.experienceLevel.includes(level)}
                  onChange={() => toggleCheckbox(level, "experienceLevel")}
                />
                <label
                  htmlFor={`exp-${level}`}
                  className="text-sm text-gray-700 capitalize"
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded text-sm"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* Right Section: Search + Job Cards */}
      <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search jobs by title, skill, or company"
          className="w-[300px] px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {isLoading ? (
          <div>Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px] animate-fadeIn">
            <p className="text-xl font-semibold text-gray-700">No jobs found</p>
          </div>
        ) : (
          <>
            {jobs.map((job: Job) => {
              const hasApplied = job.applications.includes(applicantId);
              return (
                <MainJobCard
                  key={job._id}
                  job={job}
                  hasApplied={hasApplied}
                  onApplied={refetch}
                />
              );
            })}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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
    </div>
  );
};

export default AllJobs;

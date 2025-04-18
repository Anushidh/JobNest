import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const JobLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAllJobs = location.pathname === "/view-jobs";

  // Basic filter state (optional now, could be lifted later)
  const [jobType, setJobType] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [experience, setExperience] = useState("");

  const handleCheckboxChange = (type: string) => {
    setJobType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="flex px-2 py-8 gap-2 bg-gray-100">
      {/* Left Section: Filters (1/5) */}
      <div className="w-[270px] bg-white p-4 rounded-lg shadow space-y-4">
        {/* Job Type Filter */}
        <div>
          <h3 className="font-semibold text-sm mb-1">Job Type</h3>
          {["full-time", "part-time", "contract", "internship"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`jobType-${type}`}
                name="jobType"
                value={type}
              />
              <label htmlFor={`jobType-${type}`} className="text-sm capitalize">
                {type}
              </label>
            </div>
          ))}
        </div>

        {/* Location Type Filter */}
        <div>
          <h3 className="font-semibold text-sm mb-1">Work Mode</h3>
          {["onsite", "hybrid", "remote"].map((mode) => (
            <div key={mode} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`location-${mode}`}
                name="locationType"
                value={mode}
              />
              <label
                htmlFor={`location-${mode}`}
                className="text-sm capitalize"
              >
                {mode}
              </label>
            </div>
          ))}
        </div>

        {/* Experience Level Filter */}
        <div>
          <h3 className="font-semibold text-sm mb-1">Experience Level</h3>
          {["entry", "mid", "senior", "lead"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`exp-${level}`}
                name="experience"
                value={level}
              />
              <label htmlFor={`exp-${level}`} className="text-sm capitalize">
                {level}
              </label>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded text-sm">
          Apply Filters
        </button>
      </div>

      {/* Middle Section: Job Cards (4/5) */}
      <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search jobs by title, skill, or company"
          className="w-[300px] px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />


        {children}
      </div>
    </div>
  );
};

export default JobLayout;

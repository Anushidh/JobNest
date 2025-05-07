import { useSelector } from "react-redux";
import { useGetEmployerStatsQuery } from "../../api/endpoints/employerApi";
import { RootState } from "../../app/store";

const KeyStats = () => {
  const employerId = useSelector(
    (state: RootState) => state.employer.employer?._id
  );

  const { data: stats, isLoading, isError } = useGetEmployerStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4">
            <div className="animate-pulse">
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
        Failed to load statistics
      </div>
    );
  }

  if (!employerId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-xl">
        Please log in to view statistics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-gray-600 text-sm">Total Jobs Posted</h2>
        <p className="text-2xl font-semibold text-blue-600">
          {stats?.totalJobs || 0}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-gray-600 text-sm">Total Applications</h2>
        <p className="text-2xl font-semibold text-green-600">
          {stats?.totalApplications || 0}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-gray-600 text-sm">Active Jobs</h2>
        <p className="text-2xl font-semibold text-purple-600">
          {stats?.activeJobs || 0}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-gray-600 text-sm">Applications In Review</h2>
        <p className="text-2xl font-semibold text-orange-500">
          {stats?.applicationsInReview || 0}
        </p>
      </div>
    </div>
  );
};

export default KeyStats;

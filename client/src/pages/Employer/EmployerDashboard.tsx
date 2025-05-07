import { Link } from "react-router";
import KeyStats from "../../components/Employer/KeyStats";
import EmployerProfileCard from "../../components/Employer/EmployerProfileCard";
import SubscriptionPlanCard from "../../components/Employer/SubscriptionPlanCard";

const EmployerDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
        <Link
          to="/employer/post-job"
          className="px-4 py-2 rounded-full font-semibold text-[13px] text-white bg-[rgb(88,81,211)] hover:bg-[rgb(72,67,180)] transition-colors duration-200"
        >
          Post a Job
        </Link>
      </div>

      {/* Key Stats Section */}
      <KeyStats />

      {/* Profile & Subscription Section */}
      <div className="flex mt-10 gap-6 bg-white p-6 rounded-xl shadow">
        {/* Left: Profile */}
        <div className="flex-1">
          <EmployerProfileCard />
        </div>

        {/* Right: Subscription */}
        <div className="w-1/3">
          <SubscriptionPlanCard />
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

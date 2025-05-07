import Conversations from "../../components/Applicant/Conversations";
import JobCards from "../../components/Applicant/JobCards";
import TalentCard from "../../components/Applicant/TalentCard";

const Dashboard = () => {
  return (
    <div className="flex px-28 py-8 gap-6 bg-gray-100 min-h-screen">
      {/* Left Section (Main Dashboard) */}
      <div className="w-full  bg-gray-100 rounded-lg">
        {/* Conversations */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <Conversations />
        </div>

        {/* Talent Card */}
        <div className="bg-white p-4 rounded-lg text-gray-700 shadow mb-4">
          <TalentCard />
        </div>

        {/* Job Cards */}
        <div className="bg-white p-4 rounded-lg text-gray-700 shadow">
          <JobCards />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import EmployerProfileCard from "../../components/Employer/EmployerProfileCard";
import SubscriptionPlanCard from "../../components/Employer/SubscriptionPlanCard";

const EmployerSettings = () => {
  return (
    <div className="flex px-28 py-8 gap-6 bg-gray-100">
      {/* Left: Employer Profile */}
      <div className="flex-1">
        <EmployerProfileCard />
      </div>

      {/* Right: Subscription Plan */}
      <div className="w-1/3">
        <SubscriptionPlanCard />
      </div>
    </div>
  );
};

export default EmployerSettings;

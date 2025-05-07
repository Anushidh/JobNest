import EmployerProfileCard from "../../components/Employer/EmployerProfileCard";
import SubscriptionPlanCard from "../../components/Employer/SubscriptionPlanCard";

const EmployerProfile = () => {
  return (
    <div className="px-6 py-6">
      {/* Other dashboard sections/components above this */}
      
      {/* Employer Settings Section */}
      <div className="flex min-h-[60vh] px-6 py-6 gap-6 bg-gray-100 rounded-xl">
        {/* Left: Employer Profile */}
        <div className="flex-1">
          <EmployerProfileCard />
        </div>

        {/* Right: Subscription Plan */}
        <div className="w-1/3">
          <SubscriptionPlanCard />
        </div>
      </div>
      
      {/* Other dashboard sections/components below this */}
    </div>
  );
};

export default EmployerProfile;

import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { CheckCircle2, XCircle } from "lucide-react";

const SubscriptionPlanCard = () => {
  const activePlan = useSelector(
    (state: RootState) => state.employer.employer?.plan
  );

  if (!activePlan) {
    return (
      <div className="bg-white text-center rounded-2xl shadow-md p-6 text-sm text-gray-600 mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Active Subscription
        </h3>
        <p className="text-gray-500">
          No active subscription plan found. Please subscribe to access premium
          features.
        </p>
      </div>
    );
  }

  const { name, price, features } = activePlan;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-sm text-gray-700 mx-auto text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Active Subscription
      </h3>

      <div className="mb-4 space-y-1">
        <p>
          <span className="font-medium text-gray-800">Plan:</span>{" "}
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </p>
        <p>
          <span className="font-medium text-gray-800">Price:</span> ₹{price}
        </p>
        <p>
          <span className="font-medium text-gray-800">Duration:</span>{" "}
          {features.durationInDays} days
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Plan Features
        </h4>
        <ul className="space-y-2 text-gray-600 flex flex-col items-center">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>
              Job Limit:{" "}
              <span className="font-medium">
                {features.jobLimit === "unlimited"
                  ? "Unlimited"
                  : features.jobLimit}
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            {features.highlightJobs ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span>Highlight Jobs: {features.highlightJobs ? "Yes" : "No"}</span>
          </li>
          <li className="flex items-center gap-2">
            {features.premiumSupport ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span>
              Premium Support: {features.premiumSupport ? "Yes" : "No"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;

import { useGetAllEmployerPlansQuery } from "../../api/endpoints/planApi";
import { IEmployerPlan } from "../../types/employerTypes";

const EmployerPlans = () => {
  const { data, isLoading, isError } = useGetAllEmployerPlansQuery();

  if (isLoading) return <p className="text-center mt-10">Loading plans...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load plans.</p>
    );

  const plans: IEmployerPlan[] = data?.plans || [];

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-600 mb-10">
        Choose the Right Plan for You
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => {
          const features: { [key: string]: boolean | number } = {
            "Can View Applicants": plan.canViewApplicants,
            Credits: plan.credits > 0,
            "Priority Support": plan.prioritySupport,
            "Featured Job Slots": plan.featuredJobSlots > 0,
            "Analytics Access": plan.analyticsAccess,
            "Highlight Company": plan.highlightCompany,
            "Custom Branding": plan.customBranding,
            "Candidate Insights": plan.candidateInsights,
            "Download Resumes": plan.canDownloadResumes,
            "Job Post Limit": plan.jobPostLimit !== Number.MAX_SAFE_INTEGER,
          };

          return (
            <div
              key={plan._id}
              className="w-full max-w-sm border rounded-2xl overflow-hidden shadow-md hover:shadow-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-[rgb(88,81,211)] text-white text-center py-4 text-xl font-semibold capitalize">
                {plan.name}
              </div>

              <div className="p-6 text-gray-700 text-sm flex flex-col justify-between flex-1">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-[rgb(88,81,211)]">
                    ₹{plan.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    Duration: {plan.durationInDays} days
                  </p>
                </div>

                {plan.planDescription && (
                  <p className="mb-4">{plan.planDescription}</p>
                )}

                <ul className="mb-6 space-y-1 text-sm">
                  {Object.entries(features).map(([label, isAvailable], i) => (
                    <li key={i} className="flex items-center">
                      <span
                        className={`text-lg ${
                          isAvailable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isAvailable ? "✔" : "✖"}
                      </span>
                      <span className="ml-2">
                        {label}
                        {label === "Credits" && isAvailable
                          ? ` (${plan.credits})`
                          : ""}
                        {label === "Featured Job Slots" &&
                        plan.featuredJobSlots > 0
                          ? ` (${plan.featuredJobSlots})`
                          : ""}
                        {label === "Job Post Limit"
                          ? plan.jobPostLimit === Number.MAX_SAFE_INTEGER
                            ? " (Unlimited)"
                            : ` (${plan.jobPostLimit})`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.name !== "normal" && (
                  <button className="w-full px-4 py-2 rounded-full font-semibold text-sm text-[rgb(88,81,211)] border-2 border-[rgb(88,81,211)] bg-transparent hover:bg-[rgb(88,81,211)] hover:text-white transition duration-200">
                    Buy Plan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployerPlans;

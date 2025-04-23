import { useGetEmployerPlansQuery } from "../../api/endpoints/planApi";

const EmployerPlans = () => {
  const { data: plans, isLoading, isError } = useGetEmployerPlansQuery();

  if (isLoading) return <p className="text-center mt-10">Loading plans...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load plans.</p>
    );

  

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-600 mb-10">
        Choose the Right Plan for You
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {plans?.map((plan) => {
          const { jobLimit, highlightJobs, premiumSupport, durationInDays } =
            plan.features;

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
                    Duration: {durationInDays} days
                  </p>
                </div>

                <p className="mb-4">{plan.description}</p>

                <ul className="mb-6 space-y-1 text-sm">
                  <li className="flex items-center">
                    <span
                      className={`text-lg ${
                        highlightJobs ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {highlightJobs ? "✔" : "✖"}
                    </span>
                    <span className="ml-2">Highlight Jobs</span>
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`text-lg ${
                        premiumSupport ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {premiumSupport ? "✔" : "✖"}
                    </span>
                    <span className="ml-2">Premium Support</span>
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`text-lg ${
                        jobLimit === "unlimited" || jobLimit > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {jobLimit === "unlimited" || jobLimit > 0 ? "✔" : "✖"}
                    </span>
                    <span className="ml-2">
                      Job Post Limit:{" "}
                      {jobLimit === "unlimited" ? "Unlimited" : jobLimit}
                    </span>
                  </li>
                </ul>

                <button className="w-full px-4 py-2 rounded-full font-semibold text-sm text-[rgb(88,81,211)] border-2 border-[rgb(88,81,211)] bg-transparent hover:bg-[rgb(88,81,211)] hover:text-white transition duration-200">
                  Buy Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployerPlans;

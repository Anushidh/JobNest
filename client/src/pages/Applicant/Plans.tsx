const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Apply to jobs", "Save jobs", "Basic profile visibility"],
    isCurrent: true,
  },
  {
    name: "Standard",
    price: "₹499 / mo",
    features: [
      "Priority job visibility",
      "Profile analytics",
      "More job recommendations",
    ],
    isCurrent: false,
  },
  {
    name: "Premium",
    price: "₹999 / mo",
    features: [
      "Featured candidate badge",
      "1-on-1 career coaching",
      "Access to premium jobs",
    ],
    isCurrent: false,
  },
];

const Plans = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Choose Your Plan
      </h2>
      <div className="flex justify-center gap-6 flex-wrap">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="w-[280px] p-6 border rounded-lg shadow bg-white text-center"
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.price}</p>
            <ul className="text-sm text-left mb-4 space-y-1">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            {plan.isCurrent ? (
              <span className="text-green-600 text-sm font-semibold">
                Current Plan
              </span>
            ) : (
              <button className="mt-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded hover:bg-indigo-700">
                Upgrade
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;

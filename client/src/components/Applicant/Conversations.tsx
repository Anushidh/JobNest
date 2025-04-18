const Conversations = () => {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-base text-gray-700 mb-4">
        Conversations with Companies
      </h2>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex flex-col items-center bg-green-50 border border-green-200 px-4 py-2 rounded min-w-[160px]">
          <span className="text-xs text-green-600">3</span>
          <span className="font-semibold text-green-700 text-sm">
            Interested
          </span>
        </div>

        <div className="flex flex-col items-center bg-yellow-50 border border-yellow-200 px-4 py-2 rounded min-w-[160px]">
          <span className="text-xs text-yellow-600">2</span>
          <span className="font-semibold text-yellow-700 text-sm">Pending</span>
        </div>

        <div className="flex flex-col items-center bg-blue-50 border border-blue-200 px-4 py-2 rounded min-w-[160px]">
          <span className="text-xs text-blue-600">1</span>
          <span className="font-semibold text-blue-700 text-sm">
            Shortlisted
          </span>
        </div>

        <div className="flex flex-col items-center bg-red-50 border border-red-200 px-4 py-2 rounded min-w-[160px]">
          <span className="text-xs text-red-600">1</span>
          <span className="font-semibold text-red-700 text-sm">Rejected</span>
        </div>
      </div>
    </div>
  );
};

export default Conversations;

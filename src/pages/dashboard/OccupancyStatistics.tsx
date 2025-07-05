

const OccupancyStatistics = () => {
  return (
    <div className="bg-white shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Occupancy Statistics</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md">Monthly</button>
        </div>
        <div>
          <span>...</span>
        </div>
      </div>
      {/* Bar Chart Placeholder */}
      <div className="h-64 bg-white rounded-md shadow-md"></div>
    </div>
  );
};

export default OccupancyStatistics;
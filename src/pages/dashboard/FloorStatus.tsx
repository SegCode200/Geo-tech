

const FloorStatus = () => {
  return (
    <div className="bg-white shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Floor status</h2>
      <div className="flex items-center space-x-4">
        <div className="w-64 h-64 bg-white rounded-full overflow-hidden">
          {/* Pie Chart Placeholder */}
          {/* <div className="bg-blue-500 rounded-full absolute inset-0 transform rotate-90"></div>
          <div className="bg-white rounded-full absolute inset-0 transform rotate-90 -translate-x-1/2 translate-y-1/2 w-1/2"></div> */}
        </div>
        {/* <div>
          <p className="text-lg font-bold">80%</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-gray-600">Competed</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="text-gray-600">Yet to Complete</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default FloorStatus;
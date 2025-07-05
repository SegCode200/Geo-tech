import React from "react";
import { useNavigate } from "react-router-dom";

const COFAList = () => {
  const navigate = useNavigate();

  const cofaRecords = [
    { id: 1, ownerName: "John Doe", landDetails: "Plot 123, Lagos State", status: "Pending" },
    { id: 2, ownerName: "Jane Smith", landDetails: "Plot 456, Abuja State", status: "Approved" },
    { id: 3, ownerName: "Michael Johnson", landDetails: "Plot 789, Rivers State", status: "Rejected" },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="list-none flex items-center space-x-2 text-gray-600">
          <li>🏠 Home</li>
          <li>/</li>
          <li className="text-blue-600 font-semibold">Land Registration</li>
        </ol>
      </nav>

      {/* Title and "New Land Registration" Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Land Registration</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate("/land-registration")}
        >
          + New Land Registration
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md">📆 All time</span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md">⏳ Status: Pending</span>
        </div>
        <input
          type="text"
          placeholder="🔍 Search..."
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Owner Name</th>
              <th className="px-4 py-3">Land Details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cofaRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3">{record.id}</td>
                <td className="px-4 py-3">{record.ownerName}</td>
                <td className="px-4 py-3">{record.landDetails}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      record.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : record.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    📝 Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default COFAList;

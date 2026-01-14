import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const COFApplicationList = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([
    { id: 1, owner: "John Doe", status: "Pending", date: "2024-03-20" },
    { id: 2, owner: "Jane Smith", status: "Approved", date: "2024-02-18" },
    { id: 3, owner: "Michael Johnson", status: "Rejected", date: "2024-01-15" },
  ]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Certificate of Occupancy (C of O) Applications</h1>
      
      {/* Apply for New C of O */}
      <button
        onClick={() => navigate("/dashboard/c-of-o-application")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        + Apply for C of O
      </button>

      {/* Applications Table */}
      <div className="mt-6 bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Your Applications</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Owner</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b">
                <td className="px-4 py-2">{app.id}</td>
                <td className="px-4 py-2">{app.owner}</td>
                <td className={`px-4 py-2 font-semibold ${app.status === "Pending" ? "text-yellow-500" : app.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                  {app.status}
                </td>
                <td className="px-4 py-2">{app.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default COFApplicationList;

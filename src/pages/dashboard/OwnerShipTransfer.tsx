import React, { useState } from "react";

const OwnershipTransfer = () => {
  const [formData, setFormData] = useState({
    landId: "",
    authCode: "",
    newOwnerName: "",
    newOwnerEmail: "",
    newOwnerPhone: "",
  });

  const [history, setHistory] = useState([
    { date: "01/01/2024", previousOwner: "John Doe", newOwner: "Jane Smith" },
    { date: "03/05/2024", previousOwner: "Jane Smith", newOwner: "Michael Johnson" },
  ]);

  const [message, setMessage] = useState("");

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();

    // Simulating form validation
    if (!formData.landId || !formData.authCode || !formData.newOwnerName) {
      setMessage("Please fill all required fields.");
      return;
    }

    setMessage("Ownership transfer request submitted for approval!");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Ownership Transfer</h1>

      {/* Success/Error Message */}
      {message && (
        <p className="mb-4 text-center text-white p-3 rounded-md bg-blue-500">{message}</p>
      )}

      {/* Transfer Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Land ID (Existing Record)
            </label>
            <input
              type="text"
              name="landId"
              value={formData.landId}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Land ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Authorization Code
            </label>
            <input
              type="text"
              name="authCode"
              value={formData.authCode}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Authorization Code"
              required
            />
          </div>
        </div>

        {/* New Owner Details */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">New Owner Name</label>
          <input
            type="text"
            name="newOwnerName"
            value={formData.newOwnerName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="Enter New Owner Name"
            required
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Owner Email</label>
            <input
              type="email"
              name="newOwnerEmail"
              value={formData.newOwnerEmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter New Owner Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Owner Phone</label>
            <input
              type="tel"
              name="newOwnerPhone"
              value={formData.newOwnerPhone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter New Owner Phone"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition duration-300"
        >
          Submit Transfer Request
        </button>
      </form>

      {/* Ownership History */}
      <div className="mt-8 bg-white shadow-md p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">Ownership History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Previous Owner</th>
              <th className="px-4 py-2 text-left">New Owner</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{record.date}</td>
                <td className="px-4 py-2">{record.previousOwner}</td>
                <td className="px-4 py-2">{record.newOwner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnershipTransfer;

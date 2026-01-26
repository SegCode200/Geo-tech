import React, { useState } from "react";
import {

  FaExchangeAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLandmark,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
  FaHistory,
  FaCalendar,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

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
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

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
      setMessageType("error");
      return;
    }

    setMessage("Ownership transfer request submitted for approval!");
    setMessageType("success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaExchangeAlt className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">Ownership Transfer</h1>
        </div>
        <p className="text-purple-50">
          Transfer land ownership to a new owner. Provide the necessary details and authorization code to proceed.
        </p>
      </motion.div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 border-l-4 ${
            messageType === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          {messageType === "success" ? (
            <FaCheckCircle className="text-xl flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="text-xl flex-shrink-0" />
          )}
          <p className="font-semibold">{message}</p>
        </motion.div>
      )}

      {/* Transfer Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Land Identification Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaLandmark className="text-purple-600 text-xl" />
                <h2 className="text-lg font-bold text-gray-900">Land Identification</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Land ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="landId"
                    value={formData.landId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    placeholder="Enter Land ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Authorization Code <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <FaKey className="absolute left-4 top-3 text-gray-400 text-lg" />
                    <input
                      type="text"
                      name="authCode"
                      value={formData.authCode}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      placeholder="Enter Authorization Code"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* New Owner Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-blue-600 text-xl" />
                <h2 className="text-lg font-bold text-gray-900">New Owner Details</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Owner Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="newOwnerName"
                  value={formData.newOwnerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter New Owner Name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-3 text-gray-400 text-lg" />
                    <input
                      type="email"
                      name="newOwnerEmail"
                      value={formData.newOwnerEmail}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter Email Address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-3 text-gray-400 text-lg" />
                    <input
                      type="tel"
                      name="newOwnerPhone"
                      value={formData.newOwnerPhone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter Phone Number"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FaArrowRight /> Submit Transfer Request
            </motion.button>
          </form>
        </div>

        {/* Info Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200"
        >
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaExchangeAlt className="text-purple-600" /> Transfer Information
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Required Fields:</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs" /> Land ID
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs" /> Authorization Code
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs" /> New Owner Name
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-purple-300">
              <p className="font-semibold text-gray-900">Optional Fields:</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>📧 Email Address</li>
                <li>📱 Phone Number</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ownership History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-6 flex items-center gap-3">
          <FaHistory className="text-2xl" />
          <h2 className="text-2xl font-bold">Ownership History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left font-bold text-gray-900 flex items-center gap-2">
                  <FaCalendar className="text-slate-600" /> Date
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Previous Owner</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Transfer</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">New Owner</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 font-semibold">{record.date}</td>
                  <td className="px-6 py-4 text-gray-700">{record.previousOwner}</td>
                  <td className="px-6 py-4 text-center">
                    <FaArrowRight className="inline text-purple-600 text-lg" />
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">{record.newOwner}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FaHistory className="text-4xl mx-auto mb-3 text-gray-300" />
            <p>No ownership transfer history available.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OwnershipTransfer;

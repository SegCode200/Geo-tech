import { useState, useEffect } from "react";
import { FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle, FaUpload, FaClipboardList, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [userName, setUserName] = useState("John Doe");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your C of O application is under review.", type: "info" },
    { id: 2, message: "New document required for verification.", type: "warning" },
    { id: 3, message: "Your application was approved!", type: "success" },
  ]);

  // Sample Chart Data
  const data = [
    { month: "Jan", approved: 10, rejected: 2 },
    { month: "Feb", approved: 15, rejected: 5 },
    { month: "Mar", approved: 20, rejected: 3 },
    { month: "Apr", approved: 18, rejected: 4 },
  ];

  useEffect(() => {
    // Fetch user data here if needed
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-6"
      >
        <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
        <p className="text-gray-200">Here’s what’s happening with your applications.</p>
      </motion.div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaBell className="text-yellow-500" /> Notifications
        </h2>
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li key={notif.id} className={`p-3 rounded-md ${notif.type === "success" ? "bg-green-100" : notif.type === "warning" ? "bg-yellow-100" : "bg-blue-100"}`}>
              <p className="text-gray-700">{notif.message}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: "Approved", value: 15, icon: <FaCheckCircle className="text-green-500 text-4xl" /> },
          { label: "Pending", value: 7, icon: <FaClock className="text-yellow-500 text-4xl" /> },
          { label: "Rejected", value: 3, icon: <FaTimesCircle className="text-red-500 text-4xl" /> },
        ].map((item, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }} 
            className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center"
          >
            {item.icon}
            <p className="text-3xl font-bold mt-2">{item.value}</p>
            <p className="text-gray-600">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: "Apply for C of O", icon: <FaFileAlt />, color: "bg-green-500 hover:bg-green-600" },
          { label: "Upload Documents", icon: <FaUpload />, color: "bg-yellow-500 hover:bg-yellow-600" },
          { label: "Check Status", icon: <FaClipboardList />, color: "bg-blue-500 hover:bg-blue-600" },
        ].map((action, index) => (
          <button 
            key={index} 
            className={`text-white p-4 rounded-lg shadow-md flex items-center justify-center gap-3 ${action.color}`}
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Application Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="approved" stroke="#4CAF50" strokeWidth={3} />
            <Line type="monotone" dataKey="rejected" stroke="#F44336" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

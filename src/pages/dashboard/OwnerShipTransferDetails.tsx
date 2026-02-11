import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaClock,
  FaFileAlt,
  FaCheckCircle,
  FaMapPin,
  FaRuler,
  FaHistory,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getTransferProgress, TransferProgressResponse } from "../../api/ownershipTransfer";
import { errorToast } from "../../utils/toast";

const OwnerShipTransferDetails = () => {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();

  const [progress, setProgress] = useState<TransferProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transferId) load();
  }, [transferId]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTransferProgress(transferId!);
      setProgress(data);
    } catch (err: any) {
      console.error(err);
      errorToast("Failed to load transfer details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4 py-6"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <FaSpinner className="text-5xl text-blue-600 mx-auto" />
          </motion.div>
          <p className="text-gray-600 font-semibold">Loading transfer details...</p>
        </div>
      </motion.div>
    );
  }

  if (!progress) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4 py-6"
      >
        <div className="text-center">
          <FaShieldAlt className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Transfer not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 max-w-6xl mx-auto"
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg md:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-lg sm:text-xl md:text-2xl" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">Transfer Details</h1>
            </div>
            <p className="text-blue-50 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Manage your land ownership transfer</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide">Current Status</p>
            <div className="mt-1 sm:mt-2 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white bg-opacity-20 rounded-lg">
              <p className="text-base sm:text-lg md:text-xl font-bold">{progress.currentStatus.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
        <p className="text-blue-50 text-xs sm:text-sm mt-3 sm:mt-4 break-all">ID: {progress.transferId}</p>
      </motion.div>

      {/* Land Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaMapPin className="text-green-600" /> Land Information
          </h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
            >
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Address</p>
              <p className="text-xl font-bold text-gray-900">{progress.landDetails.address}</p>
              <p className="text-sm text-gray-600 mt-2">{progress.landDetails.state}</p>
            </motion.div>

            {/* Size */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200"
            >
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Land Size</p>
              <div className="flex items-center gap-3">
                <FaRuler className="text-3xl text-purple-600" />
                <span className="text-3xl font-bold text-gray-900">{progress.landDetails.size}</span>
                <span className="text-lg text-gray-600 font-semibold">m²</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Progress Percentage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border border-orange-200 shadow-md"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-orange-600 uppercase">Progress</p>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm md:text-base">{progress.progressPercentage}%</span>
            </div>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-gradient-to-r from-orange-600 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Created At */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border border-teal-200 shadow-md"
        >
          <p className="text-xs sm:text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2 sm:mb-3">Created</p>
          <div className="flex items-center gap-2 sm:gap-3">
            <FaCalendarAlt className="text-lg sm:text-xl md:text-2xl text-teal-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">
                {new Date(progress.timestamps.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600">
                {new Date(progress.timestamps.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expires At */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border border-red-200 shadow-md"
        >
          <p className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wide mb-2 sm:mb-3">Expires</p>
          <div className="flex items-center gap-2 sm:gap-3">
            <FaClock className="text-lg sm:text-xl md:text-2xl text-red-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">
                {new Date(progress.timestamps.expiresAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600">
                {new Date(progress.timestamps.expiresAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
      >
        <button
          onClick={() => navigate(`/dashboard/ownership-transfer/${progress.transferId}/otp`)}
          className="group relative px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm md:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-center justify-center gap-1 sm:gap-2 relative z-10">
            <FaShieldAlt className="text-sm md:text-lg" />
            <span>Verify OTP</span>
          </div>
        </button>

        <button
          onClick={() => navigate(`/dashboard/ownership-transfer/${progress.transferId}/documents`)}
          className="group relative px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm md:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-center justify-center gap-1 sm:gap-2 relative z-10">
            <FaFileAlt className="text-sm md:text-lg" />
            <span>Upload Documents</span>
          </div>
        </button>

        <button
          onClick={() => navigate(`/dashboard/ownership-transfer/${progress.transferId}/progress`)}
          className="group relative px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-sm md:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-center justify-center gap-1 sm:gap-2 relative z-10">
            <FaHistory className="text-sm md:text-lg" />
            <span>View Progress</span>
          </div>
        </button>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white rounded-lg md:rounded-2xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 border-b border-gray-100">
          <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaHistory className="text-indigo-600 text-sm sm:text-base md:text-lg" /> Recent Activity
          </h3>
        </div>
        <div className="p-3 sm:p-4 md:p-8">
          {progress.recentActivity?.length ? (
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {progress.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xs sm:text-sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">{activity.action}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{activity.comment}</p>
                    <p className="text-xs text-gray-500 mt-1.5 sm:mt-2 flex items-center gap-1">
                      <FaClock className="text-xs flex-shrink-0" />
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <FaHistory className="text-3xl sm:text-4xl md:text-5xl text-gray-300 mx-auto mb-2 sm:mb-3" />
              <p className="text-gray-500 font-semibold text-xs sm:text-sm md:text-base">No recent activity</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OwnerShipTransferDetails;

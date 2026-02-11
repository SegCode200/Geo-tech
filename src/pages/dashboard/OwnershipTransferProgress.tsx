import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaSpinner,
  FaClipboardList,
  FaClock,
  FaFileAlt,
  FaThumbsUp,
  FaHistory,
  FaEye,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getTransferProgress, TransferProgressResponse } from "../../api/ownershipTransfer";
import { errorToast } from "../../utils/toast";

const stageIcons: Record<string, React.ReactNode> = {
  INITIATED: <FaClipboardList className="text-xl" />,
  VERIFICATION: <FaClock className="text-xl" />,
  DOCUMENTS_SUBMITTED: <FaFileAlt className="text-xl" />,
  GOVERNOR_REVIEW: <FaEye className="text-xl" />,
  COMPLETED: <FaThumbsUp className="text-xl" />,
};

const stageColors: Record<string, string> = {
  INITIATED: "from-blue-500 to-blue-600",
  VERIFICATION: "from-yellow-500 to-yellow-600",
  DOCUMENTS_SUBMITTED: "from-purple-500 to-purple-600",
  GOVERNOR_REVIEW: "from-orange-500 to-orange-600",
  COMPLETED: "from-green-500 to-green-600",
};

export const OwnershipTransferProgress = () => {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();

  const [progress, setProgress] = useState<TransferProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadProgress();

    if (autoRefresh) {
      const interval = setInterval(() => {
        loadProgress();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [transferId, autoRefresh]);

  const loadProgress = async () => {
    try {
      if (transferId) {
        const data = await getTransferProgress(transferId);
        setProgress(data);
      }
    } catch (error: any) {
      console.error("Error loading progress:", error);
      if (loading) {
        errorToast( "Failed to load transfer progress");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div className="space-y-6 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="text-4xl text-purple-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-600">Loading transfer progress...</p>
        </div>
      </motion.div>
    );
  }

  if (!progress) {
    return (
      <motion.div className="space-y-6 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Transfer not found</p>
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "APPROVED") return "bg-green-100 border-green-300 text-green-800";
    if (status === "REJECTED") return "bg-red-100 border-red-300 text-red-800";
    if (status === "PENDING_GOVERNOR")
      return "bg-orange-100 border-orange-300 text-orange-800";
    return "bg-blue-100 border-blue-300 text-blue-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 md:space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg md:rounded-xl p-4 sm:p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full sm:flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <FaClipboardList className="text-lg sm:text-xl md:text-2xl" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Transfer Progress</h1>
              <p className="text-xs sm:text-sm text-purple-100 mt-0.5 sm:mt-1 break-all">Transfer ID: {transferId}</p>
            </div>
          </div>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
              autoRefresh
                ? "bg-white text-purple-600"
                : "bg-purple-500 text-white hover:bg-purple-400"
            }`}
          >
            <FaSpinner className={autoRefresh ? "animate-spin text-xs sm:text-sm" : "text-xs sm:text-sm"} />
            <span className="hidden sm:inline">{autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}</span>
            <span className="inline sm:hidden">{autoRefresh ? "Auto" : "Manual"}</span>
          </button>
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Overall Progress</h2>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
            {progress.progressPercentage}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* Status Badge */}
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg border-2 ${getStatusColor(
            progress.currentStatus
          )}`}
        >
          Status: {progress.currentStatus.replace(/_/g, " ")}
        </motion.div>
      </div>

      {/* Land Details */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-l-4 border-blue-500"
      >
        <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Land Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
          <div>
            <p className="text-gray-600 font-semibold">Location</p>
            <p className="text-gray-900 mt-1 font-semibold break-words">
              {progress.landDetails.address}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Land Size</p>
            <p className="text-gray-900 mt-1 font-semibold">
              {progress.landDetails.size}m²
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">State</p>
            <p className="text-gray-900 mt-1 font-semibold">
              {progress.landDetails.state}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Transfer ID</p>
            <p className="text-gray-900 mt-1 font-semibold break-all">
              {progress.transferId}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Timeline/Stages */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6"
      >
        <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Transfer Stages</h3>

        <div className="space-y-3 sm:space-y-4 md:space-y-4">
          {progress.stages.map((stage, index) => (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className={`relative flex gap-2 sm:gap-3 md:gap-4 pb-4 sm:pb-6 md:pb-8 ${
                index !== progress.stages.length - 1 ? "border-l-2 border-gray-300" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div
                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base relative -left-5 sm:-left-6 bg-gradient-to-r ${
                  stage.completed
                    ? stageColors[stage.stage] || "from-gray-500 to-gray-600"
                    : "from-gray-300 to-gray-400"
                }`}
              >
                {stage.completed ? (
                  <FaCheckCircle className="text-base sm:text-lg md:text-xl" />
                ) : (
                  stageIcons[stage.stage] || <FaClock className="text-base sm:text-lg md:text-xl" />
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 pt-1 min-w-0">
                <div className="flex items-start sm:items-center justify-between mb-2 gap-2 flex-wrap">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">
                    {stage.stage.replace(/_/g, " ")}
                  </h4>
                  {stage.completed && (
                    <FaCheckCircle className="text-green-600 text-sm sm:text-base md:text-lg flex-shrink-0" />
                  )}
                </div>

                {/* Stage Progress */}
                {stage.progress !== undefined && (
                  <div className="mb-2 sm:mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-semibold">
                        Progress
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {stage.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Stage Details */}
                {stage.details && (
                  <div className="bg-gray-50 rounded p-2 sm:p-3 text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
                    {stage.details.verified !== undefined && (
                      <p>
                        Verified: {stage.details.verified} / {stage.details.total}
                      </p>
                    )}
                    {stage.details.approved !== undefined && (
                      <div className="space-y-0.5">
                        <p>
                          Approved: <span className="font-semibold text-green-600">{stage.details.approved}</span>
                        </p>
                        <p>
                          Rejected: <span className="font-semibold text-red-600">{stage.details.rejected}</span>
                        </p>
                        <p>
                          Pending: <span className="font-semibold text-yellow-600">{stage.details.pending}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Stage Documents Count */}
                {stage.submittedDocuments !== undefined && (
                  <div className="bg-purple-50 rounded p-2 sm:p-3 text-xs sm:text-sm text-purple-700 font-semibold mt-2">
                    {stage.submittedDocuments} Document(s) Submitted
                  </div>
                )}

                {/* Completion Time */}
                {stage.completedAt && (
                  <p className="text-xs text-gray-600 mt-2">
                    Completed: {new Date(stage.completedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6"
      >
        <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <FaHistory className="text-purple-600 text-sm sm:text-base md:text-lg" /> Recent Activity
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {progress.recentActivity.length === 0 ? (
            <p className="text-gray-600 text-xs sm:text-sm">No activity yet</p>
          ) : (
            progress.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-start gap-2 sm:gap-3 pb-2 sm:pb-3 border-b last:border-b-0"
              >
                <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-600 mt-1.5 sm:mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base break-words">
                      {activity.action.replace(/_/g, " ")}
                    </p>
                    <span className="text-xs text-gray-600 flex-shrink-0">
                      {new Date(activity.date).toLocaleString()}
                    </span>
                  </div>
                  {activity.comment && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 break-words">{activity.comment}</p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Key Dates */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6"
      >
        <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Key Dates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-blue-50 rounded p-2 sm:p-3 md:p-4">
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Created</p>
            <p className="text-gray-900 font-semibold mt-1 text-xs sm:text-sm break-words">
              {new Date(progress.timestamps.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="bg-orange-50 rounded p-2 sm:p-3 md:p-4">
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Expires</p>
            <p className="text-gray-900 font-semibold mt-1 text-xs sm:text-sm break-words">
              {new Date(progress.timestamps.expiresAt).toLocaleString()}
            </p>
          </div>
          {progress.timestamps.reviewedAt && (
            <div className="bg-green-50 rounded p-2 sm:p-3 md:p-4">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Reviewed</p>
              <p className="text-gray-900 font-semibold mt-1 text-xs sm:text-sm break-words">
                {new Date(progress.timestamps.reviewedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="flex-1 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 bg-gray-200 text-gray-800 font-bold rounded-lg md:rounded-xl hover:bg-gray-300 transition-all text-sm sm:text-base md:text-lg"
        >
          Go to Dashboard
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={loadProgress}
          className="flex-1 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 bg-purple-600 text-white font-bold rounded-lg md:rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
        >
          <FaSpinner className="text-sm sm:text-base md:text-lg" /> Refresh
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OwnershipTransferProgress;

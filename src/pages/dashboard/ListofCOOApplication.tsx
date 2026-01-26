import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaRedo,
  FaPlus,
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useCofoApplications } from "../../hooks/useHooks";
import { motion } from "framer-motion";

const STATUS_COLOR: Record<string, { bg: string; text: string; icon: any; border: string }> = {
  DRAFT: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    icon: FaClock,
    border: "border-l-4 border-slate-400",
  },
  IN_REVIEW: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: FaClock,
    border: "border-l-4 border-blue-500",
  },
  NEEDS_CORRECTION: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: FaExclamationCircle,
    border: "border-l-4 border-orange-500",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: FaTimesCircle,
    border: "border-l-4 border-red-500",
  },
  APPROVED: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: FaCheckCircle,
    border: "border-l-4 border-green-500",
  },
};

const STATUS_DESCRIPTION: Record<string, string> = {
  DRAFT: "Application not yet submitted",
  IN_REVIEW: "Under review by the department",
  NEEDS_CORRECTION: "Please resubmit with corrections",
  REJECTED: "Application was not approved",
  APPROVED: "Certificate ready for download",
};

const COOApplicationList = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useCofoApplications();
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    if (data) {
      setApplications(data);
    }
  }, [data]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.land?.plotNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "ALL" || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusStats = () => {
    return {
      total: applications.length,
      draft: applications.filter((a) => a.status === "DRAFT").length,
      inReview: applications.filter((a) => a.status === "IN_REVIEW").length,
      approved: applications.filter((a) => a.status === "APPROVED").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
      needsCorrection: applications.filter((a) => a.status === "NEEDS_CORRECTION")
        .length,
    };
  };

  const stats = getStatusStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <FaTimesCircle className="text-red-600 text-3xl flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Failed to Load Applications</h3>
              <p className="text-red-700 text-sm">
                Please check your connection and try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
                <FaFileAlt className="text-blue-600" />
                My C of O Applications
              </h1>
              <p className="text-slate-600 mt-2">
                Manage and track all your Certificate of Occupancy applications
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/c-of-o-application")}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium whitespace-nowrap"
            >
              <FaPlus />
              New Application
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Total", value: stats.total, icon: FaFileAlt, color: "text-slate-600" },
              { label: "Draft", value: stats.draft, icon: FaClock, color: "text-slate-600" },
              { label: "In Review", value: stats.inReview, icon: FaClock, color: "text-blue-600" },
              { label: "Corrections", value: stats.needsCorrection, icon: FaExclamationCircle, color: "text-orange-600" },
              { label: "Approved", value: stats.approved, icon: FaCheckCircle, color: "text-green-600" },
              { label: "Rejected", value: stats.rejected, icon: FaTimesCircle, color: "text-red-600" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-md border-t-2 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`text-3xl ${stat.color} opacity-20`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && applications.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You haven't submitted any Certificate of Occupancy applications yet. Start your application today!
            </p>
            <button
              onClick={() => navigate("/dashboard/c-of-o-application")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg font-medium"
            >
              <FaPlus />
              Create New Application
            </button>
          </div>
        )}

        {/* Search and Filter Section */}
        {applications.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by application number or land plot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-md"
              />
            </div>

            <div className="relative min-w-max">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer shadow-md"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="NEEDS_CORRECTION">Needs Correction</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredApplications.length === 0 && applications.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaSearch className="text-5xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search filters or criteria
            </p>
          </div>
        )}

        {/* Applications Grid */}
        {filteredApplications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app, idx) => {
              const statusConfig = STATUS_COLOR[app.status];
              const StatusIcon = statusConfig?.icon || FaClock;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden ${statusConfig?.border}`}
                >
                  {/* Card Header */}
                  <div className={`${statusConfig?.bg} px-6 py-4 flex items-center justify-between border-b-2 ${statusConfig?.text.replace('text-', 'border-')}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white bg-opacity-50">
                        <StatusIcon className="text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                        <p className="font-bold">{app.status.replace("_", " ")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Application Number */}
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-600 font-bold uppercase mb-1">Application No</p>
                      <p className="text-sm font-mono font-bold text-slate-900">{app.applicationNumber || "—"}</p>
                    </div>

                    {/* Land Information */}
                    <div>
                      <p className="text-xs text-slate-600 font-bold uppercase mb-2">Land Details</p>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-slate-900 font-semibold text-sm">Plot: {app.land?.plotNumber || "—"}</p>
                        {app.land?.landSize && (
                          <p className="text-xs text-slate-600 mt-1">📍 {app.land.landSize} sqm</p>
                        )}
                        {app.land?.ownerName && (
                          <p className="text-xs text-slate-600">👤 {app.land.ownerName}</p>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-slate-500">
                      <p className="font-bold uppercase mb-1">Submitted</p>
                      <p>
                        {new Date(app.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status Description */}
                    <p className="text-xs text-slate-600 italic bg-blue-50 p-3 rounded-lg border-l-2 border-blue-300">
                      {STATUS_DESCRIPTION[app.status]}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="bg-slate-50 px-4 py-4 flex gap-2 border-t">
                    <button
                      onClick={() => navigate(`/dashboard/cofo-details/${app.id}`)}
                      title="View Details"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs"
                    >
                      <FaEye size={14} />
                      View
                    </button>

                    {app.status === "DRAFT" && (
                      <button
                        onClick={() =>
                          navigate(`/dashboard/c-of-o-application?resume=${app.id}`)
                        }
                        title="Edit Application"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-xs"
                      >
                        <FaEdit size={14} />
                        Edit
                      </button>
                    )}

                    {app.status === "NEEDS_CORRECTION" && (
                      <button
                        onClick={() =>
                          navigate(`/dashboard/c-of-o/resubmit/${app.id}`)
                        }
                        title="Resubmit Application"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium text-xs"
                      >
                        <FaRedo size={14} />
                        Resubmit
                      </button>
                    )}

                    {app.status === "APPROVED" && (
                      <button
                        onClick={() => navigate(`/dashboard/c-of-o/${app.id}`)}
                        title="Download Certificate"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-xs"
                      >
                        <FaDownload size={14} />
                        Download
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default COOApplicationList;

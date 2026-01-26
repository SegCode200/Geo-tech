import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserLands } from "../../hooks/useHooks";
import { errorToast, successToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import * as authApi from "../../api/auth";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaTimes,
  FaRuler,
  FaHome,
  FaGlobe,
  FaFile,
  FaArrowLeft,
  FaFilter,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return { bg: "bg-green-100", text: "text-green-700", badge: "bg-green-500" };
    case "rejected":
      return { bg: "bg-red-100", text: "text-red-700", badge: "bg-red-500" };
    case "pending":
      return { bg: "bg-yellow-100", text: "text-yellow-700", badge: "bg-yellow-500" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-700", badge: "bg-slate-500" };
  }
};

const LandRegistrationList = () => {
  const navigate = useNavigate();
  const {data, error, isLoading, refetch} = useGetUserLands()
  const cofaRecords = data?.lands || [];
  const [selectedLand, setSelectedLand] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const handleDeleteLand = async (landId: string) => {
    setDeleting(true);
    try {
      await authApi.deleteLand(landId);
      successToast("Land deleted successfully!");
      setDeleteConfirm(null);
      refetch?.();
    } catch (error: any) {
      const errorMsg = getApiErrorMessage(error);
      errorToast(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const filteredRecords = cofaRecords.filter((record: any) => {
    const matchesSearch =
      record.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.titleType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "ALL" || record.ownershipType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading land registrations…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <FaExclamationCircle className="text-red-600 text-2xl" />
            <div>
              <h3 className="font-bold text-red-900">Error loading land registrations</h3>
              <p className="text-red-700 text-sm">Please refresh the page and try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
                  <FaMapMarkerAlt className="text-2xl text-white" />
                </div>
                Land Registrations
              </h1>
              <p className="text-slate-600 ml-12">Manage and view all your registered properties</p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              onClick={() => navigate("/dashboard/land-registration")}
            >
              <FaPlus /> New Registration
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                <FaSearch className="inline mr-2" />
                Search
              </label>
              <input
                type="text"
                placeholder="Search by owner name, land ID, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                <FaFilter className="inline mr-2" />
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50"
              >
                <option value="ALL">All Types</option>
                <option value="private">Private</option>
                <option value="government">Government</option>
                <option value="communal">Communal</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
            <p className="text-slate-600 text-sm">Total Lands</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{cofaRecords.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
            <p className="text-slate-600 text-sm">Showing</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{filteredRecords.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-600">
            <p className="text-slate-600 text-sm">Ownership Types</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {new Set(cofaRecords.map((r: any) => r.ownershipType)).size}
            </p>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-16 text-center"
          >
            <div className="mx-auto mb-6 w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-5xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Land Registrations Found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {cofaRecords.length === 0
                ? "You haven't registered any lands yet. Start by creating your first registration!"
                : "No lands match your search filters. Try adjusting your criteria."}
            </p>
            {cofaRecords.length === 0 && (
              <button
                onClick={() => navigate("/dashboard/land-registration")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all"
              >
                <FaPlus />
                Register Your First Land
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRecords.map((record: any, index: number) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-l-4 border-green-600 group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-green-100 uppercase">Land ID</p>
                      <p className="text-lg font-mono font-bold">{record?.id?.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold capitalize whitespace-nowrap">
                        {record?.ownershipType || "N/A"}
                      </span>
                      {record?.landStatus && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap text-white ${getStatusColor(record.landStatus).badge}`}>
                          {record.landStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Status Badge */}
                  {record?.landStatus && (
                    <div className={`${getStatusColor(record.landStatus).bg} ${getStatusColor(record.landStatus).text} px-4 py-2 rounded-lg font-semibold text-center text-sm`}>
                      Status: {record.landStatus.charAt(0).toUpperCase() + record.landStatus.slice(1)}
                    </div>
                  )}

                  {/* Owner Name */}
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-1">Owner</p>
                    <p className="text-lg font-bold text-slate-900">{record?.ownerName}</p>
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                        <FaHome className="text-green-600" />
                        Title Type
                      </p>
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {record?.titleType?.replace("-", " ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                        <FaGlobe className="text-blue-600" />
                        Purpose
                      </p>
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {record?.purpose || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Size and Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                        <FaRuler className="text-purple-600" />
                        Size
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {record?.squareMeters ? `${record.squareMeters} sqm` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-red-600" />
                        Location
                      </p>
                      <p className="text-xs font-semibold text-slate-900">
                        Lat: {record?.latitude?.toFixed(4) || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-200"></div>

                  {/* Documents Count */}
                  {record?.documents && record.documents.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaFile className="text-cyan-600" />
                      <span className="text-slate-600">
                        {record.documents.length} document{record.documents.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="bg-slate-50 px-6 py-4 flex gap-2 border-t">
                  <button
                    onClick={() => setSelectedLand(record)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                    title="View Details"
                  >
                    <FaEye />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/edit-land/${record.id}`, { state: { land: record } })}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                    title="Edit"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(record)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                    title="Delete"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedLand && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLand(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedLand?.ownerName}</h2>
                <p className="text-green-100 text-sm mt-1">ID: {selectedLand?.id?.slice(0, 12)}</p>
              </div>
              <button
                onClick={() => setSelectedLand(null)}
                className="p-2 hover:bg-green-500 rounded-lg transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Owner & Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Owner Name</label>
                  <p className="text-lg font-bold text-slate-900">{selectedLand?.ownerName}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Ownership Type</label>
                  <p className="text-lg font-bold text-slate-900 capitalize">{selectedLand?.ownershipType}</p>
                </div>
              </div>

              {/* Location & Size */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Land Size</label>
                  <p className="text-lg font-bold text-slate-900">{selectedLand?.squareMeters} sqm</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Purpose</label>
                  <p className="text-lg font-bold text-slate-900 capitalize">{selectedLand?.purpose}</p>
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Latitude</label>
                  <p className="text-lg font-mono font-bold text-slate-900">{selectedLand?.latitude}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Longitude</label>
                  <p className="text-lg font-mono font-bold text-slate-900">{selectedLand?.longitude}</p>
                </div>
              </div>

              {/* Title Type */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Title Type</label>
                <p className="text-lg font-bold text-slate-900 capitalize">{selectedLand?.titleType?.replace("-", " ")}</p>
              </div>

              {/* Documents */}
              {selectedLand?.documents && selectedLand.documents.length > 0 && (
                <div className="pt-6 border-t">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                    <FaFile className="text-cyan-600" />
                    Supporting Documents ({selectedLand.documents.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedLand.documents.map((doc: any) => (
                      <a
                        key={doc.id}
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-slate-50 border border-slate-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all flex items-center justify-between group"
                      >
                        <span className="text-slate-900 font-medium truncate flex items-center gap-2">
                          <FaFile className="text-cyan-600 flex-shrink-0" />
                          {doc.fileName}
                        </span>
                        <FaExclamationCircle className="text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedLand(null)}
                className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-bold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/dashboard/edit-land/${selectedLand.id}`, { state: { land: selectedLand } });
                  setSelectedLand(null);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition flex items-center gap-2"
              >
                <FaEdit />
                Edit Land
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationCircle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Delete Land Record?</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete the land record for <strong>{deleteConfirm?.ownerName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-bold disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLand(deleteConfirm.id)}
                disabled={deleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold disabled:opacity-50 transition flex items-center gap-2"
              >
                {deleting && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {deleting ? "Deleting..." : "Delete Record"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandRegistrationList;

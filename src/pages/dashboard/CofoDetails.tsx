import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFileAlt,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaClock,
  FaDownload,
  FaEdit,
  FaRedo,
  FaPrint,
  FaBriefcase,
  FaEye,
  FaTimes,
  FaImage,
  FaFilePdf,
} from "react-icons/fa";
import {  useGetoneCofoApplication } from "../../hooks/useHooks";
import { motion } from "framer-motion";

const STATUS_COLOR: Record<string, { bg: string; text: string; icon: any; badge: string }> = {
  DRAFT: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    icon: FaClock,
    badge: "bg-slate-100 text-slate-700",
  },
  IN_REVIEW: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: FaClock,
    badge: "bg-blue-100 text-blue-700",
  },
  NEEDS_CORRECTION: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: FaExclamationCircle,
    badge: "bg-orange-100 text-orange-700",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: FaTimesCircle,
    badge: "bg-red-100 text-red-700",
  },
  APPROVED: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: FaCheckCircle,
    badge: "bg-green-100 text-green-700",
  },
};

const STATUS_DESCRIPTION: Record<string, string> = {
  DRAFT: "Application not yet submitted",
  IN_REVIEW: "Under review by the department",
  NEEDS_CORRECTION: "Please resubmit with corrections",
  REJECTED: "Application was not approved",
  APPROVED: "Certificate ready for download",
};

const CofoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: applications, isLoading } = useGetoneCofoApplication(id || "");
  const [application, setApplication] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (applications) {
      setApplication(applications.cofO);
    }
  }, [applications]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft />
            Back
          </button>
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-8 text-center">
            <FaTimesCircle className="text-red-600 text-4xl mx-auto mb-4" />
            <h3 className="font-bold text-red-900 mb-2">Application Not Found</h3>
            <p className="text-red-700">The application you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }
  console.log(applications)
  const statusConfig = STATUS_COLOR[application.status];
  const StatusIcon = statusConfig?.icon || FaClock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <FaArrowLeft />
            Back to Applications
          </button>

          {/* Main Status Card */}
          <div className={`${statusConfig?.bg} rounded-xl shadow-lg p-8 border-l-4 ${statusConfig?.text.replace("text-", "border-")}`}>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-lg ${statusConfig?.badge} bg-opacity-30`}>
                  <StatusIcon className="text-3xl" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase mb-1">Application Status</p>
                  <h1 className="text-3xl font-bold">{application.status.replace("_", " ")}</h1>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm text-slate-600 mb-2">Application ID</p>
                <p className="text-xl font-mono font-bold text-slate-900">{application.applicationNumber}</p>
              </div>
            </div>
            <p className="mt-4 text-sm italic">{STATUS_DESCRIPTION[application.status]}</p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Application Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaFileAlt />
                  Application Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">Application Number</p>
                    <p className="text-lg font-mono font-bold text-slate-900 bg-slate-50 p-3 rounded-lg">
                      {application.applicationNumber || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">Application Date</p>
                    <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 rounded-lg flex items-center gap-2">
                      <FaCalendar className="text-blue-600" />
                      {new Date(application.createdAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Land Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaMapMarkerAlt />
                  Land Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {application.land ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Land ID</p>
                        <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 rounded-lg font-mono">
                          #{(application.land.id).slice(0,6).toUpperCase() || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Square Meters</p>
                        <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 rounded-lg">
                          {application.land.squareMeters ? `${application.land.squareMeters} sqm` : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Latitude</p>
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono">
                          {application.land.latitude || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Longitude</p>
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono">
                          {application.land.longitude || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Purpose</p>
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-lg capitalize">
                          {application.land.purpose || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Title Type</p>
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-lg capitalize">
                          {application.land.titleType?.replace("-", " ") || "—"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Ownership Type</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg capitalize">
                        {application.land.ownershipType || "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic">No land information available</p>
                )}
              </div>
            </motion.div>

            {/* Owner Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaUser />
                  Owner Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {application.land?.ownerName ? (
                  <>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Owner Name</p>
                      <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 rounded-lg flex items-center gap-2">
                        <FaUser className="text-purple-600" />
                        {application.land.ownerName}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic">No owner information available</p>
                )}
              </div>
            </motion.div>

            {/* Current Reviewer Information */}
            {application.currentReviewer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaBriefcase />
                    Current Reviewer
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Reviewer Name</p>
                      <p className="text-lg font-bold text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {application.currentReviewer.name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Position</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {application.currentReviewer.position || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Email</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg flex items-center gap-2">
                        <FaEnvelope className="text-indigo-600" />
                        {application.currentReviewer.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Phone</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg flex items-center gap-2">
                        <FaPhone className="text-indigo-600" />
                        {application.currentReviewer.phone || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Department</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {application.currentReviewer.department || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Ministry</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {application.currentReviewer.ministry || "—"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">Function</p>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                      {application.currentReviewer.function || "—"}
                    </p>
                  </div>
                  {application.currentReviewer.role && (
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Role</p>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                          {application.currentReviewer.role}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {application.cofODocuments && application.cofODocuments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaFileAlt />
                    Submitted Documents ({application.cofODocuments.length})
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.cofODocuments.map((doc: any) => {
                      const isImage = doc.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                      const isPdf = doc.url?.match(/\.pdf$/i);

                      return (
                        <motion.div
                          key={doc.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700">
                              {isPdf ? (
                                <FaFilePdf className="text-lg" />
                              ) : (
                                <FaImage className="text-lg" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 text-sm truncate">
                                {doc.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 capitalize">
                                {doc.type?.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setIsViewerOpen(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs"
                            >
                              <FaEye size={14} />
                              View
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = doc.url;
                                link.download = doc.title || "document";
                                link.click();
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-xs"
                            >
                              <FaDownload size={14} />
                              Download
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1"
          >
            <div className="sticky top-6 space-y-4">
              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Actions</h3>

                {application.status === "DRAFT" && (
                  <button
                    onClick={() => navigate(`/dashboard/c-of-o-application?resume=${application.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                  >
                    <FaEdit size={16} />
                    Continue Editing
                  </button>
                )}

                {application.status === "NEEDS_CORRECTION" && (
                  <button
                    onClick={() => navigate(`/dashboard/c-of-o/resubmit/${application.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    <FaRedo size={16} />
                    Resubmit Application
                  </button>
                )}

                {application.status === "APPROVED" && (
                  <button
                    onClick={() => {/* Download logic */}}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <FaDownload size={16} />
                    Download Certificate
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  <FaPrint size={16} />
                  Print Details
                </button>

                <button
                  onClick={() => navigate("/dashboard/list-c-of-o-application")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  <FaArrowLeft size={16} />
                  Back to List
                </button>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-slate-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig?.badge}`}>
                      {application.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-slate-600">App Number</span>
                    <span className="text-slate-900 font-mono font-medium text-xs">{application.applicationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-slate-600">Submitted</span>
                    <span className="text-slate-900 font-medium">
                      {new Date(application.createdAt).toLocaleDateString("en-NG")}
                    </span>
                  </div>
                  {application.land && (
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-slate-600">Land ID</span>
                      <span className="text-slate-900 font-mono font-medium text-xs">#{(application.land.id).slice(0,6).toUpperCase()}</span>
                    </div>
                  )}
                  {application.land?.squareMeters && (
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-slate-600">Size</span>
                      <span className="text-slate-900 font-medium">{application.land.squareMeters} sqm</span>
                    </div>
                  )}
                  {application.revisionCount !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Revisions</span>
                      <span className="text-slate-900 font-medium">{application.revisionCount}</span>
                    </div>
                  )}
                  {application.cofONumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">CoFO Number</span>
                      <span className="text-green-700 font-bold text-xs">{application.cofONumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Document Viewer Modal */}
        {isViewerOpen && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsViewerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedDocument.title}</h3>
                  <p className="text-blue-100 text-sm mt-1 capitalize">
                    {selectedDocument.type?.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto bg-slate-100 p-6 flex items-center justify-center">
                {selectedDocument.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  // Image Viewer
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={selectedDocument.url}
                    alt={selectedDocument.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                ) : selectedDocument.url?.match(/\.pdf$/i) ? (
                  // PDF Viewer
                  <div className="w-full h-full bg-white rounded-lg shadow-lg">
                    <iframe
                      src={`${selectedDocument.url}#toolbar=1&navpanes=0&scrollbar=1`}
                      className="w-full h-full border-none"
                      title={selectedDocument.title}
                    />
                  </div>
                ) : (
                  // Fallback for other file types
                  <div className="text-center">
                    <FaFileAlt className="text-6xl text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-6">Preview not available for this file type</p>
                    <a
                      href={selectedDocument.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload />
                      Open/Download File
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-100 p-6 flex gap-3 justify-end border-t">
                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors font-medium"
                >
                  Close
                </button>
                <a
                  href={selectedDocument.url}
                  download={selectedDocument.title || "document"}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FaDownload />
                  Download
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CofoDetails;
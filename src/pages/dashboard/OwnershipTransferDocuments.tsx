import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaFileUpload,
  FaFile,
  FaFileWord,
  FaFilePdf,
  FaImage,
  FaTimes,
  FaCheckDouble,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { submitTransferDocuments, getTransferProgress, TransferProgressResponse } from "../../api/ownershipTransfer";
import { errorToast, successToast } from "../../utils/toast";

interface DocumentUpload {
  file: File;
  type: string;
  title: string;
  preview?: string;
}

const DOCUMENT_TYPES = [
  { id: "deed", label: "Deed of Transfer" },
  { id: "identity", label: "Identity Document" },
  { id: "survey", label: "Survey Plan" },
  { id: "payment_proof", label: "Payment Proof" },
  { id: "consent_letter", label: "Consent Letter" },
  { id: "other", label: "Other Documents" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export const OwnershipTransferDocuments = () => {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [progress, setProgress] = useState<TransferProgressResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (transferId) {
      loadTransferProgress();
    }
  }, [transferId]);

  const loadTransferProgress = async () => {
    try {
      setLoading(true);
      const data = await getTransferProgress(transferId!);
      setProgress(data);
    } catch (error: any) {
      console.error("Error loading transfer:", error);
      errorToast("Failed to load transfer details");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) return <FaImage className="text-blue-500" />;
    if (mimeType.includes("pdf")) return <FaFilePdf className="text-red-500" />;
    if (mimeType.includes("word") || mimeType.includes("document"))
      return <FaFileWord className="text-blue-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File type not allowed. Accepted: PDF, Word, Images`;
    }

    return null;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setMessage("");

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        setMessage(`${file.name}: ${error}`);
        setMessageType("error");
        return;
      }

      // Create preview for images
      let preview = undefined;
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      const newDoc: DocumentUpload = {
        file,
        type: "",
        title: file.name.replace(/\.[^/.]+$/, ""),
        preview,
      };

      setDocuments((prev) => [...prev, newDoc]);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const updateDocument = (index: number, updates: Partial<DocumentUpload>) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, ...updates } : doc))
    );
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (documents.length === 0) {
      setMessage("Please upload at least one document");
      setMessageType("error");
      return;
    }

    const unclassified = documents.filter((d) => !d.type);
    if (unclassified.length > 0) {
      setMessage(`Please classify all documents. ${unclassified.length} document(s) missing document type.`);
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      await submitTransferDocuments({
        transferId: transferId!,
        files: documents.map((d) => d.file),
        documentsMeta: documents.map((d) => ({
          type: d.type,
          title: d.title,
        })),
      });

      setMessage("Documents submitted successfully!");
      setMessageType("success");

      setTimeout(() => {
        successToast("Documents submitted for governor review");
        navigate(`/dashboard/ownership-transfer/${transferId}/progress`);
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || "Failed to submit documents");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div className="space-y-6 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="text-4xl text-purple-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-600">Loading transfer details...</p>
        </div>
      </motion.div>
    );
  }

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
        className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg md:rounded-xl p-4 sm:p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <FaFileUpload className="text-lg sm:text-xl md:text-2xl" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Submit Documents</h1>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-green-50">
          Upload the required documents for the governor to review your ownership transfer request.
        </p>
      </motion.div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 sm:p-4 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3 border-l-4 text-xs sm:text-sm md:text-base ${
            messageType === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          {messageType === "success" ? (
            <FaCheckCircle className="text-base sm:text-lg md:text-xl flex-shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <FaExclamationCircle className="text-base sm:text-lg md:text-xl flex-shrink-0 mt-0.5 sm:mt-0" />
          )}
          <p className="font-semibold break-words">{message}</p>
        </motion.div>
      )}

      {/* Transfer Details */}
      {progress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-l-4 border-green-500"
        >
          <h3 className="font-bold text-base sm:text-lg md:text-lg text-gray-900 mb-3 sm:mb-4">Transfer Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Land Location</p>
              <p className="text-gray-900 mt-1 break-words">{progress.landDetails.address}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Land Size</p>
              <p className="text-gray-900 mt-1">{progress.landDetails.size}m²</p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {/* File Upload Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-l-4 border-green-500"
        >
          <h2 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Upload Documents</h2>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg md:rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-green-400"
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              id="file-input"
            />

            <label htmlFor="file-input" className="cursor-pointer">
              <FaFileUpload className="text-2xl sm:text-3xl md:text-4xl text-green-600 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1">
                Drag and drop your files here
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                or click to browse from your computer
              </p>
              <p className="text-xs text-gray-500 mt-2 sm:mt-3">
                Accepted: PDF, Word, Images (Max 10MB per file)
              </p>
            </label>
          </div>
        </motion.div>

        {/* Uploaded Documents */}
        <AnimatePresence>
          {documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-l-4 border-blue-500"
            >
              <h2 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Uploaded Documents ({documents.length})
              </h2>

              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {documents.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 rounded-lg md:rounded-xl p-3 sm:p-4 border-2 border-gray-200"
                  >
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      {/* File Icon */}
                      <div className="text-xl sm:text-2xl md:text-3xl flex-shrink-0 mt-0.5 sm:mt-0">
                        {getFileIcon(doc.file)}
                      </div>

                      {/* File Info and Inputs */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">
                          {(doc.file.size / 1024).toFixed(2)} KB
                        </p>

                        {/* Document Type Select */}
                        <div className="mt-2 sm:mt-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Document Type <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={doc.type}
                            onChange={(e) =>
                              updateDocument(index, { type: e.target.value })
                            }
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                            required
                          >
                            <option value="">Select document type...</option>
                            {DOCUMENT_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Document Title */}
                        <div className="mt-2 sm:mt-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Document Title
                          </label>
                          <input
                            type="text"
                            value={doc.title}
                            onChange={(e) =>
                              updateDocument(index, { title: e.target.value })
                            }
                            placeholder="Enter document title"
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border-2 border-gray-300 rounded-lg md:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0 mt-1 text-base sm:text-lg md:text-xl"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    {/* Image Preview */}
                    {doc.preview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 sm:mt-3"
                      >
                        <img
                          src={doc.preview}
                          alt="preview"
                          className="max-h-20 sm:max-h-32 rounded-lg md:rounded-xl object-cover"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting || documents.length === 0}
          className="w-full py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg md:rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin text-sm sm:text-base md:text-lg" /> Submitting...
            </>
          ) : (
            <>
              <FaCheckDouble className="text-sm sm:text-base md:text-lg" /> Submit Documents
            </>
          )}
        </motion.button>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => navigate(-1)}
          className="w-full py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg md:rounded-xl hover:bg-gray-300 transition-all text-sm sm:text-base md:text-lg"
        >
          Go Back
        </motion.button>
      </form>
    </motion.div>
  );
};

export default OwnershipTransferDocuments;

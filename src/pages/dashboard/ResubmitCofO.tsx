import { useEffect, useState } from "react";
import api from "../../api/auth";
import {
  FaUpload,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";
import { errorToast, successToast } from "../../utils/toast";
import { motion } from "framer-motion";

interface RejectedDoc {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface FileItem {
  id: string;
  file: File;
}

const getFileIcon = (name: string) => {
  if (name.endsWith(".pdf")) return <FaFilePdf className="text-red-600" />;
  if ([".jpg", ".jpeg", ".png"].some((e) => name.endsWith(e)))
    return <FaFileImage className="text-blue-600" />;
  return <FaFile className="text-gray-600" />;
};

const ResubmitCofO = ({ cofOId, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [rejectedDocs, setRejectedDocs] = useState<RejectedDoc[]>([]);
  const [files, setFiles] = useState<Record<string, FileItem[]>>({});

  // 1️⃣ Fetch rejected docs
  useEffect(() => {
    api.get(`/cofo/get-applications/${cofOId}`)
      .then((res) => {
        const rejected = res.data.cofODocuments.filter(
          (d: any) => d.status === "REJECTED"
        );
        setRejectedDocs(rejected);
      })
      .catch(() => {
        errorToast("Failed to load rejected documents");
      });
  }, [cofOId]);

  const handleFileChange = (docType: string, fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
    }));
    setFiles((prev) => ({
      ...prev,
      [docType]: newFiles,
    }));
  };

  const handleRemove = (docType: string, id: string) => {
    setFiles((prev) => ({
      ...prev,
      [docType]: prev[docType].filter((f) => f.id !== id),
    }));
  };

  // 2️⃣ Submit resubmission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      const meta: { type: string; title: string }[] = [];

      Object.entries(files).forEach(([type, fileList]) => {
        fileList.forEach((f) => {
          form.append("documents", f.file);
          meta.push({ type, title: type.replace(/_/g, " ") });
        });
      });

      form.append("documentsMeta", JSON.stringify(meta));

      await api.post(`/cofo/re-submit/${cofOId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      successToast("Documents resubmitted successfully");
      onSuccess();
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Resubmission failed");
    } finally {
      setLoading(false);
    }
  };

  if (rejectedDocs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <FaCheckCircle className="text-3xl text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">
          All Documents Approved
        </h3>
        <p className="text-emerald-700">
          No rejected documents. Your Certificate of Occupancy application is complete.
        </p>
      </motion.div>
    );
  }

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
        className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <h2 className="text-3xl font-bold">Resubmit Rejected Documents</h2>
        </div>
        <p className="text-orange-50">
          The reviewer has flagged certain documents for resubmission. Please review and upload corrected versions below.
        </p>
      </motion.div>

      {/* Documents List */}
      <div className="space-y-4">
        {rejectedDocs.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Document Header */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-5 border-b">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {doc.title}
                  </h3>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 mt-2"
                  >
                    <FaDownload className="text-xs" />
                    View Rejected Document
                  </a>
                </div>
                <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-xs font-bold whitespace-nowrap">
                  ⚠️ Rejected
                </span>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="p-6">
              <label className="block">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all"
                >
                  <FaUpload className="text-3xl text-orange-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    PDF, JPG, JPEG, PNG (max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(doc.type, e.target.files)}
                    className="hidden"
                  />
                </motion.div>
              </label>

              {/* Uploaded Files */}
              {files[doc.type] && files[doc.type].length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-2"
                >
                  <p className="text-sm font-semibold text-gray-700">
                    Uploaded Files:
                  </p>
                  {files[doc.type].map((f) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-xl flex-shrink-0">
                          {getFileIcon(f.file.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {f.file.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {(f.file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemove(doc.type, f.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                        title="Remove file"
                      >
                        <FaTrash className="text-sm" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3 justify-end sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading || Object.values(files).every((f) => f.length === 0)}
          className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <FaUpload /> Resubmit Documents
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ResubmitCofO;

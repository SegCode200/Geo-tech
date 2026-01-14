import { useState } from "react";
import {  FaCheckCircle, FaTrash, FaPlus, FaFile, FaFilePdf, FaFileImage } from "react-icons/fa";

const COFO_DOCUMENTS = [
  { key: "SURVEY_PLAN", label: "Survey Plan", required: true },
  { key: "DEED_OF_ASSIGNMENT", label: "Deed of Assignment", required: true },
  { key: "PURCHASE_RECEIPT", label: "Purchase Receipt", required: true },
  { key: "LAND_AGREEMENT", label: "Land Purchase Agreement", required: true },
  { key: "PASSPORT_PHOTO", label: "Passport Photograph", required: true },
  { key: "MEANS_OF_ID", label: "Means of Identification", required: true },
  { key: "TAX_CLEARANCE", label: "Tax Clearance Certificate", required: true },
  { key: "SITE_PLAN", label: "Site Plan", required: false },
  { key: "APPLICATION_LETTER", label: "Application Letter", required: false },
];

interface DocumentFile {
  id: string;
  file: File;
  name: string;
}

const UploadDocsStep = ({ onBack, onNext }: any) => {
  const [files, setFiles] = useState<Record<string, DocumentFile[]>>({});

  const handleFileChange = (key: string, newFiles: FileList | null) => {
    if (!newFiles) return;
    
    setFiles((prev) => {
      const existing = prev[key] || [];
      const newDocs = Array.from(newFiles).map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
      }));
      return { ...prev, [key]: [...existing, ...newDocs] };
    });
  };

  const handleDeleteFile = (key: string, fileId: string) => {
    setFiles((prev) => ({
      ...prev,
      [key]: prev[key].filter((f) => f.id !== fileId),
    }));
  };

  const isValid = COFO_DOCUMENTS.every(
    (doc) => !doc.required || (files[doc.key] && files[doc.key].length > 0)
  );

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return <FaFilePdf className="text-red-600" />;
    if ([".jpg", ".jpeg", ".png"].some(ext => fileName.endsWith(ext))) 
      return <FaFileImage className="text-blue-600" />;
    return <FaFile className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Upload Required Documents
        </h2>
        <p className="text-slate-600 max-w-2xl">
          Please upload clear scanned copies of all required documents. You can add multiple documents for each category. All required documents must be uploaded to proceed.
        </p>
      </div>

      <div className="space-y-6">
        {COFO_DOCUMENTS.map((doc) => (
          <div
            key={doc.key}
            className="border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-slate-800 text-lg">
                  {doc.label}
                  {doc.required && (
                    <span className="text-red-600 ml-2 font-bold">*</span>
                  )}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Accepted formats: PDF, JPG, PNG | Max 5MB per file
                </p>
              </div>
              {files[doc.key] && files[doc.key].length > 0 && (
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                  <FaCheckCircle className="text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-medium">
                    {files[doc.key].length} uploaded
                  </span>
                </div>
              )}
            </div>

            {/* Uploaded Files */}
            {files[doc.key] && files[doc.key].length > 0 && (
              <div className="mb-4 space-y-2">
                {files[doc.key].map((doc_file) => (
                  <div
                    key={doc_file.id}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(doc_file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {doc_file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(doc_file.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(doc.key, doc_file.id)}
                      className="flex-shrink-0 ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-3 border-2 border-dashed border-emerald-400 bg-emerald-50 rounded-lg p-4 cursor-pointer hover:bg-emerald-100 transition-colors">
              <FaPlus className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Add Document
              </span>
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(doc.key, e.target.files)}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          disabled={!isValid}
          onClick={() => onNext(files)}
          className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${
            isValid
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UploadDocsStep;

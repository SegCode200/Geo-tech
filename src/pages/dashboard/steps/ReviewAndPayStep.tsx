import { useState } from "react";
import api from "../../../api/auth";
import {
  FaFile,
  FaFilePdf,
  FaFileImage,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import PaystackPop from "@paystack/inline-js";
import { errorToast, successToast } from "../../../utils/toast";

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
  type: string;
}

const ReviewAndPayStep = ({ landId, documents, onBack, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Initialize payment
      const { data } = await api.post("/payments/initialize", {
        landID: landId,
        amount: 5000,
      });
      console.log("Payment init response:", data);

      // Initialize Paystack
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: data.publicKey || "",
        email: data.email || "",
        amount: data.amount * 100,
        reference: data.reference,
        // ref: data.reference,
        onSuccess: async () => {
          try {
            console.log("Payment successful, verifying...");
            // Verify payment
            const verifyResponse = await api.get(
              `/payments/verify?reference=${data.reference}`,
            );
            const verifyData = verifyResponse.data;

            // Upload documents
            const form = new FormData();

            // Prepare documents with type and title
            const documentsMeta: {
              type: string;
              title: string;
            }[] = [];

            Object.entries(documents).forEach(([docKey, fileList]: any) => {
              const docConfig = COFO_DOCUMENTS.find((d) => d.key === docKey);
              const title = docConfig?.label || docKey;

              fileList.forEach((doc: DocumentFile) => {
                form.append("documents", doc.file); // ✅ files only
                documentsMeta.push({
                  type: docKey, // ✅ correct
                  title: title, // ✅ human readable
                });
              });
            });

            // Append each document metadata as separate form fields
            form.append("documentsMeta", JSON.stringify(documentsMeta));

            const res = await api.post(
              `/cofo/apply/${verifyData.cofOApplicationId}`,
              form,
              {
                headers: { "Content-Type": "multipart/form-data" },
              },
            );
            successToast("Payment successful and documents uploaded");
            onSuccess(res.data.applicationNumber);
          } catch (err: any) {
            console.error("Verification error:", err);
            errorToast("Payment verification failed or document upload error");
            setError(
              err.response?.data?.message || "Payment verification failed",
            );
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
          errorToast("Payment was cancelled");
        },
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      errorToast("Payment initialization failed");
      setError(err.response?.data?.message || "Payment initialization failed");
      setLoading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf"))
      return <FaFilePdf className="text-red-600" />;
    if ([".jpg", ".jpeg", ".png"].some((ext) => fileName.endsWith(ext)))
      return <FaFileImage className="text-blue-600" />;
    return <FaFile className="text-gray-600" />;
  };

  const countDocuments = () => {
    let count = 0;
    Object.values(documents).forEach((fileList: any) => {
      if (fileList && fileList.length > 0) {
        count += fileList.length;
      }
    });
    return count;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Review & Payment
        </h2>
        <p className="text-slate-600">
          Please review your documents before proceeding to payment
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Documents Summary */}
      <div className="mb-8 border-2 border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Uploaded Documents
          </h3>
          <div className="bg-emerald-50 px-4 py-2 rounded-full">
            <p className="text-sm font-semibold text-emerald-700">
              {countDocuments()} file{countDocuments() !== 1 ? "s" : ""}{" "}
              uploaded
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {COFO_DOCUMENTS.map((doc) => {
            const uploadedDocs = documents[doc.key];
            const hasFiles = uploadedDocs && uploadedDocs.length > 0;

            return (
              <div
                key={doc.key}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {hasFiles ? (
                      <FaCheckCircle className="text-emerald-600 text-lg" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">
                        {doc.label}
                      </p>
                      {doc.required && (
                        <p className="text-xs text-slate-500">Required</p>
                      )}
                    </div>
                  </div>
                  {hasFiles && (
                    <span className="text-sm font-medium text-slate-600">
                      {uploadedDocs.length} file
                      {uploadedDocs.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {hasFiles && (
                  <div className="ml-8 space-y-2">
                    {uploadedDocs.map((docFile: DocumentFile) => (
                      <div
                        key={docFile.id}
                        className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded"
                      >
                        {getFileIcon(docFile.name)}
                        <span className="truncate">{docFile.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8 border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Payment Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Processing Fee:</span>
            <span className="font-semibold text-slate-900">₦5,000.00</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-300">
            <span className="font-semibold text-slate-900">Total Amount:</span>
            <span className="font-bold text-emerald-600 text-lg">
              ₦5,000.00
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Payment will be processed securely via Paystack. Your transaction
            reference will be provided after successful payment.
          </p>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Please note:</span> By proceeding with
          payment, you confirm that all submitted documents are accurate and
          authentic. False or fraudulent documents may result in legal action.
        </p>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-200 flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FaCheckCircle />
              Pay & Submit
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewAndPayStep;

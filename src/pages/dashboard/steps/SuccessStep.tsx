import { FaCheckCircle, FaDownload, FaPrint, FaClock, FaPhone, FaTimes, FaEye, FaFileDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SuccessStep = ({ reference, amount = 5000 }: { reference: string; amount?: number }) => {
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const currentDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const downloadConfirmation = () => {
    const confirmationContent = `
CERTIFICATE OF OCCUPANCY APPLICATION
CONFIRMATION RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date Submitted: ${currentDate}
Reference Number: ${reference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APPLICATION STATUS
Status: SUCCESSFULLY SUBMITTED
Your application has been received and accepted for processing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS
Processing Fee: ₦5,000.00
Amount Paid: ₦${amount.toLocaleString()}.00
Payment Status: COMPLETED
Transaction Reference: ${reference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT INFORMATION
• Keep this reference number safe for future correspondence
• Your application will be reviewed within 7-14 business days
• You'll receive updates via email and SMS
• Check your email regularly for status updates
• Do not submit another application for the same land during review
• Contact support if no update is received within 15 business days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUPPORT INFORMATION
Email: support@geotech.gov.ng
Phone: +234 XXX XXX XXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated confirmation. Please retain for your records.
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([confirmationContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `COO_Confirmation_${reference}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="py-8">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4 animate-pulse">
          <FaCheckCircle className="text-emerald-600 text-5xl" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Application Submitted Successfully
        </h2>
        <p className="text-slate-600 text-lg">
          Your Certificate of Occupancy application has been received and is now
          under review
        </p>
      </div>

      {/* Application Details */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-8 mb-8">
        <h3 className="font-bold text-slate-900 mb-6 text-lg">
          Application Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border-2 border-emerald-600">
            <p className="text-sm text-slate-500 font-medium mb-2">
              REFERENCE NUMBER
            </p>
            <p className="text-3xl font-bold text-emerald-700 font-mono tracking-widest">
              {reference}
            </p>
            <p className="text-xs text-slate-600 mt-4">
              Save this reference for tracking your application
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-amber-500">
            <p className="text-sm text-slate-500 font-medium mb-2">
              AMOUNT PAID
            </p>
            <p className="text-3xl font-bold text-amber-600 font-mono">
              ₦{amount.toLocaleString()}.00
            </p>
            <p className="text-xs text-slate-600 mt-4">
              Processing fee for COO application
            </p>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FaClock className="text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900">Processing Time</h4>
          </div>
          <p className="text-sm text-slate-600">
            Your application will be reviewed within 7-14 business days
          </p>
        </div>

        <div className="border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FaPhone className="text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-900">Contact Updates</h4>
          </div>
          <p className="text-sm text-slate-600">
            You'll receive updates via email and SMS
          </p>
        </div>

        <div className="border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <FaDownload className="text-green-600" />
            </div>
            <h4 className="font-bold text-slate-900">Certificate</h4>
          </div>
          <p className="text-sm text-slate-600">
            Your certificate will be available for download once approved
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Important Information</h4>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Keep your reference number safe for future correspondence</li>
          <li>• Check your email regularly for updates on your application status</li>
          <li>
            • Do not submit another application for the same land during the
            review period
          </li>
          <li>
            • Contact support if you don't receive any update within 15 business
            days
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowConfirmationModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          <FaEye />
          View Confirmation
        </button>
        <button
          onClick={downloadConfirmation}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-300 text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors"
        >
          <FaFileDownload />
          Download Receipt
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          <FaPrint />
          Print
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex-1"
        >
          <FaCheckCircle />
          Back to Dashboard
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-emerald-600 text-white p-6 flex items-center justify-between border-b-4 border-emerald-700">
              <div>
                <h2 className="text-2xl font-bold">Application Confirmation</h2>
                <p className="text-sm text-emerald-100 mt-1">Reference: {reference}</p>
              </div>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-center gap-4 p-6 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                <FaCheckCircle className="text-emerald-600 text-4xl" />
                <div>
                  <h3 className="text-xl font-bold text-emerald-700">
                    Application Successfully Submitted
                  </h3>
                  <p className="text-sm text-emerald-600">
                    Submitted on {currentDate}
                  </p>
                </div>
              </div>

              {/* Reference & Payment Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Reference Number
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-mono break-all">
                    {reference}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                    Amount Paid
                  </p>
                  <p className="text-2xl font-bold text-amber-700 font-mono">
                    ₦{amount.toLocaleString()}.00
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Payment Information</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="font-semibold">₦5,000.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="font-semibold">Total Amount Paid:</span>
                    <span className="font-bold text-blue-900">
                      ₦{amount.toLocaleString()}.00
                    </span>
                  </div>
                  <p className="text-xs italic pt-2">
                    ✓ Payment verified and confirmed
                  </p>
                </div>
              </div>

              {/* Processing Information */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">What Happens Next?</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>
                    <span className="font-semibold">7-14 Business Days:</span> Your application will be reviewed
                  </li>
                  <li>
                    <span className="font-semibold">Email & SMS Updates:</span> You'll receive status notifications
                  </li>
                  <li>
                    <span className="font-semibold">Certificate Download:</span> Once approved, access it here
                  </li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-3">⚠️ Important Reminders</h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>• Save this reference number for future correspondence</li>
                  <li>• Check your email regularly for status updates</li>
                  <li>
                    • Do not submit another application for the same land during review
                  </li>
                  <li>
                    • Contact support if you don't receive any update within 15 business days
                  </li>
                </ul>
              </div>

              {/* Contact Support */}
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 text-center">
                <p className="font-semibold text-slate-900 mb-2">Need Help?</p>
                <p className="text-sm text-slate-700">
                  Email: <span className="font-mono">support@geotech.gov.ng</span>
                </p>
                <p className="text-sm text-slate-700">
                  Phone: <span className="font-mono">+234 XXX XXX XXXX</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t p-6 flex gap-3 justify-end">
              <button
                onClick={downloadConfirmation}
                className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <FaFileDownload />
                Download
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FaPrint />
                Print
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 bg-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Section */}
      <div className="mt-10 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-600 mb-2">
          Need help? Contact our support team
        </p>
        <p className="text-slate-500 text-sm">
          Email: support@geotech.gov.ng | Phone: +234 XXX XXX XXXX
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;

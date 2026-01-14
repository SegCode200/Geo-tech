import { FaCheckCircle, FaDownload, FaPrint, FaClock, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SuccessStep = ({ reference }: { reference: string }) => {
  const navigate = useNavigate();

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
          Application Reference
        </h3>
        <div className="bg-white rounded-lg p-6 border-2 border-emerald-600">
          <p className="text-sm text-slate-500 font-medium mb-2">
            REFERENCE NUMBER
          </p>
          <p className="text-3xl font-bold text-emerald-700 font-mono tracking-widest">
            {reference}
          </p>
          <p className="text-xs text-slate-600 mt-4">
            Please save this reference number for your records. You'll need it to
            track your application status.
          </p>
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
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          <FaPrint />
          Print Confirmation
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex-1"
        >
          <FaCheckCircle />
          Back to Dashboard
        </button>
      </div>

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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {

  FaExchangeAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLandmark,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaClock,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  initiateOwnershipTransfer,
  listUserTransfers,
  getLandsByUser,
  TransferItem,
} from "../../api/ownershipTransfer";
import { errorToast } from "../../utils/toast";

const OwnershipTransfer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    landId: "",
    newOwnerEmail: "",
    newOwnerPhone: "",
    extraEmail: "",
    extraPhone: "",
    emails: [] as string[],
    phones: [] as string[],
  });

  const [applications, setApplications] = useState<TransferItem[]>([]);
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  // Load transfers and lands on mount
  useEffect(() => {
    loadTransfersAndLands();
  }, []);

  const loadTransfersAndLands = async () => {
    try {
      setLoadingTransfers(true);
      const [transfersData, landsData] = await Promise.all([
        listUserTransfers(),
        getLandsByUser(),
      ]);

      // Use the flat transfers array from the new backend response
      setApplications(transfersData.transfers || []);
      setLands(landsData.lands || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
      errorToast( "Failed to load transfer data");
    } finally {
      setLoadingTransfers(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "INITIATED":
      case "VERIFIED_BY_PARTIES":
        return <FaClock className="text-yellow-500 text-lg" />;
      case "PENDING_GOVERNOR":
        return <FaSpinner className="text-blue-500 text-lg animate-spin" />;
      case "APPROVED":
        return <FaCheck className="text-green-500 text-lg" />;
      case "REJECTED":
        return <FaTimes className="text-red-500 text-lg" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "INITIATED":
      case "VERIFIED_BY_PARTIES":
        return "bg-yellow-50 border-yellow-200";
      case "PENDING_GOVERNOR":
        return "bg-blue-50 border-blue-200";
      case "APPROVED":
        return "bg-green-50 border-green-200";
      case "REJECTED":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "INITIATED":
      case "VERIFIED_BY_PARTIES":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING_GOVERNOR":
        return "bg-blue-100 text-blue-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmailAdd = (e: any) => {
    e.preventDefault();
    const value = formData.extraEmail?.trim();
    if (!value) return;
    if (value === formData.newOwnerEmail) {
      setMessage("Additional email must be different from primary email");
      setMessageType("error");
      return;
    }
    if (!formData.emails.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        emails: [...prev.emails, value],
        extraEmail: "",
      }));
    }
  };

  const handlePhoneAdd = (e: any) => {
    e.preventDefault();
    const value = formData.extraPhone?.trim();
    if (!value) return;
    if (value === formData.newOwnerPhone) {
      setMessage("Additional phone must be different from primary phone");
      setMessageType("error");
      return;
    }
    if (!formData.phones.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        phones: [...prev.phones, value],
        extraPhone: "",
      }));
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.filter((e) => e !== email),
    }));
  };

  const handleRemovePhone = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((p) => p !== phone),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!formData.landId) {
      setMessage("Please select a land");
      setMessageType("error");
      return;
    }

    if (
      !formData.newOwnerEmail.trim() &&
      !formData.newOwnerPhone.trim() &&
      !formData.emails.length &&
      !formData.phones.length
    ) {
      setMessage("Please provide at least one contact (primary or additional)");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const result = await initiateOwnershipTransfer({
        landId: formData.landId,
        emails: formData.emails,
        phones: formData.phones,
        newOwnerEmail: formData.newOwnerEmail,
        newOwnerPhone: formData.newOwnerPhone,
      });

      setMessage("Ownership transfer initiated successfully!");
      setMessageType("success");

      // Reset form
      setFormData({
        landId: "",
        newOwnerEmail: "",
        newOwnerPhone: "",
        extraEmail: "",
        extraPhone: "",
        emails: [],
        phones: [],
      });

      // Reload transfers
      setTimeout(() => {
        loadTransfersAndLands();
      }, 1000);

      // Navigate to transfer details
      setTimeout(() => {
        navigate(`/dashboard/ownership-transfer/${result.transferId}`);
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || "Failed to initiate transfer");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 px-4 md:px-6 lg:px-8 py-6 md:py-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaExchangeAlt className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">Ownership Transfer</h1>
        </div>
        <p className="text-purple-50">
          Transfer land ownership to a new owner. Provide the necessary details and authorization code to proceed.
        </p>
      </motion.div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 border-l-4 ${
            messageType === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          {messageType === "success" ? (
            <FaCheckCircle className="text-xl flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="text-xl flex-shrink-0" />
          )}
          <p className="font-semibold">{message}</p>
        </motion.div>
      )}

      {/* Transfer Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Land Identification Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaLandmark className="text-purple-600 text-lg md:text-xl" />
                <h2 className="text-base md:text-lg font-bold text-gray-900">Land Identification</h2>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  Select Land <span className="text-red-600">*</span>
                </label>
                <select
                  name="landId"
                  value={formData.landId}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                >
                  <option value="">Choose a land...</option>
                  {lands.map((land) => (
                    <option key={land.id} value={land.id}>
                      #{(land.id).slice(0,6).toUpperCase() || land.name} ({land.squareMeters}m²)
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* New Owner Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-blue-600 text-lg md:text-xl" />
                <h2 className="text-base md:text-lg font-bold text-gray-900">New Owner Contacts</h2>
              </div>

              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 md:left-4 top-3 text-gray-400 text-base md:text-lg" />
                      <input
                        type="email"
                        name="newOwnerEmail"
                        value={formData.newOwnerEmail}
                        onChange={handleChange}
                        className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Primary email (newOwnerEmail)"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <FaEnvelope className="absolute left-3 md:left-4 top-3 text-gray-400 text-base md:text-lg" />
                        <input
                          type="email"
                          name="extraEmail"
                          value={formData.extraEmail}
                          onChange={handleChange}
                          className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="Add additional email"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleEmailAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added Emails */}
                {formData.emails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.emails.map((email) => (
                      <div
                        key={email}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Phone Input */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <FaPhone className="absolute left-3 md:left-4 top-3 text-gray-400 text-base md:text-lg" />
                      <input
                        type="tel"
                        name="newOwnerPhone"
                        value={formData.newOwnerPhone}
                        onChange={handleChange}
                        className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Primary phone (newOwnerPhone)"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <FaPhone className="absolute left-3 md:left-4 top-3 text-gray-400 text-base md:text-lg" />
                        <input
                          type="tel"
                          name="extraPhone"
                          value={formData.extraPhone}
                          onChange={handleChange}
                          className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="Add additional phone"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handlePhoneAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added Phones */}
                {formData.phones.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.phones.map((phone) => (
                      <div
                        key={phone}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {phone}
                        <button
                          type="button"
                          onClick={() => handleRemovePhone(phone)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm md:text-base font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FaArrowRight /> Submit Transfer Request
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Info Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-purple-200"
        >
          <h3 className="font-bold text-sm md:text-base text-gray-900 mb-4 flex items-center gap-2">
            <FaExchangeAlt className="text-purple-600 text-base md:text-lg" /> Transfer Information
          </h3>
          <div className="space-y-4 text-xs md:text-sm">
            <div>
              <p className="font-semibold text-gray-900">Required Fields:</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs" /> Select Land
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs" /> Add Contact Info
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-purple-300">
              <p className="font-semibold text-gray-900">Contact Methods:</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>📧 Email Address</li>
                <li>📱 Phone Number</li>
                <li className="text-purple-600 font-semibold">At least one required</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-purple-300">
              <p className="font-semibold text-gray-900">Workflow:</p>
              <ol className="text-gray-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Submit transfer</li>
                <li>Verify contacts</li>
                <li>Upload documents</li>
                <li>Governor review</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ownership Transfer Applications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <FaExchangeAlt className="text-white text-lg" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Ownership Transfer Applications</h2>
        </div>

        {loadingTransfers ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-lg md:rounded-xl"
          >
            <FaSpinner className="text-4xl md:text-5xl mx-auto mb-4 text-purple-600 animate-spin" />
            <p className="text-gray-500 text-sm md:text-base">Loading transfers...</p>
          </motion.div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-lg md:rounded-xl"
          >
            <FaExchangeAlt className="text-4xl md:text-5xl mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm md:text-base">No ownership transfer applications found.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border-2 transition-all hover:shadow-lg cursor-pointer ${getStatusColor(
                  app.status
                )}`}
              >
                {/* Header with Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{app.land.address}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Role: <span className="font-semibold">{app.userRole.replace(/_/g, " ")}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold capitalize ${getStatusBadgeColor(
                          app.status
                        )}`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Land & Owner Details */}
                <div className="space-y-3 mb-4">
                  <div className="bg-white bg-opacity-60 rounded p-3">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Land Details</p>
                    <p className="text-sm md:text-base text-gray-900 font-semibold">
                      {app.land.address}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {app.land.size}m² • {app.land.state}
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-60 rounded p-3">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Current Owner</p>
                    <p className="text-sm md:text-base text-gray-900 font-semibold">
                      {app.land.currentOwner}
                    </p>
                  </div>
                </div>

                {/* Verification Progress */}
                {app.verification.total > 0 && (
                  <div className="bg-blue-50 rounded p-3 mb-4 text-xs md:text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-blue-900">Verification</p>
                      <span className="text-blue-700 font-bold">{app.verification.progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${app.verification.progress}%` }}
                      />
                    </div>
                    <p className="text-blue-700 mt-1">
                      {app.verification.verified} / {app.verification.total} verified
                    </p>
                  </div>
                )}

                {/* Documentation Status */}
                {app.documentation.submitted > 0 && (
                  <div className="bg-purple-50 rounded p-3 mb-4 text-xs md:text-sm">
                    <p className="font-semibold text-purple-900 mb-2">Documents</p>
                    <div className="grid grid-cols-2 gap-2 text-purple-700">
                      <div>✓ Submitted: <span className="font-bold">{app.documentation.submitted}</span></div>
                      <div>✓ Approved: <span className="font-bold text-green-600">{app.documentation.approved}</span></div>
                      {app.documentation.rejected > 0 && (
                        <div>✗ Rejected: <span className="font-bold text-red-600">{app.documentation.rejected}</span></div>
                      )}
                      {app.documentation.pending > 0 && (
                        <div>⏳ Pending: <span className="font-bold text-yellow-600">{app.documentation.pending}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Overall Progress</span>
                    <span className="text-xs font-bold text-gray-900">{app.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${app.progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full transition-all ${
                        app.status === "APPROVED"
                          ? "bg-green-500"
                          : app.status === "REJECTED"
                          ? "bg-red-500"
                          : app.status === "PENDING_GOVERNOR"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Action Button */}
                {app.status !== "REJECTED" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(`/dashboard/ownership-transfer/${app.id}`, {
                        state: app,
                      });
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm md:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2"
                  >
                    <FaArrowRight /> View Details
                  </motion.button>
                )}

                {app.status === "REJECTED" && (
                  <div className="text-center py-2 px-4 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
                    This application was rejected
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OwnershipTransfer;

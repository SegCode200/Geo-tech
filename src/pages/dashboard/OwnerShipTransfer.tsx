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
  FaMapMarkerAlt,
  FaCompass,
  FaTrash,
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
    transferType: "FULL", // "FULL" or "PARTIAL"
    transferSurveyType: "COORDINATE", // "COORDINATE" or "BEARING"
    coordinates: [{ lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }],
    bearings: [{ distance: "", bearing: "" }, { distance: "", bearing: "" }, { distance: "", bearing: "" }],
    startPoint: { lat: "", lng: "" },
    utmZone: "",
    measuredAreaSqm: "",
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

  // console.log(lands)

  const loadTransfersAndLands = async () => {
    try {
      setLoadingTransfers(true);
      const [transfersData, landsData] = await Promise.all([
        listUserTransfers(),
        getLandsByUser(),
      ]);


      // Support multiple response shapes: either { transfers: [...] } or direct arrays
      setApplications(transfersData?.transfers || transfersData || []);
      setLands(landsData?.lands || landsData || []);
    } catch (error: any) {
      // console.error("Error loading data:", error);
      errorToast( "Failed to load transfer data");
    } finally {
      setLoadingTransfers(false);
    }
  };

  // console.log(applications)
  // console.log(lands)

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

  // Handle Coordinates Change
  const handleCoordinateChange = (index: number, field: 'lat' | 'lng', value: string) => {
    const updatedCoordinates = [...formData.coordinates];
    updatedCoordinates[index] = { ...updatedCoordinates[index], [field]: value };
    setFormData((prev) => ({ ...prev, coordinates: updatedCoordinates }));
  };

  const addCoordinatePoint = () => {
    setFormData((prev) => ({
      ...prev,
      coordinates: [...prev.coordinates, { lat: "", lng: "" }],
    }));
  };

  const removeCoordinatePoint = (index: number) => {
    if (formData.coordinates.length > 4) {
      const updatedCoordinates = formData.coordinates.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, coordinates: updatedCoordinates }));
    }
  };

  // Handle Bearings Change
  const handleBearingChange = (index: number, field: 'distance' | 'bearing', value: string) => {
    const updatedBearings = [...formData.bearings];
    updatedBearings[index] = { ...updatedBearings[index], [field]: value };
    setFormData((prev) => ({ ...prev, bearings: updatedBearings }));
  };

  const addBearing = () => {
    setFormData((prev) => ({
      ...prev,
      bearings: [...prev.bearings, { distance: "", bearing: "" }],
    }));
  };

  const removeBearing = (index: number) => {
    if (formData.bearings.length > 3) {
      const updatedBearings = formData.bearings.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, bearings: updatedBearings }));
    }
  };

  // Handle Start Point Change
  const handleStartPointChange = (field: 'lat' | 'lng', value: string) => {
    setFormData((prev) => ({
      ...prev,
      startPoint: { ...prev.startPoint, [field]: value },
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

    // Validate partial transfer data
    if (formData.transferType === "PARTIAL") {
      if (formData.transferSurveyType === "COORDINATE") {
        const validCoords = formData.coordinates.filter(coord => coord.lat && coord.lng);
        if (validCoords.length < 4) {
          setMessage("At least 4 coordinate points required for partial transfer");
          setMessageType("error");
          return;
        }
        if (!formData.utmZone) {
          setMessage("UTM zone required for coordinate survey");
          setMessageType("error");
          return;
        }
      } else if (formData.transferSurveyType === "BEARING") {
        const validBearings = formData.bearings.filter(bearing => bearing.distance && bearing.bearing);
        if (validBearings.length < 3) {
          setMessage("At least 3 bearings required for partial transfer");
          setMessageType("error");
          return;
        }
        if (!formData.startPoint.lat || !formData.startPoint.lng) {
          setMessage("Starting point required for bearing survey");
          setMessageType("error");
          return;
        }
        if (!formData.utmZone) {
          setMessage("UTM zone required for bearing survey");
          setMessageType("error");
          return;
        }
      }
    }

    try {
      setLoading(true);


      // Merge extraEmail/extraPhone into the arrays if present (and avoid duplicates/primary)
      const emailsPayload = [...formData.emails];
      const extraEmail = formData.extraEmail?.trim();
      if (extraEmail && extraEmail !== formData.newOwnerEmail && !emailsPayload.includes(extraEmail)) {
        emailsPayload.push(extraEmail);
      }

      const phonesPayload = [...formData.phones];
      const extraPhone = formData.extraPhone?.trim();
      if (extraPhone && extraPhone !== formData.newOwnerPhone && !phonesPayload.includes(extraPhone)) {
        phonesPayload.push(extraPhone);
      }

      // Prepare transfer data
      const transferData: any = {
        landId: formData.landId,
        newOwnerEmail: formData.newOwnerEmail,
        newOwnerPhone: formData.newOwnerPhone,
        transferType: formData.transferType,
      };

      // Add survey data for partial transfers
      if (formData.transferType === "PARTIAL") {
        transferData.transferSurveyType = formData.transferSurveyType;

        if (formData.transferSurveyType === "COORDINATE") {
          transferData.coordinates = formData.coordinates
            .filter(coord => coord.lat && coord.lng)
            .map(coord => [parseFloat(coord.lat), parseFloat(coord.lng)]);
          transferData.utmZone = formData.utmZone;
        } else if (formData.transferSurveyType === "BEARING") {
          transferData.bearings = formData.bearings
            .filter(bearing => bearing.distance && bearing.bearing)
            .map(bearing => ({
              distance: parseFloat(bearing.distance),
              bearing: parseFloat(bearing.bearing)
            }));
          transferData.startPoint = [parseFloat(formData.startPoint.lat), parseFloat(formData.startPoint.lng)];
          transferData.utmZone = formData.utmZone;
        }

        if (formData.measuredAreaSqm && !isNaN(parseFloat(formData.measuredAreaSqm)) && parseFloat(formData.measuredAreaSqm) > 0) {
          transferData.measuredAreaSqm = parseFloat(formData.measuredAreaSqm);
        }
      }

      const result = await initiateOwnershipTransfer(transferData);

      setMessage("Ownership transfer initiated successfully!");
      setMessageType("success");

      // Reset form
      setFormData({
        landId: "",
        newOwnerEmail: "",
        newOwnerPhone: "",
        transferType: "FULL",
        transferSurveyType: "COORDINATE",
        coordinates: [{ lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }],
        bearings: [{ distance: "", bearing: "" }, { distance: "", bearing: "" }, { distance: "", bearing: "" }],
        startPoint: { lat: "", lng: "" },
        utmZone: "",
        measuredAreaSqm: "",
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
      // console.log(error)
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
      className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg md:rounded-xl p-4 sm:p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <FaExchangeAlt className="text-lg sm:text-xl md:text-2xl" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">Ownership Transfer</h1>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-purple-50">
          Transfer land ownership to a new owner. Provide the necessary details and authorization code to proceed.
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
            <FaCheckCircle className="text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <FaExclamationCircle className="text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-0" />
          )}
          <p className="font-semibold break-words">{message}</p>
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
                      #{(land.id).slice(0,6).toUpperCase() || land.name} (
                      {land.areaSqm ?? land.size ?? land.totalSquareMeters ?? land.area ?? "N/A"}m²)
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Transfer Type Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaExchangeAlt className="text-green-600 text-lg md:text-xl" />
                <h2 className="text-base md:text-lg font-bold text-gray-900">Transfer Type</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Transfer Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="transferType"
                    value={formData.transferType}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  >
                    <option value="FULL">Full Transfer (Entire Land)</option>
                    <option value="PARTIAL">Partial Transfer (Portion of Land)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.transferType === "FULL"
                      ? "Transfer ownership of the entire land parcel"
                      : "Transfer ownership of a specific portion of the land"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Survey Data Section - Only show for PARTIAL transfers */}
            {formData.transferType === "PARTIAL" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.23 }}
                className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border-l-4 border-orange-500"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaCompass className="text-orange-600 text-lg md:text-xl" />
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Transfer Boundary Survey</h2>
                </div>

                <div className="space-y-6">
                  {/* Survey Type Selection */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Survey Method <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="transferSurveyType"
                      value={formData.transferSurveyType}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    >
                      <option value="COORDINATE">Coordinate Survey (Latitude/Longitude)</option>
                      <option value="BEARING">Bearing Survey (Distance & Bearing)</option>
                    </select>
                  </div>

                  {/* Coordinate Survey */}
                  {formData.transferSurveyType === "COORDINATE" && (
                    <>
                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-4">
                          GPS Coordinates <span className="text-red-600">*</span> (At least 4 points required)
                        </label>
                        <div className="space-y-3">
                          {formData.coordinates.map((coord, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm font-medium text-gray-600 min-w-[60px]">Point {index + 1}:</span>
                              <div className="flex gap-3 flex-1">
                                <input
                                  type="number"
                                  placeholder="Latitude (decimal) e.g., 6.5244"
                                  value={coord.lat}
                                  onChange={(e) => handleCoordinateChange(index, 'lat', e.target.value)}
                                  step="0.0000001"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="Longitude (decimal) e.g., 3.3792"
                                  value={coord.lng}
                                  onChange={(e) => handleCoordinateChange(index, 'lng', e.target.value)}
                                  step="0.0000001"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                />
                              </div>
                              {formData.coordinates.length > 4 && (
                                <button
                                  type="button"
                                  onClick={() => removeCoordinatePoint(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                  title="Remove point"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addCoordinatePoint}
                          className="mt-3 flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          <FaMapMarkerAlt />
                          Add Coordinate Point
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                          UTM Zone <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="utmZone"
                          value={formData.utmZone}
                          onChange={handleChange}
                          placeholder="e.g., 31N, 32N, 33N"
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        />
                      </div>
                    </>
                  )}

                  {/* Bearing Survey */}
                  {formData.transferSurveyType === "BEARING" && (
                    <>
                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-4">
                          Starting Point <span className="text-red-600">*</span>
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">mE (Easting)</label>
                            <input
                              type="number"
                              placeholder="Easting (mE) e.g., 123456.78"
                              value={formData.startPoint.lat}
                              onChange={(e) => handleStartPointChange('lat', e.target.value)}
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">mN (Northing)</label>
                            <input
                              type="number"
                              placeholder="Northing (mN) e.g., 987654.32"
                              value={formData.startPoint.lng}
                              onChange={(e) => handleStartPointChange('lng', e.target.value)}
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-4">
                          Bearings & Distances <span className="text-red-600">*</span> (At least 3 required)
                        </label>
                        <div className="space-y-3">
                          {formData.bearings.map((bearing, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm font-medium text-gray-600 min-w-[100px]">BAU {1901 + index}:</span>
                              <div className="flex gap-3 flex-1">
                                <input
                                  type="number"
                                  placeholder="Distance (meters) e.g., 150.75"
                                  value={bearing.distance}
                                  onChange={(e) => handleBearingChange(index, 'distance', e.target.value)}
                                  step="0.01"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="Bearing (degrees) e.g., 45.5"
                                  value={bearing.bearing}
                                  onChange={(e) => handleBearingChange(index, 'bearing', e.target.value)}
                                  step="0.1"
                                  min="0"
                                  max="360"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                />
                              </div>
                              {formData.bearings.length > 3 && (
                                <button
                                  type="button"
                                  onClick={() => removeBearing(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                  title="Remove bearing"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addBearing}
                          className="mt-3 flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          <FaCompass />
                          Add Bearing
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                          UTM Zone <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="utmZone"
                          value={formData.utmZone}
                          onChange={handleChange}
                          placeholder="e.g., 31N, 32N, 33N"
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        />
                      </div>
                    </>
                  )}

                  {/* Measured Area */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Measured Area (sqm) - Optional
                    </label>
                    <input
                      type="number"
                      name="measuredAreaSqm"
                      value={formData.measuredAreaSqm}
                      onChange={handleChange}
                      placeholder="Enter measured area"
                      step="0.01"
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Area measurement from survey document (will be verified against calculated area)</p>
                  </div>
                </div>
              </motion.div>
            )}

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
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border-2 border-purple-200 h-fit sticky top-4"
        >
          <h3 className="font-bold text-xs sm:text-sm md:text-base text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <FaExchangeAlt className="text-purple-600 text-sm sm:text-base md:text-lg flex-shrink-0" /> Transfer Information
          </h3>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">\n            <div>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Required Fields:</p>
              <ul className="text-gray-700 mt-2 space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs flex-shrink-0" /> Select Land
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-xs flex-shrink-0" /> Add Contact Info
                </li>
              </ul>
            </div>
            <div className="pt-2 sm:pt-3 md:pt-4 border-t border-purple-300">
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Contact Methods:</p>
              <ul className="text-gray-700 mt-2 space-y-1 text-xs">
                <li>📧 Email Address</li>
                <li>📱 Phone Number</li>
                <li className="text-purple-600 font-semibold">At least one required</li>
              </ul>
            </div>
            <div className="pt-2 sm:pt-3 md:pt-4 border-t border-purple-300">
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Workflow:</p>
              <ol className="text-gray-700 mt-2 space-y-1 list-decimal list-inside text-xs">
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
                  app.status || "unknown"
                )}`}
              >
                {/* Header with Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{app.land?.address || "N/A"}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Role: <span className="font-semibold">{app.userRole?.replace(/_/g, " ") || "Unknown"}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status || "unknown")}
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold capitalize ${getStatusBadgeColor(
                          app.status || "unknown"
                        )}`}
                      >
                        {app.status?.replace(/_/g, " ") || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Land & Owner Details */}
                <div className="space-y-3 mb-4">
                  <div className="bg-white bg-opacity-60 rounded p-3">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Land Details</p>
                    <p className="text-sm md:text-base text-gray-900 font-semibold">
                      {app.land?.address || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {app.land?.areaSqm || 0}m² • {app.land?.state || "N/A"}
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-60 rounded p-3">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Current Owner</p>
                    <p className="text-sm md:text-base text-gray-900 font-semibold">
                      {app.land.ownerName}
                    </p>
                  </div>
                </div>

                {/* Verification Progress */}
                {(app.verification?.total ?? 0) > 0 && (
                  <div className="bg-blue-50 rounded p-3 mb-4 text-xs md:text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-blue-900">Verification</p>
                      <span className="text-blue-700 font-bold">{app.verification?.progress ?? 0}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${app.verification?.progress ?? 0}%` }}
                      />
                    </div>
                    <p className="text-blue-700 mt-1">
                      {app.verification?.verified ?? 0} / {app.verification?.total ?? 0} verified
                    </p>
                  </div>
                )}

                {/* Documentation Status */}
                {(app.documentation?.submitted ?? app.documents?.length ?? 0) > 0 && (
                  <div className="bg-purple-50 rounded p-3 mb-4 text-xs md:text-sm">
                    <p className="font-semibold text-purple-900 mb-2">Documents</p>
                    <div className="grid grid-cols-2 gap-2 text-purple-700">
                      <div>✓ Submitted: <span className="font-bold">{app.documentation?.submitted ?? app.documents?.length ?? 0}</span></div>
                      <div>✓ Approved: <span className="font-bold text-green-600">{app.documentation?.approved ?? 0}</span></div>
                      {((app.documentation?.rejected ?? 0) > 0) && (
                        <div>✗ Rejected: <span className="font-bold text-red-600">{app.documentation?.rejected ?? 0}</span></div>
                      )}
                      {((app.documentation?.pending ?? 0) > 0) && (
                        <div>⏳ Pending: <span className="font-bold text-yellow-600">{app.documentation?.pending ?? 0}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Overall Progress</span>
                    <span className="text-xs font-bold text-gray-900">{app.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${app.progressPercentage || 0}%` }}
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

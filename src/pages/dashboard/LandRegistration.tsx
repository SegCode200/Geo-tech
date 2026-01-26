import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import * as authApi from "../../api/auth";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaGlobe,
  FaHome,
  FaFile,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaRuler,
} from "react-icons/fa";
import { motion } from "framer-motion";

const LandRegistration = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    ownerName: "",
    longitude: 0,
    latitude: 0,
    totalSquareMeters: 0,
    ownershipType: "",
    purpose: "",
    titleType: "",
    state: "",
    address: "",
  });

  const [formData, setFormData] = useState<FormData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch States on Component Mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await authApi.getStates();
        setStates(response.state || response);
      } catch (error) {
        console.error("Error fetching states:", error);
        errorToast("Failed to load states");
      }
    };
    fetchStates();
  }, []);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: ["longitude", "latitude", "totalSquareMeters"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  // Handle File Upload
  const handleFileUpload = (e: any) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);

      const formDataObj = new FormData();

      // Append form values to FormData
      formDataObj.append("ownerName", formValues.ownerName);
      formDataObj.append("longitude", formValues.longitude.toString());
      formDataObj.append("latitude", formValues.latitude.toString());
      formDataObj.append(
        "squareMeters",
        formValues.totalSquareMeters.toString()
      );
      formDataObj.append("ownershipType", formValues.ownershipType);
      formDataObj.append("purpose", formValues.purpose);
      formDataObj.append("titleType", formValues.titleType);
      formDataObj.append("state", formValues.state);
      if (formValues.address) {
        formDataObj.append("address", formValues.address);
      }

      // Append all files
      updatedFiles.forEach((file) => {
        formDataObj.append("documents", file);
      });

      setFormData(formDataObj);
      // Reset file input
      e.target.value = "";
    }
  };

  // Remove File
  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    const formDataObj = new FormData();

    // Append form values to FormData
    formDataObj.append("ownerName", formValues.ownerName);
    formDataObj.append("longitude", formValues.longitude.toString());
    formDataObj.append("latitude", formValues.latitude.toString());
    formDataObj.append(
      "squareMeters",
      formValues.totalSquareMeters.toString()
    );
    formDataObj.append("ownershipType", formValues.ownershipType);
    formDataObj.append("purpose", formValues.purpose);
    formDataObj.append("titleType", formValues.titleType);
    formDataObj.append("stateId", formValues.state);
    if (formValues.address) {
      formDataObj.append("address", formValues.address);
    }

    // Append remaining files
    updatedFiles.forEach((file) => {
      formDataObj.append("documents", file);
    });

    setFormData(formDataObj);
  };

  // Validate Required Fields Before Submitting
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.ownerName) newErrors.ownerName = "Owner name is required.";
    if (!formValues.longitude) newErrors.longitude = "Longitude is required.";
    if (!formValues.latitude) newErrors.latitude = "Latitude is required.";
    if (!formValues.totalSquareMeters)
      newErrors.totalSquareMeters = "Total square meters is required.";
    if (!formValues.ownershipType)
      newErrors.ownershipType = "Ownership type is required.";
    if (!formValues.purpose) newErrors.purpose = "Purpose is required.";
    if (!formValues.titleType) newErrors.titleType = "Title type is required.";
    if (!formValues.state) newErrors.state = "State is required.";
    if (!formData || formData.getAll("documents").length === 0)
      newErrors.documents = "At least one document is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Create FormData with current form values and files
    const formDataObj = new FormData();
    formDataObj.append("ownerName", formValues.ownerName);
    formDataObj.append("longitude", formValues.longitude.toString());
    formDataObj.append("latitude", formValues.latitude.toString());
    formDataObj.append("squareMeters", formValues.totalSquareMeters.toString());
    formDataObj.append("ownershipType", formValues.ownershipType);
    formDataObj.append("purpose", formValues.purpose);
    formDataObj.append("titleType", formValues.titleType);
    formDataObj.append("stateId", formValues.state);
    if (formValues.address) {
      formDataObj.append("address", formValues.address);
    }

    // Append all files
    uploadedFiles.forEach((file) => {
      formDataObj.append("documents", file);
    });

    console.log("Forms Submitted Successfully!", formDataObj);

    try {
      const response = await authApi.landRegisteration(formDataObj);
      console.log("Land registration response:", response);
      successToast("Land registered successfully!");
      navigate("/dashboard/list-of-registrations");
    } catch (error: any) {
      console.error("Land registration error:", error);
      const errorMsg = getApiErrorMessage(error);
      errorToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/dashboard/list-of-registrations")}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <FaArrowLeft />
            Back to Land Management
          </button>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-green-500 rounded-lg">
                <FaMapMarkerAlt className="text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Register New Land</h1>
                <p className="text-green-100 mt-2">
                  Add your property details and documentation to the system
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Owner Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center gap-3">
              <FaUser className="text-2xl" />
              <h2 className="text-2xl font-bold">Owner Information</h2>
            </div>
            <div className="p-8">
              <div className="max-w-2xl">
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formValues.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                />
                {errors.ownerName && (
                  <p className="text-red-500 text-sm mt-2">{errors.ownerName}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Location & Coordinates Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white flex items-center gap-3">
              <FaGlobe className="text-2xl" />
              <h2 className="text-2xl font-bold">Location Coordinates</h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formValues.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 6.4713427"
                    step="0.0000001"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  {errors.latitude && (
                    <p className="text-red-500 text-sm mt-2">{errors.latitude}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formValues.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 3.3489682"
                    step="0.0000001"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  {errors.longitude && (
                    <p className="text-red-500 text-sm mt-2">{errors.longitude}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white flex items-center gap-3">
              <FaMapMarkerAlt className="text-2xl" />
              <h2 className="text-2xl font-bold">Address (Optional)</h2>
            </div>
            <div className="p-8">
              <div className="max-w-2xl">
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Enter the street address for this land"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-slate-50"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Land Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white flex items-center gap-3">
              <FaRuler className="text-2xl" />
              <h2 className="text-2xl font-bold">Land Details</h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Total Square Meters <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalSquareMeters"
                    value={formValues.totalSquareMeters}
                    onChange={handleChange}
                    placeholder="e.g., 399"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  {errors.totalSquareMeters && (
                    <p className="text-red-500 text-sm mt-2">{errors.totalSquareMeters}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Purpose <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="purpose"
                    value={formValues.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                  >
                    <option value="">Select Purpose</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed Use</option>
                    <option value="industrial">Industrial</option>
                  </select>
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-2">{errors.purpose}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ownership & Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white flex items-center gap-3">
              <FaHome className="text-2xl" />
              <h2 className="text-2xl font-bold">Ownership & Title</h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Ownership Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ownershipType"
                    value={formValues.ownershipType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50"
                  >
                    <option value="">Select Type</option>
                    <option value="private">Private</option>
                    <option value="government">Government</option>
                    <option value="communal">Communal</option>
                  </select>
                  {errors.ownershipType && (
                    <p className="text-red-500 text-sm mt-2">{errors.ownershipType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Title Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="titleType"
                    value={formValues.titleType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50"
                  >
                    <option value="">Select Title</option>
                    <option value="certificate-of-occupancy">Certificate of Occupancy</option>
                    <option value="right-of-occupancy">Right of Occupancy</option>
                    <option value="lease">Lease</option>
                    <option value="freehold">Freehold</option>
                  </select>
                  {errors.titleType && (
                    <p className="text-red-500 text-sm mt-2">{errors.titleType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formValues.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50"
                  >
                    <option value="">Select State</option>
                    {states.map((state: any) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-2">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white flex items-center gap-3">
              <FaFile className="text-2xl" />
              <h2 className="text-2xl font-bold">Upload Documents</h2>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <label htmlFor="file-upload" className="block text-sm font-bold text-slate-700 uppercase mb-3">
                  Select Documents <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed border-cyan-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all bg-cyan-50"
                  >
                    <div className="text-center">
                      <FaUpload className="text-4xl text-cyan-600 mx-auto mb-3" />
                      <p className="text-slate-900 font-semibold">Click to upload or drag and drop</p>
                      <p className="text-slate-500 text-sm mt-1">PDF, PNG, JPG or other documents</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <h3 className="text-sm font-bold text-slate-700 uppercase mb-4">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-cyan-50 border border-cyan-200 rounded-lg hover:border-cyan-400 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FaFile className="text-cyan-600 text-lg flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Remove file"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {errors.documents && (
                <p className="text-red-500 text-sm mt-4">{errors.documents}</p>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 max-w-2xl"
          >
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering Land...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Register Land
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/list-of-registrations")}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-all"
            >
              <FaArrowLeft />
              Cancel
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default LandRegistration;

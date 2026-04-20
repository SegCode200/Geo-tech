import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import * as authApi from "../../api/auth";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaGlobe,
  FaHome,
  FaFile,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaRuler,
  FaInfoCircle,
  FaCompass,
} from "react-icons/fa";
import { motion } from "framer-motion";

const LandRegistration = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    ownerName: "",
    surveyType: "COORDINATE", // "COORDINATE" or "BEARING"
    coordinates: [{ lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }],
    bearings: [{ distance: "", bearing: "" }, { distance: "", bearing: "" }, { distance: "", bearing: "" }],
    startPoint: { lat: "", lng: "" },
    utmZone: "",
    ownershipType: "",
    purpose: "",
    titleType: "",
    state: "",
    address: "",
    plotNumber: "",
    parentLandId: "",
    surveyPlanNumber: "",
    surveyDate: "",
    surveyorName: "",
    surveyorAddress: "",
    surveyTelephone: "",
    surveyNotes: "",
    accuracyLevel: "",
    measuredAreaSqm: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Coordinates Change
  const handleCoordinateChange = (index: number, field: 'lat' | 'lng', value: string) => {
    const updatedCoordinates = [...formValues.coordinates];
    updatedCoordinates[index] = { ...updatedCoordinates[index], [field]: value };
    setFormValues((prev) => ({ ...prev, coordinates: updatedCoordinates }));
  };

  const addCoordinatePoint = () => {
    setFormValues((prev) => ({
      ...prev,
      coordinates: [...prev.coordinates, { lat: "", lng: "" }],
    }));
  };

  const removeCoordinatePoint = (index: number) => {
    if (formValues.coordinates.length > 4) {
      const updatedCoordinates = formValues.coordinates.filter((_, i) => i !== index);
      setFormValues((prev) => ({ ...prev, coordinates: updatedCoordinates }));
    }
  };

  // Handle Bearings Change
  const handleBearingChange = (index: number, field: 'distance' | 'bearing', value: string) => {
    const updatedBearings = [...formValues.bearings];
    updatedBearings[index] = { ...updatedBearings[index], [field]: value };
    setFormValues((prev) => ({ ...prev, bearings: updatedBearings }));
  };

  const addBearing = () => {
    setFormValues((prev) => ({
      ...prev,
      bearings: [...prev.bearings, { distance: "", bearing: "" }],
    }));
  };

  const removeBearing = (index: number) => {
    if (formValues.bearings.length > 3) {
      const updatedBearings = formValues.bearings.filter((_, i) => i !== index);
      setFormValues((prev) => ({ ...prev, bearings: updatedBearings }));
    }
  };

  // Handle Start Point Change
  const handleStartPointChange = (field: 'lat' | 'lng', value: string) => {
    setFormValues((prev) => ({
      ...prev,
      startPoint: { ...prev.startPoint, [field]: value },
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
      formDataObj.append("surveyType", formValues.surveyType);

      if (formValues.surveyType === "COORDINATE") {
        const coordsArray = formValues.coordinates.map(coord => [parseFloat(coord.lat), parseFloat(coord.lng)]);
        formDataObj.append("coordinates", JSON.stringify(coordsArray));
        formDataObj.append("utmZone", formValues.utmZone);
      } else if (formValues.surveyType === "BEARING") {
        const bearingsArray = formValues.bearings.map(bearing => ({
          distance: parseFloat(bearing.distance),
          bearing: parseFloat(bearing.bearing)
        }));
        formDataObj.append("bearings", JSON.stringify(bearingsArray));
        formDataObj.append("startPoint", JSON.stringify([parseFloat(formValues.startPoint.lat), parseFloat(formValues.startPoint.lng)]));
        formDataObj.append("utmZone", formValues.utmZone);
      }

      formDataObj.append("ownershipType", formValues.ownershipType);
      formDataObj.append("purpose", formValues.purpose);
      formDataObj.append("titleType", formValues.titleType);
      formDataObj.append("stateId", formValues.state);
      if (formValues.address) {
        formDataObj.append("address", formValues.address);
      }
      if (formValues.plotNumber) {
        formDataObj.append("plotNumber", formValues.plotNumber);
      }
      if (formValues.parentLandId) {
        formDataObj.append("parentLandId", formValues.parentLandId);
      }
      formDataObj.append("surveyPlanNumber", formValues.surveyPlanNumber);
      if (formValues.surveyDate) {
        formDataObj.append("surveyDate", formValues.surveyDate);
      }
      formDataObj.append("surveyorName", formValues.surveyorName);

      if (formValues.surveyorAddress) {
        formDataObj.append("surveyorAddress", formValues.surveyorAddress);
      }
      if (formValues.surveyTelephone) {
        formDataObj.append("surveyTelephone", formValues.surveyTelephone);
      }
      if (formValues.surveyNotes) {
        formDataObj.append("surveyNotes", formValues.surveyNotes);
      }
      formDataObj.append("accuracyLevel", formValues.accuracyLevel);
      const measuredArea = formValues.measuredAreaSqm ? formValues.measuredAreaSqm.trim() : "";
      if (measuredArea && !isNaN(parseFloat(measuredArea)) && parseFloat(measuredArea) > 0) {
        formDataObj.append("measuredAreaSqm", measuredArea);
      }

      // Append all files
      updatedFiles.forEach((file) => {
        formDataObj.append("documents", file);
      });

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
    formDataObj.append("surveyType", formValues.surveyType);

    if (formValues.surveyType === "COORDINATE") {
      const coordsArray = formValues.coordinates.map(coord => [parseFloat(coord.lat), parseFloat(coord.lng)]);
      formDataObj.append("coordinates", JSON.stringify(coordsArray));
      formDataObj.append("utmZone", formValues.utmZone);
    } else if (formValues.surveyType === "BEARING") {
      const bearingsArray = formValues.bearings.map(bearing => ({
        distance: parseFloat(bearing.distance),
        bearing: parseFloat(bearing.bearing)
      }));
      formDataObj.append("bearings", JSON.stringify(bearingsArray));
      formDataObj.append("startPoint", JSON.stringify([parseFloat(formValues.startPoint.lat), parseFloat(formValues.startPoint.lng)]));
      formDataObj.append("utmZone", formValues.utmZone);
    }

    formDataObj.append("ownershipType", formValues.ownershipType);
    formDataObj.append("purpose", formValues.purpose);
    formDataObj.append("titleType", formValues.titleType);
    formDataObj.append("stateId", formValues.state);
    if (formValues.address) {
      formDataObj.append("address", formValues.address);
    }
    if (formValues.plotNumber) {
      formDataObj.append("plotNumber", formValues.plotNumber);
    }
    if (formValues.parentLandId) {
      formDataObj.append("parentLandId", formValues.parentLandId);
    }
    formDataObj.append("surveyPlanNumber", formValues.surveyPlanNumber);
    if (formValues.surveyDate) {
      formDataObj.append("surveyDate", formValues.surveyDate);
    }
    formDataObj.append("surveyorName", formValues.surveyorName);

    if (formValues.surveyorAddress) {
      formDataObj.append("surveyorAddress", formValues.surveyorAddress);
    }
    if (formValues.surveyTelephone) {
      formDataObj.append("surveyTelephone", formValues.surveyTelephone);
    }
    if (formValues.surveyNotes) {
      formDataObj.append("surveyNotes", formValues.surveyNotes);
    }
    formDataObj.append("accuracyLevel", formValues.accuracyLevel);
    const measuredArea = formValues.measuredAreaSqm ? formValues.measuredAreaSqm.trim() : "";
    if (measuredArea && !isNaN(parseFloat(measuredArea)) && parseFloat(measuredArea) > 0) {
      formDataObj.append("measuredAreaSqm", measuredArea);
    }

    // Append remaining files
    updatedFiles.forEach((file) => {
      formDataObj.append("documents", file);
    });
  };

  // Validate Required Fields Before Submitting
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.ownerName) newErrors.ownerName = "Owner name is required.";
    if (!formValues.surveyType) newErrors.surveyType = "Survey type is required.";

    if (formValues.surveyType === "COORDINATE") {
      if (formValues.coordinates.length < 4) newErrors.coordinates = "At least 4 coordinate points are required.";
      for (let i = 0; i < formValues.coordinates.length; i++) {
        const coord = formValues.coordinates[i];
        if (!coord.lat || isNaN(parseFloat(coord.lat))) newErrors[`coordinates_${i}_lat`] = `Point ${i + 1}: Invalid latitude.`;
        if (!coord.lng || isNaN(parseFloat(coord.lng))) newErrors[`coordinates_${i}_lng`] = `Point ${i + 1}: Invalid longitude.`;
      }
      if (!formValues.utmZone) newErrors.utmZone = "UTM zone is required for coordinate surveys.";
    } else if (formValues.surveyType === "BEARING") {
      if (formValues.bearings.length < 3) newErrors.bearings = "At least 3 bearings are required.";
      for (let i = 0; i < formValues.bearings.length; i++) {
        const bearing = formValues.bearings[i];
        if (!bearing.distance || isNaN(parseFloat(bearing.distance))) newErrors[`bearings_${i}_distance`] = `Bearing ${i + 1}: Invalid distance.`;
        if (!bearing.bearing || isNaN(parseFloat(bearing.bearing))) newErrors[`bearings_${i}_bearing`] = `Bearing ${i + 1}: Invalid bearing.`;
      }
      if (!formValues.startPoint.lat || isNaN(parseFloat(formValues.startPoint.lat))) newErrors.startPoint_lat = "Invalid start point Easting (mE).";
      if (!formValues.startPoint.lng || isNaN(parseFloat(formValues.startPoint.lng))) newErrors.startPoint_lng = "Invalid start point Northing (mN).";
      if (!formValues.utmZone) newErrors.utmZone = "UTM zone is required for bearing surveys.";
    }

    if (!formValues.ownershipType) newErrors.ownershipType = "Ownership type is required.";
    if (!formValues.purpose) newErrors.purpose = "Purpose is required.";
    if (!formValues.titleType) newErrors.titleType = "Title type is required.";
    if (!formValues.state) newErrors.state = "State is required.";
    if (!formValues.surveyPlanNumber) newErrors.surveyPlanNumber = "Survey plan number is required.";
    if (!formValues.surveyorName) newErrors.surveyorName = "Surveyor name is required.";
    if (!formValues.accuracyLevel) newErrors.accuracyLevel = "Accuracy level is required.";
    if (uploadedFiles.length === 0) newErrors.documents = "At least one document is required.";
    if (formValues.measuredAreaSqm && (isNaN(parseFloat(formValues.measuredAreaSqm)) || parseFloat(formValues.measuredAreaSqm) <= 0)) {
      newErrors.measuredAreaSqm = "Measured area must be a positive number.";
    }
    
    // Log errors to console for debugging
    if (Object.keys(newErrors).length > 0) {
      console.log("Form Validation Errors:", newErrors);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Land Verification
  const handleVerifyLand = async () => {
    // Validate basic required fields first
    if (!formValues.surveyType) {
      errorToast("Please select a survey type");
      return;
    }

    if (formValues.surveyType === "COORDINATE") {
      for (let i = 0; i < formValues.coordinates.length; i++) {
        const coord = formValues.coordinates[i];
        if (!coord.lat || !coord.lng || isNaN(parseFloat(coord.lat)) || isNaN(parseFloat(coord.lng))) {
          errorToast(`Please enter valid coordinates for Point ${i + 1}`);
          return;
        }
      }
      if (!formValues.utmZone) {
        errorToast("Please enter UTM zone");
        return;
      }
    } else if (formValues.surveyType === "BEARING") {
      for (let i = 0; i < formValues.bearings.length; i++) {
        const bearing = formValues.bearings[i];
        if (!bearing.distance || !bearing.bearing || isNaN(parseFloat(bearing.distance)) || isNaN(parseFloat(bearing.bearing))) {
          errorToast(`Please enter valid distance and bearing for Bearing ${i + 1}`);
          return;
        }
      }
      if (!formValues.startPoint.lat || !formValues.startPoint.lng) {
        errorToast("Please enter the starting point");
        return;
      }
      if (!formValues.utmZone) {
        errorToast("Please enter UTM zone");
        return;
      }
    }

    setVerifying(true);
    try {
      const verificationData = {
        surveyType: formValues.surveyType,
        coordinates: formValues.surveyType === "COORDINATE" 
          ? formValues.coordinates.map(c => [parseFloat(c.lat), parseFloat(c.lng)])
          : undefined,
        bearings: formValues.surveyType === "BEARING"
          ? formValues.bearings.map(b => ({ distance: parseFloat(b.distance), bearing: parseFloat(b.bearing) }))
          : undefined,
        startPoint: formValues.surveyType === "BEARING"
          ? [parseFloat(formValues.startPoint.lat), parseFloat(formValues.startPoint.lng)]
          : undefined,
        utmZone: formValues.utmZone,
        stateId: formValues.state || undefined,
      };

      const response = await authApi.verifyLand(verificationData);
      setVerificationResult(response);

      if (response.riskLevel === "SAFE") {
        successToast("✓ Land verification successful! This land is available for registration.");
      } else if (response.riskLevel === "GOVERNMENT") {
        errorToast("⚠ This land belongs to government. See details below.");
      } else {
        errorToast("⚠ This land overlaps with existing properties. See details below.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMsg = getApiErrorMessage(error);
      errorToast(`Verification failed: ${errorMsg}`);
      setVerificationResult(null);
    } finally {
      setVerifying(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationResult || verificationResult.riskLevel !== "SAFE") {
      errorToast("Please verify the land first and ensure it's safe for registration");
      return;
    }
    if (!validateForm()) {
      errorToast("Please fix all validation errors before submitting. Check the errors shown in the form.");
      return;
    }

    setLoading(true);

    // Create FormData with current form values and files
    const formDataObj = new FormData();
    formDataObj.append("ownerName", formValues.ownerName);
    formDataObj.append("surveyType", formValues.surveyType);

    if (formValues.surveyType === "COORDINATE") {
      const coordsArray = formValues.coordinates.map(coord => [parseFloat(coord.lat), parseFloat(coord.lng)]);
      formDataObj.append("coordinates", JSON.stringify(coordsArray));
      formDataObj.append("utmZone", formValues.utmZone);
    } else if (formValues.surveyType === "BEARING") {
      const bearingsArray = formValues.bearings.map(bearing => ({
        distance: parseFloat(bearing.distance),
        bearing: parseFloat(bearing.bearing)
      }));
      formDataObj.append("bearings", JSON.stringify(bearingsArray));
      formDataObj.append("startPoint", JSON.stringify([parseFloat(formValues.startPoint.lat), parseFloat(formValues.startPoint.lng)]));
      formDataObj.append("utmZone", formValues.utmZone);
    }

    formDataObj.append("ownershipType", formValues.ownershipType);
    formDataObj.append("purpose", formValues.purpose);
    formDataObj.append("titleType", formValues.titleType);
    formDataObj.append("stateId", formValues.state);
    if (formValues.address) {
      formDataObj.append("address", formValues.address);
    }
    if (formValues.plotNumber) {
      formDataObj.append("plotNumber", formValues.plotNumber);
    }
    if (formValues.parentLandId) {
      formDataObj.append("parentLandId", formValues.parentLandId);
    }
    formDataObj.append("surveyPlanNumber", formValues.surveyPlanNumber);
    if (formValues.surveyDate) {
      formDataObj.append("surveyDate", formValues.surveyDate);
    }
    formDataObj.append("surveyorName", formValues.surveyorName);
    if (formValues.surveyorAddress) {
      formDataObj.append("surveyorAddress", formValues.surveyorAddress);
    }
    if (formValues.surveyTelephone) {
      formDataObj.append("surveyTelephone", formValues.surveyTelephone);
    }
    if (formValues.surveyNotes) {
      formDataObj.append("surveyNotes", formValues.surveyNotes);
    }
    formDataObj.append("accuracyLevel", formValues.accuracyLevel);
    const measuredArea = formValues.measuredAreaSqm ? formValues.measuredAreaSqm.trim() : "";
    if (measuredArea && !isNaN(parseFloat(measuredArea)) && parseFloat(measuredArea) > 0) {
      formDataObj.append("measuredAreaSqm", measuredArea);
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
          {/* Survey Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center gap-3">
              <FaCompass className="text-2xl" />
              <h2 className="text-2xl font-bold">Survey Method</h2>
            </div>
            <div className="p-8">
              <div className="max-w-2xl">
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  Survey Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="surveyType"
                  value={formValues.surveyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                >
                  <option value="COORDINATE">Coordinate Survey (Latitude/Longitude)</option>
                  <option value="BEARING">Bearing Survey (Distance & Bearing)</option>
                </select>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      {formValues.surveyType === "COORDINATE" ? (
                        <>
                          <strong>Coordinate Survey:</strong> Use this method if you have GPS coordinates (latitude/longitude) for each corner of your land. These coordinates are typically found on survey plans, GPS devices, or satellite imagery. You will need at least 4 coordinate points to define a complete parcel.
                        </>
                      ) : (
                        <>
                          <strong>Bearing Survey:</strong> Use this method if your survey document shows distances and compass bearings from a starting point. This is the traditional surveying method using angles and measurements. You will need a starting coordinate and at least 3 bearing measurements.
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {errors.surveyType && (
                  <p className="text-red-500 text-sm mt-2">{errors.surveyType}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Location & Survey Data Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white flex items-center gap-3">
              <FaGlobe className="text-2xl" />
              <h2 className="text-2xl font-bold">
                {formValues.surveyType === "COORDINATE" ? "Land Coordinates" : "Bearing Survey Data"}
              </h2>
            </div>
            <div className="p-8">
              {formValues.surveyType === "COORDINATE" ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-4">
                      GPS Coordinates <span className="text-red-500">*</span> (At least 4 points required)
                    </label>
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-amber-600 mt-1 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <strong>Where to find coordinates:</strong>
                          <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li><strong>Survey Plan:</strong> Look for "Coordinates" or "Lat/Long" table in the survey document</li>
                            <li><strong>GPS Device:</strong> Use a GPS receiver at each corner of your land</li>
                            <li><strong>Google Maps:</strong> Right-click on map points and select "What's here?"</li>
                            <li><strong>Format:</strong> Latitude: 6.5244° N, Longitude: 3.3792° E (decimal degrees)</li>
                            <li><strong>UTM Zone:</strong> For Nigeria, typically zones 31-33N (e.g., "31N", "32N", "33N")</li>
                          </ul>
                          <p className="mt-2 font-semibold">Enter coordinates in order: Start from any corner and go clockwise around the parcel.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {formValues.coordinates.map((coord, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm font-medium text-slate-600 min-w-[60px]">Point {index + 1}:</span>
                          <div className="flex gap-4 flex-1">
                            <div className="flex-1">
                              <input
                                type="number"
                                placeholder="Latitude (decimal) e.g., 6.5244"
                                value={coord.lat}
                                onChange={(e) => handleCoordinateChange(index, 'lat', e.target.value)}
                                step="0.0000001"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                              {errors[`coordinates_${index}_lat`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`coordinates_${index}_lat`]}</p>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                placeholder="Longitude (decimal) e.g., 3.3792"
                                value={coord.lng}
                                onChange={(e) => handleCoordinateChange(index, 'lng', e.target.value)}
                                step="0.0000001"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                              {errors[`coordinates_${index}_lng`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`coordinates_${index}_lng`]}</p>
                              )}
                            </div>
                          </div>
                          {formValues.coordinates.length > 4 && (
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
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FaMapMarkerAlt />
                      Add Coordinate Point
                    </button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                      UTM Zone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="utmZone"
                      value={formValues.utmZone}
                      onChange={handleChange}
                      placeholder="e.g., 31N, 32N, 33N"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">UTM zone for coordinate conversion (required for coordinate surveys)</p>
                    {errors.utmZone && (
                      <p className="text-red-500 text-sm mt-2">{errors.utmZone}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-4">
                      Starting Point <span className="text-red-500">*</span>
                    </label>
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-amber-600 mt-1 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <strong>Starting Point:</strong> In Nigerian survey documents, the start point is usually a benchmark or control point labeled like "BAU 1901", "BAU 1902" or a similar point ID. It is often found near the top, left, or bottom edge of the plan and is given as Easting and Northing values.
                          <p className="mt-2">Enter the starting coordinate exactly as shown: first the mE value, then the mN value.</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">mE (Easting)</label>
                        <input
                          type="number"
                          placeholder="Easting (mE) e.g., 123456.78"
                          value={formValues.startPoint.lat}
                          onChange={(e) => handleStartPointChange('lat', e.target.value)}
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {errors.startPoint_lat && (
                          <p className="text-red-500 text-xs mt-1">{errors.startPoint_lat}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">mN (Northing)</label>
                        <input
                          type="number"
                          placeholder="Northing (mN) e.g., 987654.32"
                          value={formValues.startPoint.lng}
                          onChange={(e) => handleStartPointChange('lng', e.target.value)}
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {errors.startPoint_lng && (
                          <p className="text-red-500 text-xs mt-1">{errors.startPoint_lng}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-4">
                      Bearings & Distances <span className="text-red-500">*</span> (At least 3 required)
                    </label>
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-amber-600 mt-1 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <strong>Where to find bearings:</strong>
                          <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li><strong>Survey Plan:</strong> Look for "Bearings" or "Azimuths" table showing angles from north</li>
                            <li><strong>Format:</strong> Bearing: 45°30' (degrees and minutes) or 45.5° (decimal degrees)</li>
                            <li><strong>Distance:</strong> Usually in meters (m) from the survey plan measurements</li>
                            <li><strong>Direction:</strong> Clockwise from north (0° = North, 90° = East, 180° = South, 270° = West)</li>
                            <li><strong>Example:</strong> "N 45°30' E, 150.75m" means 45.5° bearing, 150.75m distance</li>
                            <li><strong>UTM coordinate layout:</strong> This sample shows UTM Zone 31 at the top and uses edge coordinates: mN on the left margin and mE on the bottom margin.</li>
                            <li><strong>Start point:</strong> Use the first clearly marked coordinate on the survey edge or the first traverse station shown on the plan. If the plan labels control points like BAU 1901 or BAU 1902, use that same starting station.</li>
                            <li><strong>Easting/Northing order:</strong> Always enter the start point as mE first, then mN.</li>
                            <li><strong>Bearing order:</strong> Enter bearings in the same sequence shown on the document, moving around the parcel from the start point. Nigerian bearing plans usually list bearings from one traverse point to the next in clockwise order.</li>
                          </ul>
                          <p className="mt-2 font-semibold">Enter bearings in order: start from the starting point and follow the survey document around the parcel.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {formValues.bearings.map((bearing, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm font-medium text-slate-600 min-w-[100px]">BAU {1901 + index}:</span>
                          <div className="flex gap-4 flex-1">
                            <div className="flex-1">
                              <input
                                type="number"
                                placeholder="Distance (meters) e.g., 150.75"
                                value={bearing.distance}
                                onChange={(e) => handleBearingChange(index, 'distance', e.target.value)}
                                step="0.01"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                              {errors[`bearings_${index}_distance`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`bearings_${index}_distance`]}</p>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                placeholder="Bearing (degrees) e.g., 45.5"
                                value={bearing.bearing}
                                onChange={(e) => handleBearingChange(index, 'bearing', e.target.value)}
                                step="0.1"
                                min="0"
                                max="360"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                              {errors[`bearings_${index}_bearing`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`bearings_${index}_bearing`]}</p>
                              )}
                            </div>
                          </div>
                          {formValues.bearings.length > 3 && (
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
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FaCompass />
                      Add Bearing
                    </button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                      UTM Zone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="utmZone"
                      value={formValues.utmZone}
                      onChange={handleChange}
                      placeholder="e.g., 31N, 32N, 33N"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">UTM zone for bearing calculations (required for bearing surveys)</p>
                    {errors.utmZone && (
                      <p className="text-red-500 text-sm mt-2">{errors.utmZone}</p>
                    )}
                  </div>
                </>
              )}
              {errors.coordinates && (
                <p className="text-red-500 text-sm mt-2">{errors.coordinates}</p>
              )}
              {errors.bearings && (
                <p className="text-red-500 text-sm mt-2">{errors.bearings}</p>
              )}
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
              <h2 className="text-2xl font-bold">Address & Location</h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formValues.ownerName}
                    onChange={handleChange}
                    placeholder="Enter the owner's full name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Full name of the land owner</p>
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-2">{errors.ownerName}</p>
                  )}
                </div>
                <div>
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
                  <p className="text-xs text-slate-500 mt-1">Full address as shown on survey documents</p>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Plot Number
                  </label>
                  <input
                    type="text"
                    name="plotNumber"
                    value={formValues.plotNumber}
                    onChange={handleChange}
                    placeholder="Enter plot number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Plot number from the survey plan</p>
                </div>
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
                    <option value="religious">Religious</option>
                    <option value="educational">Educational</option>
                    <option value="recreational">Recreational</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Primary use of the land</p>
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-2">{errors.purpose}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Measured Area (sqm)
                  </label>
                  <input
                    type="number"
                    name="measuredAreaSqm"
                    value={formValues.measuredAreaSqm}
                    onChange={handleChange}
                    placeholder="Enter measured area"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Area measurement from survey document (optional, will be verified against calculated area)</p>
                  {errors.measuredAreaSqm && (
                    <p className="text-red-500 text-sm mt-2">{errors.measuredAreaSqm}</p>
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
                    <option value="certificate-of-occupancy">Certificate of Occupancy (C of O)</option>
                    <option value="right-of-occupancy">Right of Occupancy (R of O)</option>
                    <option value="deed-of-assignment">Deed of Assignment</option>
                    <option value="lease">Lease</option>
                    <option value="freehold">Freehold</option>
                    <option value="customary-right">Customary Right of Occupancy</option>
                    <option value="statutory-right">Statutory Right of Occupancy</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Type of land title document</p>
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

          {/* Survey Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white flex items-center gap-3">
              <FaFile className="text-2xl" />
              <h2 className="text-2xl font-bold">Survey Details</h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Survey Plan Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surveyPlanNumber"
                    value={formValues.surveyPlanNumber}
                    onChange={handleChange}
                    placeholder="Enter survey plan number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Found on the survey plan document (e.g., "Lagos/SP/2024/001")</p>
                  {errors.surveyPlanNumber && (
                    <p className="text-red-500 text-sm mt-2">{errors.surveyPlanNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Survey Date
                  </label>
                  <input
                    type="date"
                    name="surveyDate"
                    value={formValues.surveyDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Date when the survey was conducted</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Surveyor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surveyorName"
                    value={formValues.surveyorName}
                    onChange={handleChange}
                    placeholder="Enter surveyor name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Name of the licensed surveyor who conducted the survey</p>
                  {errors.surveyorName && (
                    <p className="text-red-500 text-sm mt-2">{errors.surveyorName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Surveyor Address
                  </label>
                  <input
                    type="text"
                    name="surveyorAddress"
                    value={formValues.surveyorAddress}
                    onChange={handleChange}
                    placeholder="Enter surveyor office address"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Office address of the surveying firm</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Survey Telephone
                  </label>
                  <input
                    type="tel"
                    name="surveyTelephone"
                    value={formValues.surveyTelephone}
                    onChange={handleChange}
                    placeholder="Enter contact phone number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Contact number for the surveyor</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Measured Area (sqm)
                  </label>
                  <input
                    type="number"
                    name="measuredAreaSqm"
                    value={formValues.measuredAreaSqm}
                    onChange={handleChange}
                    placeholder="Enter measured area"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Area measurement from survey document (optional, will be verified)</p>
                  {errors.measuredAreaSqm && (
                    <p className="text-red-500 text-sm mt-2">{errors.measuredAreaSqm}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Survey Notes
                  </label>
                  <textarea
                    name="surveyNotes"
                    value={formValues.surveyNotes}
                    onChange={handleChange}
                    placeholder="Enter any additional survey notes or observations"
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Additional notes from the surveyor</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Accuracy Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accuracyLevel"
                    value={formValues.accuracyLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  >
                    <option value="">Select Accuracy Level</option>
                    <option value="SURVEYED">Surveyed (Professional Survey)</option>
                    <option value="SATELLITE">Satellite (GPS-based)</option>
                    <option value="USER_DRAWN">User Drawn (Approximate)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Method used to determine the land boundaries</p>
                  {errors.accuracyLevel && (
                    <p className="text-red-500 text-sm mt-2">{errors.accuracyLevel}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Parent Land ID (for subdivision)
                  </label>
                  <input
                    type="text"
                    name="parentLandId"
                    value={formValues.parentLandId}
                    onChange={handleChange}
                    placeholder="Enter parent land ID if subdividing"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">UUID of parent land if this is a subdivision</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white flex items-center gap-3">
              <FaFile className="text-2xl" />
              <h2 className="text-2xl font-bold">Upload Documents</h2>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <label htmlFor="file-upload" className="block text-sm font-bold text-slate-700 uppercase mb-3">
                  Upload Survey Documents <span className="text-red-500">*</span>
                </label>
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-amber-600 mt-1 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <strong>Required Documents:</strong>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Survey Plan:</strong> The official survey drawing showing boundaries, measurements, and coordinates</li>
                        <li><strong>Certificate of Occupancy:</strong> Government approval document (C of O)</li>
                        <li><strong>Surveyor's Report:</strong> Detailed report from the licensed surveyor</li>
                        <li><strong>Deed of Assignment:</strong> Legal transfer document</li>
                        <li><strong>Tax Clearance:</strong> Proof of property tax payment</li>
                      </ul>
                      <p className="mt-2 font-semibold">At minimum, you must upload the survey plan document containing the coordinates or bearings data you entered above.</p>
                    </div>
                  </div>
                </div>
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
                      <p className="text-slate-500 text-sm mt-1">PDF, PNG, JPG, DOC, DOCX (Max 10MB each)</p>
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

          {/* Land Verification Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white flex items-center gap-3">
              <FaCheckCircle className="text-2xl" />
              <h2 className="text-2xl font-bold">Land Verification</h2>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6">
                Before registering, please verify that your land boundaries don't overlap with existing registered properties. This helps prevent ownership conflicts.
              </p>
              <button
                type="button"
                onClick={handleVerifyLand}
                disabled={verifying}
                className="flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {verifying ? (
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
                    Verifying Land...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Verify Land Ownership
                  </>
                )}
              </button>

              {/* Verification Results */}
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-6 mb-6 ${
                    verificationResult.riskLevel === "SAFE"
                      ? "bg-green-50 border border-green-300"
                      : "bg-red-50 border border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-3xl ${verificationResult.riskLevel === "SAFE" ? "text-green-600" : "text-red-600"}`}>
                      {verificationResult.riskLevel === "SAFE" ? "✓" : "⚠"}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${verificationResult.riskLevel === "SAFE" ? "text-green-800" : "text-red-800"}`}>
                        {verificationResult.riskLevel === "SAFE"
                          ? "Land is Available for Registration"
                          : verificationResult.riskLevel === "GOVERNMENT"
                            ? "Government Land Detected"
                            : "Overlapping Property Detected"}
                      </h3>
                      <p className={verificationResult.riskLevel === "SAFE" ? "text-green-700" : "text-red-700"}>
                        {verificationResult.riskLevel === "SAFE"
                          ? "Your land boundaries don't overlap with any registered properties. You can proceed with registration."
                          : verificationResult.riskLevel === "GOVERNMENT"
                            ? "This land or parts of it belong to the government. You may need approval or further investigation."
                            : `Your land boundaries overlap with ${verificationResult.existingOwners?.length || 1} existing registered propert${verificationResult.existingOwners?.length !== 1 ? "ies" : "y"}. See details below.`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Existing Owner Details */}
              {verificationResult && verificationResult.riskLevel !== "SAFE" && verificationResult.existingOwners && verificationResult.existingOwners.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 rounded-lg p-6"
                >
                  <h4 className="text-lg font-bold text-slate-800 mb-4">
                    Overlapping Properties Details:
                  </h4>
                  <div className="space-y-4">
                    {verificationResult.existingOwners.map((owner: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          owner.ownershipType === "government"
                            ? "bg-red-50 border-l-red-500"
                            : "bg-orange-50 border-l-orange-500"
                        }`}
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-600">Owner Name</p>
                            <p className="text-slate-900 font-bold">{owner.ownerName || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-600">Ownership Type</p>
                            <p className={`font-bold ${owner.ownershipType === "government" ? "text-red-700" : "text-orange-700"}`}>
                              {owner.ownershipType === "government" ? "🏛️ Government" : "👤 Private"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-600">Email</p>
                            <p className="text-slate-900">{owner.email || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-600">Phone</p>
                            <p className="text-slate-900">{owner.phone || "Not provided"}</p>
                          </div>
                          {owner.titleType && (
                            <div>
                              <p className="text-sm font-semibold text-slate-600">Title Type</p>
                              <p className="text-slate-900">{owner.titleType}</p>
                            </div>
                          )}
                          {owner.landStatus && (
                            <div>
                              <p className="text-sm font-semibold text-slate-600">Status</p>
                              <p className="text-slate-900">{owner.landStatus}</p>
                            </div>
                          )}
                        </div>
                        {owner.purpose && (
                          <div className="mt-3 pt-3 border-t border-slate-300">
                            <p className="text-sm font-semibold text-slate-600">Land Purpose</p>
                            <p className="text-slate-900">{owner.purpose}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 mt-4 p-4 bg-slate-100 rounded">
                    💡 <strong>Tip:</strong> If you believe there's an error in the overlap detection or if you have permission from the overlapping owner, please contact support for manual review.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex gap-4 max-w-2xl"
          >
            <button
              type="submit"
              disabled={loading || !verificationResult || verificationResult.riskLevel !== "SAFE"}
              title={!verificationResult ? "Please verify the land first" : verificationResult.riskLevel !== "SAFE" ? "Cannot register: conflicts exist" : "Register land"}
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

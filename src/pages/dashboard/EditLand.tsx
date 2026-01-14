import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import * as authApi from "../../api/auth";

const EditLand = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const landData = (location.state as any)?.land;

  const [formValues, setFormValues] = useState({
    ownerName: "",
    longitude: 0,
    latitude: 0,
    totalSquareMeters: 0,
    ownershipType: "",
    purpose: "",
    titleType: "",
    state: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with land data
  useEffect(() => {
    if (landData) {
      setFormValues({
        ownerName: landData.ownerName || "",
        longitude: landData.longitude || 0,
        latitude: landData.latitude || 0,
        totalSquareMeters: landData.squareMeters || 0,
        ownershipType: landData.ownershipType || "",
        purpose: landData.purpose || "",
        titleType: landData.titleType || "",
        state: landData.stateId || "",
      });
      setExistingDocuments(landData.documents || []);
    }
  }, [landData]);

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
      e.target.value = "";
    }
  };

  // Remove New File
  const removeNewFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Remove Existing Document
  const removeExistingDocument = (docId: string) => {
    setExistingDocuments((prevDocs) =>
      prevDocs.filter((doc) => doc.id !== docId)
    );
  };

  // Validate Required Fields Before Submitting
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.ownerName) newErrors.ownerName = "Owner name is required.";
    if (!formValues.ownershipType)
      newErrors.ownershipType = "Ownership type is required.";
    if (!formValues.purpose) newErrors.purpose = "Purpose is required.";
    if (!formValues.titleType) newErrors.titleType = "Title type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData with only the fields accepted by the backend
      const formDataObj = new FormData();
      formDataObj.append("ownerName", formValues.ownerName);
      formDataObj.append("ownershipType", formValues.ownershipType);
      formDataObj.append("purpose", formValues.purpose);
      formDataObj.append("titleType", formValues.titleType);

      // Append new files only
      uploadedFiles.forEach((file) => {
        formDataObj.append("documents", file);
      });

      console.log("Updating land:", formDataObj);
      const response = await authApi.updateLand(id, formDataObj);
      console.log("Land update response:", response);
      successToast("Land details updated successfully!");
      navigate("/dashboard/list-of-registrations");
    } catch (error: any) {
      console.error("Land update error:", error);
      const errorMsg = getApiErrorMessage(error);
      errorToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="list-none flex items-center space-x-2 text-gray-600">
          <li>🏠 Home</li>
          <li>/</li>
          <li>
            <button
              onClick={() => navigate("/dashboard/list-of-registrations")}
              className="text-blue-600 font-semibold"
            >
              Land Management
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-800">Edit Land Details</li>
        </ol>
      </nav>

      {/* Form Title */}
      <h1 className="text-2xl font-bold mb-4">Edit Land Details</h1>
      <p className="text-gray-600 mb-6">
        Update land information here. Click save when you're done.
      </p>

      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Left Column */}
        <div>
          {[
            {
              label: "Owner Name",
              name: "ownerName",
              type: "text",
              placeholder: "Owner Name",
              disabled: false,
            },
            {
              label: "Latitude",
              name: "latitude",
              type: "number",
              placeholder: "Latitude",
              disabled: true,
            },
            {
              label: "Longitude",
              name: "longitude",
              type: "number",
              placeholder: "Longitude",
              disabled: true,
            },
            {
              label: "Total Square Meters",
              name: "totalSquareMeters",
              type: "number",
              placeholder: "Total Square Meters",
              disabled: true,
            },
          ].map(({ label, name, type, placeholder, disabled }) => (
            <div key={name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {label} {disabled && <span className="text-gray-500">(Read-only)</span>}
              </label>
              <input
                type={type}
                name={name}
                value={(formValues as any)[name]}
                onChange={handleChange}
                disabled={disabled}
                className={`border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500 ${
                  disabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder={placeholder}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Ownership Type */}
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Ownership Type
          </label>
          <select
            name="ownershipType"
            value={formValues.ownershipType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Ownership Type</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
          </select>
          {errors.ownershipType && (
            <p className="text-red-500 text-sm">{errors.ownershipType}</p>
          )}

          {/* Purpose */}
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Purpose
          </label>
          <select
            name="purpose"
            value={formValues.purpose}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Purpose</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Private Property Development">
              Private Property Development
            </option>
          </select>
          {errors.purpose && (
            <p className="text-red-500 text-sm">{errors.purpose}</p>
          )}

          {/* State */}
          <label className="block text-sm font-medium text-gray-700 mt-4">
            State <span className="text-gray-500">(Read-only)</span>
          </label>
          <select
            name="state"
            value={formValues.state}
            onChange={handleChange}
            disabled
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500 bg-gray-100 cursor-not-allowed"
          >
            <option value="">Select State</option>
            {states.map((state: any) => (
              <option key={state.id} value={state.id}>
                {state.name || state.stateName}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state}</p>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Title Type */}
          <label className="block text-sm font-medium text-gray-700">
            Title Type
          </label>
          <select
            name="titleType"
            value={formValues.titleType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Title Type</option>
            <option value="C of O">C of O</option>
            <option value="Right of Occupancy">Right of Occupancy</option>
            <option value="Governor's Consent">Governor's Consent</option>
          </select>
          {errors.titleType && (
            <p className="text-red-500 text-sm">{errors.titleType}</p>
          )}

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Current Documents ({existingDocuments.length})
              </h3>
              <ul className="space-y-2">
                {existingDocuments.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                  >
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1"
                    >
                      📄 {doc.fileName}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeExistingDocument(doc.id)}
                      className="ml-2 text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload New Documents */}
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Add New Documents
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">Formats: PDF, PNG, JPG</p>

          {/* New Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                New Documents ({uploadedFiles.length})
              </h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      📄 {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="col-span-1 md:col-span-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/list-of-registrations")}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
          >
            {loading && (
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
            )}
            {loading ? "Updating..." : "Update Land"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLand;

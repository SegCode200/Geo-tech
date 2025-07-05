import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: "",
    longitude: "",
    latitude: "",
    totalSquareMeters: "",
    ownershipType: "",
    purpose: "",
    titleType: "",
    uploadedDocuments: [] as File[], // Store actual file objects
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle File Upload
  const handleFileUpload = (e: any) => {
    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        uploadedDocuments: Array.from(e.target.files), // Store actual files
      }));
    }
  };

  // Validate Required Fields Before Submitting
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ownerName) newErrors.ownerName = "Owner name is required.";
    if (!formData.longitude) newErrors.longitude = "Longitude is required.";
    if (!formData.latitude) newErrors.latitude = "Latitude is required.";
    if (!formData.totalSquareMeters) newErrors.totalSquareMeters = "Total square meters is required.";
    if (!formData.ownershipType) newErrors.ownershipType = "Ownership type is required.";
    if (!formData.purpose) newErrors.purpose = "Purpose is required.";
    if (!formData.titleType) newErrors.titleType = "Title type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Form Submitted Successfully!", formData);
    alert("Land registration saved successfully!");

    // Navigate to the list page after submission
    navigate("/list-of-registrations");
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="list-none flex items-center space-x-2 text-gray-600">
          <li>🏠 Home</li>
          <li>/</li>
          <li>
            <button onClick={() => navigate("/list-of-registrations")} className="text-blue-600 font-semibold">
              Land Management
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-800">New Land Registration</li>
        </ol>
      </nav>

      {/* Form Title */}
      <h1 className="text-2xl font-bold mb-4">New Land Registration</h1>
      <p className="text-gray-600 mb-6">Register new land information here. Click save when you're done.</p>

      {/* Form */}
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Left Column */}
        <div>
          {[
            { label: "Owner Name", name: "ownerName", type: "text", placeholder: "Owner Name" },
            { label: "Longitude", name: "longitude", type: "text", placeholder: "Longitude" },
            { label: "Latitude", name: "latitude", type: "text", placeholder: "Latitude" },
            { label: "Total Square Meters", name: "totalSquareMeters", type: "number", placeholder: "Total Square Meters" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                placeholder={placeholder}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          {/* Ownership Type */}
          <label className="block text-sm font-medium text-gray-700">Ownership Type</label>
          <select
            name="ownershipType"
            value={formData.ownershipType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Ownership Type</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>
          {errors.ownershipType && <p className="text-red-500 text-sm">{errors.ownershipType}</p>}

          {/* Purpose */}
          <label className="block text-sm font-medium text-gray-700 mt-4">Purpose</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Purpose</option>
            <option value="agriculture">Agriculture</option>
            <option value="private-property-dev">Private Property Development</option>
          </select>
          {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose}</p>}
        </div>

        {/* Right Column */}
        <div>
          {/* Title Type */}
          <label className="block text-sm font-medium text-gray-700">Title Type</label>
          <select
            name="titleType"
            value={formData.titleType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Title Type</option>
            <option value="c-of-o">C of O</option>
            <option value="right-of-occupancy">Right of Occupancy</option>
            <option value="governors-consent">Governor's Consent</option>
          </select>
          {errors.titleType && <p className="text-red-500 text-sm">{errors.titleType}</p>}

          {/* File Upload */}
          <label className="block text-sm font-medium text-gray-700 mt-4">Upload Documents</label>
          <input type="file" multiple onChange={handleFileUpload} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500" />
          <p className="text-sm text-gray-500 mt-2">Formats: PDF, PNG, JPG</p>
        </div>
      </form>

      {/* Submit Button */}
      <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-green-600 transition duration-300">
        Save Land Registration
      </button>
    </div>
  );
};

export default LandRegistration;

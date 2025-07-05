import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";

const ApplyCOF = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    landId: "",
    titleType: "",
    uploadedDocuments: [],
  });

  const [message, setMessage] = useState("");

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = (e:any) => {
    if(e.target.files){
      const files = Array.from(e.target.files);
      setFormData((prevData:any) => ({
        ...prevData,
        uploadedDocuments: files.map((file:any) => file.name),
      }));
    }
  
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();

    // Simulating form validation
    if (!formData.ownerName || !formData.landId || !formData.titleType) {
      setMessage("Please fill all required fields.");
      return;
    }

    console.log("Application Submitted:", formData);
    setMessage("Your C of O application has been submitted!");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Apply for Certificate of Occupancy (C of O)</h1>

      {message && (
        <p className="mb-4 text-center text-white p-3 rounded-md bg-blue-500">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-md">
        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Owner Name"
            required
          />
        </div>

        {/* Land ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Land ID</label>
          <input
            type="text"
            name="landId"
            value={formData.landId}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Land ID"
            required
          />
        </div>

        {/* Title Type */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Title Type</label>
          <select
            name="titleType"
            value={formData.titleType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Title Type</option>
            <option value="c-of-o">C of O</option>
            <option value="right-of-occupancy">Right of Occupancy</option>
            <option value="governors-consent">Governor's Consent</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
          <input type="file" multiple onChange={handleFileUpload} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mt-8">
                <div className="flex items-center space-x-4">
                {formData.uploadedDocuments.map((file, index) => (
                // <li key={index}>{file}</li>
              <div>
                  <div className="w-24 h-24 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer" key={index}>
                <FaFileUpload className="h-6 w-6 text-gray-500" />
              </div>
                <p className="text-sm text-gray-500">{file}</p>
              </div>
              ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Formats: pdf, png, jpg</p>
              </div>

        <button
          type="submit"
          className="mt-6 bg-primary text-white px-4 py-2 rounded-md w-full hover:bg-blue-400 transition duration-300"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyCOF;

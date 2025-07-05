import React, { useState } from 'react';

const COFAApplicationEdit = () => {
  const [formData, setFormData] = useState({
    paymentReference: '',
    uploadedDocuments: [],
  });

  const [applicationDetails, setApplicationDetails] = useState({
    cofoId: 'COFO-12345',
    landRegistrationId: 'LAND-67890',
    ownerName: 'John Doe',
    status: 'Pending Level 1 Approval',
    lastUpdated: '2023-10-01',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      uploadedDocuments: files.map((file) => file.name),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('C of O Application Edit Data:', formData);
    alert('C of O application updated successfully!');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="list-none p-0 flex items-center">
          <li className="flex items-center">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              C of O Application
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Edit
            </a>
          </li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Edit C of O Application</h1>
      <p className="text-gray-600 mb-6">Update the details of this C of O application.</p>

      {/* Application Details Section */}
      <div className="bg-white shadow-md p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Application Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">C of O ID</p>
            <p className="text-gray-600">{applicationDetails.cofoId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Land Registration ID</p>
            <p className="text-gray-600">{applicationDetails.landRegistrationId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Owner Name</p>
            <p className="text-gray-600">{applicationDetails.ownerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Status</p>
            <p className={`text-sm font-bold ${applicationDetails.status.includes('Pending') ? 'text-yellow-600' : 'text-green-600'}`}>
              {applicationDetails.status}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="text-gray-600">{applicationDetails.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Edit Form Section */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Edit Application</h2>

        {/* Payment Reference */}
        <div className="mb-4">
          <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700">
            Payment Reference
          </label>
          <input
            type="text"
            id="paymentReference"
            name="paymentReference"
            value={formData.paymentReference}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Payment Reference"
          />
        </div>

        {/* Uploaded Documents */}
        <div className="mb-4">
          <label htmlFor="uploadedDocuments" className="block text-sm font-medium text-gray-700">
            Uploaded Documents
          </label>
          <input
            type="file"
            id="uploadedDocuments"
            name="uploadedDocuments"
            multiple
            onChange={handleFileUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-2">
            <p className="text-sm text-gray-500">Uploaded Files:</p>
            <ul className="list-disc pl-5">
              {formData.uploadedDocuments.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Application
        </button>
      </form>

      {/* Approval Workflow Status */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Approval Workflow Status</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Approver</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Level 1</td>
              <td className="border px-4 py-2">Jane Smith</td>
              <td className="border px-4 py-2">
                <span className="text-yellow-600 font-bold">Pending</span>
              </td>
              <td className="border px-4 py-2">2023-10-01</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Level 2</td>
              <td className="border px-4 py-2">Michael Johnson</td>
              <td className="border px-4 py-2">
                <span className="text-gray-500 font-bold">Not Started</span>
              </td>
              <td className="border px-4 py-2">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default COFAApplicationEdit;
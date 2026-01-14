import React, { useState } from 'react';

const UserManagement = () => {
  const [userType, setUserType] = useState('external'); // 'external' or 'internal'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    department: '',
    position: '',
    signatureRequired: false,
  });

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('User Management Data:', formData);
    alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} user created successfully!`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="list-none p-0 flex items-center">
          <li className="flex items-center">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              User Management
            </a>
          </li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">User Management</h1>
      <p className="text-gray-600 text-sm sm:text-base mb-6">Create and manage external/internal user accounts.</p>

      {/* User Type Selection */}
      <div className="mb-6">
        <label className="mr-4">
          <input
            type="radio"
            name="userType"
            value="external"
            checked={userType === 'external'}
            onChange={() => setUserType('external')}
            className="mr-2"
          />
          External User
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            value="internal"
            checked={userType === 'internal'}
            onChange={() => setUserType('internal')}
            className="mr-2"
          />
          Internal User
        </label>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {userType === 'external' && (
          <>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>
          </>
        )}

        {userType === 'internal' && (
          <>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter department"
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter position"
              />
            </div>
            <div>
              <label htmlFor="signatureRequired" className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="signatureRequired"
                  name="signatureRequired"
                  checked={formData.signatureRequired}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Signature Required?</span>
              </label>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default UserManagement;
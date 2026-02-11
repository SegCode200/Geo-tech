import { useState } from 'react';
import { FaUser, FaEnvelope, FaEdit, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserManagement = () => {
  // Mock user data - in real app this would come from auth context
  const [userData, setUserData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
  });

  const [formData, setFormData] = useState({
    fullName: userData.fullName,
    email: userData.email,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      fullName: userData.fullName,
      email: userData.email,
    });
    setIsEditing(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Profile Updated:', formData);
    setUserData(formData);
    setIsSubmitted(true);
    setIsEditing(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Profile</h1>
              <p className="text-slate-600 mt-1">Manage your personal information</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaUser size={24} />
              Profile Information
            </h2>
            <p className="text-blue-100 mt-2">Update your profile details</p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-blue-600" size={16} />
                    Full Name
                  </div>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-900'
                  }`}
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600" size={16} />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-900'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              {!isEditing ? (
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaEdit size={18} />
                  Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle size={18} />
                    Save Changes
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <FaTimes size={18} />
                    Cancel
                  </motion.button>
                </>
              )}
            </div>
          </form>
        </motion.div>

        {/* Success Message */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-green-100 p-4 rounded-full">
                  <FaCheckCircle className="text-green-600 text-4xl" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Success!</h3>
              <p className="text-slate-600 mb-4">Your profile has been updated successfully.</p>
              <p className="text-sm text-slate-500">
                <strong>{formData.fullName}</strong> ({formData.email})
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};


export default UserManagement;
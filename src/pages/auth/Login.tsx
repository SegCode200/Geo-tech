import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for password visibility
import { FcGoogle } from "react-icons/fc"
import { ImFacebook } from "react-icons/im"

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false, // State for "Remember me" checkbox
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-center text-xl font-bold mb-4">Welcome to</h2>
        <h1 className="text-center text-2xl font-bold mb-4">GeTech</h1>
        <p className="text-center text-gray-600 mb-6">Please log in your account.</p>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
          />
          <span
            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot Password?
          </a>
        </div>

        {/* Log In Button */}
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Log In
        </button>

        {/* Or Continue With */}
        <div className="mt-4 text-center text-gray-600">
          Or Continue With
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border  rounded shadow flex flex-row items-center justify-center"
          >
            <FcGoogle className="mr-2" /> Google
          </button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border  rounded shadow flex flex-row items-center justify-center"
          >
            <ImFacebook className="mr-2" color='blue' /> Facebook
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-4 text-center text-gray-600">
          New member here?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-800">
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
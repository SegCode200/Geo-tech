import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6">
          <button 
            className={`px-4 py-2 w-1/2 font-bold ${isLogin ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`px-4 py-2 w-1/2 font-bold ${!isLogin ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          {!isLogin && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="Full Name" className="pl-10 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-400" required />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input type="email" placeholder="Email" className="pl-10 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input type="password" placeholder="Password" className="pl-10 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </motion.form>

        {/* Switch to other form */}
        <p className="text-center mt-4 text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

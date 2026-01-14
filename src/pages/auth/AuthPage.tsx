import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaClock, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeTerms: false,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = { email: formData.email, password: formData.password };
      const res = await authApi.login(payload);
      // on success, backend returns user and sets cookie
      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload: authApi.RegisterPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      const res = await authApi.register(payload);
      setLoading(false);
      // show verification message and switch to login
      setIsLogin(true);
      setError(null);
      alert(res?.message || 'Registered. Please verify your email.');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Intro / Onboarding Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 sm:py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Welcome to Certificate of Occupancy Portal
            </h1>
            <p className="text-lg sm:text-xl text-emerald-50 max-w-2xl mx-auto">
              Register your land, apply for your Certificate of Occupancy, and manage property documents securely — all in one place.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center border border-emerald-400/30"
            >
              <FaClock className="text-4xl mb-3 mx-auto" />
              <h3 className="font-bold text-lg mb-2">Fast Process</h3>
              <p className="text-sm text-emerald-50">Register and apply in minutes with our streamlined process</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center border border-emerald-400/30"
            >
              <FaShieldAlt className="text-4xl mb-3 mx-auto" />
              <h3 className="font-bold text-lg mb-2">Secure & Safe</h3>
              <p className="text-sm text-emerald-50">Government-grade encryption protects your personal data</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center border border-emerald-400/30"
            >
              <FaMobileAlt className="text-4xl mb-3 mx-auto" />
              <h3 className="font-bold text-lg mb-2">Mobile Ready</h3>
              <p className="text-sm text-emerald-50">Access your account anytime, anywhere on any device</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center border border-emerald-400/30"
            >
              <FaCheckCircle className="text-4xl mb-3 mx-auto" />
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-sm text-emerald-50">Our dedicated team is always ready to help you</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Auth Forms Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="py-12 sm:py-16 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Tab Toggle */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  isLogin
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  !isLogin
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Content */}
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8"
            >
              {isLogin ? (
                // LOGIN FORM
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                  <p className="text-slate-600 mb-6">Sign in to access your C of O account</p>

                  <div className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div
                        className={`relative flex items-center transition-all ${
                          focusedField === 'email'
                            ? 'ring-2 ring-emerald-500 rounded-lg'
                            : 'border border-slate-300 rounded-lg'
                        }`}
                      >
                        <FaEnvelope className="absolute left-4 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Password
                      </label>
                      <div
                        className={`relative flex items-center transition-all ${
                          focusedField === 'password'
                            ? 'ring-2 ring-emerald-500 rounded-lg'
                            : 'border border-slate-300 rounded-lg'
                        }`}
                      >
                        <FaLock className="absolute left-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600"
                        />
                        <span className="text-sm text-slate-700">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Forgot Password?
                      </a>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                      type="button"
                    >
                      Sign In Securely
                    </motion.button>
                  </div>
                </div>
              ) : (
                // SIGNUP FORM
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
                  <p className="text-slate-600 mb-6">Join thousands managing C of O applications</p>

                  <div className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          First Name
                        </label>
                        <div
                          className={`relative flex items-center transition-all ${
                            focusedField === 'firstName'
                              ? 'ring-2 ring-emerald-500 rounded-lg'
                              : 'border border-slate-300 rounded-lg'
                          }`}
                        >
                          <FaUser className="absolute left-4 text-slate-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('firstName')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Last Name
                        </label>
                        <div
                          className={`relative flex items-center transition-all ${
                            focusedField === 'lastName'
                              ? 'ring-2 ring-emerald-500 rounded-lg'
                              : 'border border-slate-300 rounded-lg'
                          }`}
                        >
                          <FaUser className="absolute left-4 text-slate-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div
                        className={`relative flex items-center transition-all ${
                          focusedField === 'email'
                            ? 'ring-2 ring-emerald-500 rounded-lg'
                            : 'border border-slate-300 rounded-lg'
                        }`}
                      >
                        <FaEnvelope className="absolute left-4 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Password
                        </label>
                        <div
                          className={`relative flex items-center transition-all ${
                            focusedField === 'password'
                              ? 'ring-2 ring-emerald-500 rounded-lg'
                              : 'border border-slate-300 rounded-lg'
                          }`}
                        >
                          <FaLock className="absolute left-4 text-slate-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                            placeholder="Min 8 chars"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Confirm Password
                        </label>
                        <div
                          className={`relative flex items-center transition-all ${
                            focusedField === 'confirmPassword'
                              ? 'ring-2 ring-emerald-500 rounded-lg'
                              : 'border border-slate-300 rounded-lg'
                          }`}
                        >
                          <FaLock className="absolute left-4 text-slate-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                            placeholder="Re-enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 mt-1 flex-shrink-0"
                      />
                      <span className="text-sm text-slate-700">
                        I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Privacy Policy</a>
                      </span>
                    </label>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!formData.agreeTerms}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      Create Account
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Footer text */}
              <p className="text-center text-xs text-slate-500 mt-6">
                Your data is encrypted and secured with government-grade protection
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaPhone,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as authApi from "../../api/auth";
import { errorToast, successToast } from "../../utils/toast";
import { FaSpinner } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const schema = yup
    .object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      email: yup.string().required("Email is required").email("Invalid email"),
      phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
      password: yup
        .string()
        .required("Password is required")
        .min(8, "Minimum 8 characters"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Please confirm password"),
      agreeTerms: yup
        .bool()
        .oneOf([true], "You must accept the terms")
        .required(),
    })
    .required();

  type FormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setLoading(true);
    try {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      setLoading(false);
      successToast(
        "Registration successful. Please check your email to verify your account."
      );
      navigate("/auth/check-mail");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      errorToast(message);
      setLoading(false);
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4 sm:p-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-2xl bg-white">
          {/* Left Side - Benefits & Information */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 sm:p-12 text-white">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-2"
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <FaUser className="text-3xl text-emerald-50" />
                </div>
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>
              <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                Register with the Certificate of Occupancy Portal to manage your
                property registrations, applications, and documents securely.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-emerald-50">
                    Easy Property Registration
                  </p>
                  <p className="text-sm text-emerald-100">
                    Register your land and properties in minutes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-emerald-50">
                    Track Applications
                  </p>
                  <p className="text-sm text-emerald-100">
                    Monitor C of O application status in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-emerald-50">
                    Secure Documents
                  </p>
                  <p className="text-sm text-emerald-100">
                    Store and manage certificates digitally
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                  Get Started
                </h2>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Create Account
                </h1>
                <p className="text-slate-600">
                  Join thousands of property owners managing their C of O
                  applications
                </p>
              </div>

              {/* Name Fields */}
              <motion.div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      First Name
                    </label>
                    <div
                      className={`relative flex items-center transition-all duration-300 ${
                        focusedField === "firstName"
                          ? "ring-2 ring-emerald-500 rounded-lg"
                          : "border border-slate-300 rounded-lg"
                      }`}
                    >
                      <FaUser className="absolute left-4 text-slate-400" />
                      <input
                        {...register("firstName")}
                        id="firstName"
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                        placeholder="John"
                      />
                    </div>
                           {errors.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Last Name
                    </label>
                    <div
                      className={`relative flex items-center transition-all duration-300 ${
                        focusedField === "lastName"
                          ? "ring-2 ring-emerald-500 rounded-lg"
                          : "border border-slate-300 rounded-lg"
                      }`}
                    >
                      <FaUser className="absolute left-4 text-slate-400" />
                      <input
                        {...register("lastName")}
                        id="lastName"
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                        placeholder="Doe"
                      />
                    </div>
                         {errors.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div
                    className={`relative flex items-center transition-all duration-300 ${
                      focusedField === "email"
                        ? "ring-2 ring-emerald-500 rounded-lg"
                        : "border border-slate-300 rounded-lg"
                    }`}
                  >
                    <FaEnvelope className="absolute left-4 text-slate-400" />
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative flex items-center transition-all duration-300 border border-slate-300 rounded-lg">
                    <FaPhone className="absolute left-4 text-slate-400" />
                    <input
                      {...register("phone")}
                      id="phone"
                      className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                      placeholder="+1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Create Password
                    </label>
                    <div
                      className={`relative flex items-center transition-all duration-300 ${
                        focusedField === "password"
                          ? "ring-2 ring-emerald-500 rounded-lg"
                          : "border border-slate-300 rounded-lg"
                      }`}
                    >
                      <FaLock className="absolute left-4 text-slate-400" />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                        placeholder="Min 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div
                      className={`relative flex items-center transition-all duration-300 ${
                        focusedField === "confirmPassword"
                          ? "ring-2 ring-emerald-500 rounded-lg"
                          : "border border-slate-300 rounded-lg"
                      }`}
                    >
                      <FaLock className="absolute left-4 text-slate-400" />
                      <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      {...register("agreeTerms")}
                      type="checkbox"
                      name="agreeTerms"
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Privacy Policy
                      </a>
                      . I understand that my property data will be securely
                      stored and used to process my C of O application.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-red-600 mt-2">
                      {errors.agreeTerms.message}
                    </p>
                  )}
                </div>

                {/* Create Account Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit(onSubmit)} 
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>

                {error && (
                  <div className="text-sm text-red-600 text-center mt-2">
                    {error}
                  </div>
                )}
              </motion.div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <a
                href="/auth/login"
                className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Sign In Instead
              </a>

              {/* Help Text */}
              <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
                We'll never share your personal information. Your data is
                encrypted and secured with government-grade protection.{" "}
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Learn more about data security
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-slate-300 text-sm">
            Have questions? Contact our registration support at{" "}
            <a
              href="mailto:register@geoctech.gov"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              register@geoctech.gov
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;

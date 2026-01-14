import { useState, useEffect } from "react";
import {
  FaLock,
  FaCheckCircle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as authApi from "../../api/auth";
import { successToast, errorToast } from "../../utils/toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid or missing reset token. Please request a new reset link.");
    }
  }, [token]);

  const schema = yup
    .object({
      newPassword: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase, and numbers"
        ),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm password"),
    })
    .required();

  type FormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormValues) => {
    if (loading || submitted || !token) return;
    setError(null);
    setLoading(true);
    setSubmitted(true);
    try {
      await authApi.resetPassword(token, data.newPassword);
      successToast(
        "Password reset successfully! You can now sign in with your new password."
      );
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to reset password. Please try again.";
      errorToast(message);
      setError(message);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-3xl text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-slate-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new reset link to continue.
            </p>
            <button
              onClick={() => navigate("/auth/forgot-password")}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Request New Reset Link
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-2xl bg-white">
          {/* Left Side - Branding & Information */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 sm:p-12 text-white">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-2"
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <FaLock className="text-3xl text-emerald-50" />
                </div>
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">Create a New Password</h1>
              <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                Choose a strong password to secure your GeoTech account. Make
                sure it's unique and different from your previous password.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">
                  Use a strong, unique password
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">
                  Must contain uppercase, lowercase, and numbers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">
                  Your account will be immediately secured
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Password Form */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                  Create New Password
                </h2>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Reset Password
                </h1>
                <p className="text-slate-600">
                  Enter a strong password to secure your account
                </p>
              </div>

              {/* New Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  New Password
                </label>
                <div
                  className={`relative flex items-center transition-all duration-300 ${
                    focusedField === "newPassword"
                      ? "ring-2 ring-emerald-500 rounded-lg"
                      : "border border-slate-300 rounded-lg"
                  }`}
                >
                  <FaLock className="absolute left-4 text-slate-400" />
                  <input
                    {...register("newPassword")}
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    onFocus={() => setFocusedField("newPassword")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  At least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
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
                    placeholder="Confirm password"
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

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mb-4"
                type="submit"
                disabled={loading || submitted}
                onClick={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Resetting password…
                  </span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>

              {error && (
                <div className="text-sm text-red-600 text-center mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Help Text */}
              <p className="text-xs text-slate-500 text-center mt-6">
                By resetting your password, you agree to our{" "}
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
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@geoctech.gov"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              support@geoctech.gov
            </a>{" "}
            or call{" "}
            <a
              href="tel:+1234567890"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              1-234-567-890
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

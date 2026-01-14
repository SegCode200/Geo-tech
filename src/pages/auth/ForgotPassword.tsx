import { useState } from "react";
import {
  FaLock,
  FaEnvelope,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as authApi from "../../api/auth";
import { successToast, errorToast } from "../../utils/toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const schema = yup
    .object({
      email: yup.string().required("Email is required").email("Invalid email"),
    })
    .required();

  type FormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    if (loading || submitted) return;
    setError(null);
    setLoading(true);
    setSubmitted(true);
    try {
      await authApi.requestPasswordReset(data.email);
      successToast(
        "Password reset link has been sent to your email. Please check your inbox."
      );
      navigate("/auth/check-mail");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send reset link. Please try again.";
      errorToast(message);
      setError(message);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
              <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                Forgot your password? No worries! Enter your email address and
                we'll send you a secure link to reset your password in just a
                few minutes.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">
                  Secure password reset link
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">
                  Link expires in 30 minutes for security
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">
                  Your account remains secure
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Forgot Password Form */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                  Account Recovery
                </h2>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-slate-600">
                  Don't worry, we'll help you recover your account
                </p>
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
                    id="email"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Submit Button */}
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
                    Sending reset link…
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>

              {error && (
                <div className="text-sm text-red-600 text-center mt-2">
                  {error}
                </div>
              )}

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    Remember your password?
                  </span>
                </div>
              </div>

              {/* Back to Login */}
              <button
                onClick={() => navigate("/auth/login")}
                className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="text-sm" />
                Back to Sign In
              </button>

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

export default ForgotPassword;

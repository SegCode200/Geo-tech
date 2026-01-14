import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import * as authApi from '../../api/auth';
import { errorToast, successToast } from '../../utils/toast';

const DirectToMail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  // Cooldown timer for resend button
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email) {
      errorToast('Email address not found. Please register again.');
      return;
    }

    setResendLoading(true);
    setMessage(null);
    try {
      await authApi.resendVerificationEmail(email);
      successToast('Verification email resent successfully!');
      setMessage('Verification email has been sent to your inbox.');
      setResendCooldown(60); // 60 second cooldown
    } catch (err: any) {
      const message =
        err?.message || 'Failed to resend verification email. Please try again.';
      errorToast(message);
    } finally {
      setResendLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-3xl text-emerald-600" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Check Your Email
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We've sent a verification link to{' '}
              <span className="font-semibold text-emerald-600">{email}</span>
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded mb-6">
              <p className="text-sm text-emerald-900 leading-relaxed">
                <strong>Instructions:</strong> Click the verification link in the email
                to activate your account. The link expires in 30 minutes.
              </p>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-6 text-sm"
              >
                {message}
              </motion.div>
            )}

            {/* Resend button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResendEmail}
              disabled={resendLoading || resendCooldown > 0}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resendLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                <>Resend in {resendCooldown}s</>
              ) : (
                'Resend Verification Email'
              )}
            </motion.button>

            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResendEmail}
                disabled={resendCooldown > 0}
                className="text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
              >
                request a new one
              </button>
            </p>
          </motion.div>

          {/* Back button */}
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate('/auth/login')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mt-8 pt-6 border-t border-slate-200"
          >
            <FaArrowLeft className="text-sm" />
            Back to Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DirectToMail;
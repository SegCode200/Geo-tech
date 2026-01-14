import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import * as authApi from '../../api/auth';
import { errorToast, successToast } from '../../utils/toast';

type VerificationStatus = 'loading' | 'success' | 'error' | 'invalid';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
    const hasRun = useRef(false);

  useEffect(() => {
         if (hasRun.current) return; // <-- stops second execution
    hasRun.current = true;
    const verifyTokenFromUrl = async () => {
      try {
        const token = searchParams.get('token');
        const emailParam = searchParams.get('email');

        if (!token || !emailParam) {
          setStatus('invalid');
          setMessage('Invalid verification link. Missing token or email.');
          return;
        }

        setEmail(emailParam);

        // Call the verify endpoint
        const response = await authApi.verifyEmail(emailParam, token);
        
        setStatus('success');
        setMessage(response?.message || 'Email verified successfully!');
        successToast('Email verified successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        const errorMessage =
          err?.message || 'Verification failed. The link may have expired.';
        setMessage(errorMessage);
        errorToast(errorMessage);
      }
    };

    verifyTokenFromUrl();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
                  <FaSpinner className="text-3xl text-emerald-600 animate-spin" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Verifying Email
                </h1>
                <p className="text-slate-600 mb-4">
                  Please wait while we verify your email address...
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-3xl text-emerald-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Email Verified!
                </h1>
                <p className="text-slate-600 mb-2">
                  Your email has been successfully verified.
                </p>
                <p className="text-sm text-emerald-600 font-semibold mb-6">
                  {email}
                </p>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-emerald-900">
                    You can now log in to your account with your credentials.
                  </p>
                </div>

                <p className="text-xs text-slate-500 mb-6">
                  Redirecting to login page in 3 seconds...
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/login')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Go to Login Now
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                  <FaTimesCircle className="text-3xl text-red-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Verification Failed
                </h1>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-red-900">
                    <strong>Error:</strong> {message}
                  </p>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  The verification link may have expired or is invalid. Please request
                  a new verification email.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/check-mail')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                >
                  Request New Verification Link
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/login')}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Go to Login
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Invalid State */}
          {status === 'invalid' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center">
                  <FaTimesCircle className="text-3xl text-yellow-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Invalid Link
                </h1>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-yellow-900">
                    {message}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/register')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                >
                  Register Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/login')}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Go to Login
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Back button - always visible */}
          {status !== 'loading' && status !== 'success' && (
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate('/auth/login')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mt-8 pt-6 border-t border-slate-200"
            >
              <FaArrowLeft className="text-sm" />
              Back to Login
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
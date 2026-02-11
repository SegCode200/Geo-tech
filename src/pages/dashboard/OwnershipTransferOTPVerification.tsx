import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaShieldAlt,
  FaRedo,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { verifyTransferOTP, getTransferProgress, resendTransferOTP, TransferProgressResponse } from "../../api/ownershipTransfer";
import { successToast, errorToast } from "../../utils/toast";

interface Verification {
  target: string;
  channelType: "email" | "phone";
  isVerified: boolean;
}

export const OwnershipTransferOTPVerification = () => {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loadingTransfer, setLoadingTransfer] = useState(true);
  const [verifyingCodes, setVerifyingCodes] = useState<Record<string, boolean>>({});
  const [resendingCodes, setResendingCodes] = useState<Record<string, boolean>>({});
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [otpCodes, setOtpCodes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [progress, setProgress] = useState<TransferProgressResponse | null>(null);
        // console.log(verifications)
  useEffect(() => {
    if (transferId) {
      loadTransferProgress();
    }
  }, [transferId]);

  // Cooldown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = Math.max(0, updated[key] - 1);
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadTransferProgress = async () => {
    try {
      setLoadingTransfer(true);
      const data = await getTransferProgress(transferId!);
      setProgress(data);
      console.log(data);

      // Try to extract verification targets from the VERIFICATION stage details
      const verificationStage = data.stages.find((s) => s.stage === "VERIFICATION");
      const details: any = verificationStage?.details || {};

      console.log(verificationStage)

      // If the backend returns explicit targets (e.g. details.targets = [{target, channelType, isVerified}])
      if (details && Array.isArray(details.targets) && details.targets.length > 0) {
        setVerifications(
          details.targets.map((t: any) => ({
            target: t.target || String(t),
            channelType: t.channelType === "phone" ? "phone" : "email",
            isVerified: !!t.isVerified,
          }))
        );
      } else {
        // No explicit targets returned — ensure verifications is empty so we show a helpful message
        setVerifications([]);
      }
    } catch (error: any) {
      console.error("Error loading transfer:", error);
      errorToast("Failed to load transfer details");
    } finally {
      setLoadingTransfer(false);
    }
  };

  const handleOTPChange = (target: string, code: string) => {
    setOtpCodes((prev) => ({
      ...prev,
      [target]: code.replace(/\D/g, "").slice(0, 6), // Only digits, max 6
    }));
  };

  const handleVerifyCode = async (target: string, code: string) => {
    if (!code || code.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      setMessageType("error");
      return;
    }

    try {
      setVerifyingCodes((prev) => ({ ...prev, [target]: true }));
      setMessage("");

      const result = await verifyTransferOTP({
        transferId: transferId!,
        target,
        code,
      });

      setMessage("Code verified successfully!");
      setMessageType("success");

      // Update verification status
      setVerifications((prev) =>
        prev.map((v) =>
          v.target === target ? { ...v, isVerified: true } : v
        )
      );

      setOtpCodes((prev) => {
        const newCodes = { ...prev };
        delete newCodes[target];
        return newCodes;
      });

      // If all verified, show success and navigate
      if (result.allPartiesVerified) {
        setTimeout(() => {
          successToast("All parties verified! Proceed to submit documents.");
          navigate(`/dashboard/ownership-transfer/${transferId}/documents`);
        }, 1500);
      }

      // Reload progress
      await loadTransferProgress();
    } catch (error: any) {
      setMessage(error.message || "Failed to verify code");
      setMessageType("error");
    } finally {
      setVerifyingCodes((prev) => ({ ...prev, [target]: false }));
    }
  };

  const handleResendCode = async (target: string) => {
    try {
      setResendingCodes((prev) => ({ ...prev, [target]: true }));
      setMessage("");

      await resendTransferOTP(transferId!, target);

      // Set 60-second cooldown
      setCooldowns((prev) => ({ ...prev, [target]: 60 }));

      setMessage(`New code sent to ${target}`);
      setMessageType("success");

      // Clear the previous OTP code input
      setOtpCodes((prev) => {
        const newCodes = { ...prev };
        delete newCodes[target];
        return newCodes;
      });
    } catch (error: any) {
      const errorMsg = error.message || "Failed to resend code";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setResendingCodes((prev) => ({ ...prev, [target]: false }));
    }
  };

  if (loadingTransfer) {
    return (
      <motion.div className="space-y-6 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="text-4xl text-purple-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-600">Loading transfer details...</p>
        </div>
      </motion.div>
    );
  }

  const allVerified = verifications.every((v) => v.isVerified);
  // console.log(verifications)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaShieldAlt className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">Verify Ownership Transfer</h1>
        </div>
        <p className="text-blue-50">
          Verification codes have been sent to the provided email addresses and phone numbers. Please enter the codes to verify your identity.
        </p>
      </motion.div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 border-l-4 ${
            messageType === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          {messageType === "success" ? (
            <FaCheckCircle className="text-xl flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="text-xl flex-shrink-0" />
          )}
          <p className="font-semibold">{message}</p>
        </motion.div>
      )}

      {/* Progress Info */}
      {progress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-blue-600" /> Transfer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Land Location</p>
              <p className="text-gray-900 mt-1">{progress.landDetails.address}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Land Size</p>
              <p className="text-gray-900 mt-1">{progress.landDetails.size}m²</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Current Status</p>
              <p className="text-gray-900 mt-1 font-semibold">{progress.currentStatus.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Expires At</p>
              <p className="text-gray-900 mt-1">{new Date(progress.timestamps.expiresAt).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Verification Forms */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Verification Codes</h2>

        {verifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center"
          >
            <p className="text-gray-800 font-semibold mb-2">No verification targets available</p>
            <p className="text-gray-600 mb-4">The transfer does not expose verification targets (emails/phones) yet. If you expected to receive codes, try reloading or contact support.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => loadTransferProgress()}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Reload
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification, index) => (
              <motion.div
                key={verification.target}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
                  verification.isVerified
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {verification.channelType === "email" ? (
                    <FaEnvelope className="text-blue-600 text-lg" />
                  ) : (
                    <FaPhone className="text-green-600 text-lg" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-semibold uppercase">
                      {verification.channelType}
                    </p>
                    <p className="text-gray-900 font-semibold">{verification.target}</p>
                  </div>
                  {verification.isVerified && (
                    <FaCheckCircle className="text-green-600 text-2xl flex-shrink-0" />
                  )}
                </div>

                {!verification.isVerified && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter 6-digit code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCodes[verification.target] || ""}
                        onChange={(e) =>
                          handleOTPChange(verification.target, e.target.value)
                        }
                        placeholder="000000"
                        className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          handleVerifyCode(
                            verification.target,
                            otpCodes[verification.target] || ""
                          )
                        }
                        disabled={
                          verifyingCodes[verification.target] ||
                          !otpCodes[verification.target] ||
                          otpCodes[verification.target].length !== 6
                        }
                        className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {verifyingCodes[verification.target] ? (
                          <>
                            <FaSpinner className="animate-spin" /> Verifying...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> Verify
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleResendCode(verification.target)}
                        disabled={
                          resendingCodes[verification.target] ||
                          (cooldowns[verification.target] || 0) > 0
                        }
                        className="py-2 px-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {resendingCodes[verification.target] ? (
                          <>
                            <FaSpinner className="animate-spin" /> Sending...
                          </>
                        ) : (cooldowns[verification.target] || 0) > 0 ? (
                          <>
                            <FaClock /> {cooldowns[verification.target]}s
                          </>
                        ) : (
                          <>
                            <FaRedo /> Resend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {verification.isVerified && (
                  <div className="text-green-700 font-semibold text-sm">
                    ✓ Successfully verified
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Proceed Button */}
      {allVerified && verifications.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/dashboard/ownership-transfer/${transferId}/documents`)}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <FaArrowRight /> Proceed to Document Submission
        </motion.button>
      )}

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(-1)}
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
      >
        Go Back
      </motion.button>
    </motion.div>
  );
};

export default OwnershipTransferOTPVerification;

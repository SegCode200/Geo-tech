import { useState } from "react";
import {
  FaMapMarkedAlt,
  FaUpload,
  FaMoneyCheckAlt,
  FaCheckCircle,
} from "react-icons/fa";
import SelectLandStep from "./steps/SelectLandStep";
import UploadDocsStep from "./steps/UploadDocsStep";
import ReviewAndPayStep from "./steps/ReviewAndPayStep";
import SuccessStep from "./steps/SuccessStep";

const steps = [
  { label: "Select Land", icon: FaMapMarkedAlt, description: "Choose your registered land" },
  { label: "Upload Documents", icon: FaUpload, description: "Submit required documents" },
  { label: "Review & Payment", icon: FaMoneyCheckAlt, description: "Review and complete payment" },
  { label: "Completed", icon: FaCheckCircle, description: "Application submitted" },
];

interface DocumentFile {
  id: string;
  file: File;
  name: string;
  type:string;
}

const ApplyCofO = () => {
  const [step, setStep] = useState(0);
  const [landId, setLandId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Record<string, DocumentFile[]>>({});
  const [reference, setReference] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - Government Style */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <FaMapMarkedAlt className="text-white text-xl" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Certificate of Occupancy Application
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Follow the steps below to submit your Certificate of Occupancy application
            through the Federal Land Registry System
          </p>
        </div>

        {/* Modern Stepper */}
        <div className="mb-12">
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="relative z-10 flex justify-between">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = i <= step;
                const isCurrentStep = i === step;

                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => i < step && setStep(i)}
                      disabled={i > step}
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all transform ${
                        isCurrentStep
                          ? "ring-4 ring-emerald-200 scale-110 bg-emerald-600 text-white shadow-lg"
                          : active
                          ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:scale-105"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Icon size={20} />
                    </button>
                    <div className="text-center">
                      <p
                        className={`text-sm font-semibold ${
                          isCurrentStep
                            ? "text-emerald-700"
                            : active
                            ? "text-slate-700"
                            : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 hidden md:block">
                        {s.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Card - Government Standard */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 md:p-12">
          {step === 0 && (
            <SelectLandStep
              onNext={(id) => {
                setLandId(id);
                setStep(1);
              }}
            />
          )}

          {step === 1 && (
            <UploadDocsStep
              onBack={() => setStep(0)}
              onNext={(files: Record<string, DocumentFile[]>) => {
                setDocuments(files);
                setStep(2);
              }}
            />
          )}

          {step === 2 && landId && (
            <ReviewAndPayStep
              landId={landId}
              documents={documents}
              onBack={() => setStep(1)}
              onSuccess={(ref: any) => {
                setReference(ref);
                setStep(3);
              }}
            />
          )}

          {step === 3 && reference && <SuccessStep reference={reference} amount={5000} />}
        </div>

        {/* Footer Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Processing Fee
                </h3>
                <p className="text-sm text-slate-600">
                  ₦5,000 one-time payment
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <FaUpload className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Document Requirements
                </h3>
                <p className="text-sm text-slate-600">
                  7 required documents needed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FaMoneyCheckAlt className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Secure Payment
                </h3>
                <p className="text-sm text-slate-600">
                  Powered by Paystack
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyCofO;

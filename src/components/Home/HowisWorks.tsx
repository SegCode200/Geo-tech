export function TrustBar() {
  return (
    <section className="bg-black py-6">
      <p className="text-center text-xs tracking-wide text-gray-300">
        OFFICIAL FEDERAL GOVERNMENT PLATFORM — MINISTRY OF WORKS & HOUSING ·
        LAND REGISTRIES · SURVEYOR GENERAL
      </p>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold">
        How the Certificate of Occupancy (C of O) Process Works
      </h2>
      <p className="mt-3 text-gray-600 max-w-2xl">
        Geo Tech streamlines the Federal Government C of O process using secure
        digital workflows, document validation, and multi-level approvals.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <Step
          icon="upload"
          title="Online Application"
          description="Applicants submit land details and required documents securely through the Geo Tech portal."
          image="https://images.unsplash.com/photo-1581090700227-1e37b190418e"
          step={1}
        />
        <Step
          icon="shield"
          title="Document Verification"
          description="Uploaded documents undergo automated and manual verification to prevent fraud and errors."
          image="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
          step={2}
        />
        <Step
          icon="layers"
          title="Multi-Level Approval"
          description="Applications move through authorized government officers and approving authorities."
          image="https://images.unsplash.com/photo-1521791136064-7986c2920216"
          step={3}
        />
        <Step
          icon="award"
          title="C of O Issuance"
          description="Once approved, the Certificate of Occupancy is issued and made available to the applicant."
          image="https://images.unsplash.com/photo-1605792657660-596af9009e82"
          step={4}
        />
      </div>
    </section>
  );
}

import { FiUploadCloud, FiShield, FiLayers, FiAward } from "react-icons/fi";

function Step({ icon, title, description, image, step }: any) {
  const icons: any = {
    upload: <FiUploadCloud size={28} />,
    shield: <FiShield size={28} />,
    layers: <FiLayers size={28} />,
    award: <FiAward size={28} />,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
            {icons[icon]}
          </span>
          <span className="text-green-700 font-bold">Step {step}</span>
        </div>
        <h4 className="mt-4 font-semibold">{title}</h4>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

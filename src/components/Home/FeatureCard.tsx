import { motion } from "framer-motion";
import { FiGlobe, FiLock, FiEye, FiAlertTriangle } from "react-icons/fi";

export function Features() {
  const features = [
    {
      icon: <FiGlobe size={28} />,
      title: "Nationwide Validity",
      desc: "Certificates issued through Geo Tech are recognized across the 36 states and the FCT.",
    },
    {
      icon: <FiLock size={28} />,
      title: "Secure Payments",
      desc: "All payments are processed through secure, government-approved payment gateways.",
    },
    {
      icon: <FiEye size={28} />,
      title: "Real-Time Tracking",
      desc: "Applicants can track each approval stage transparently from submission to issuance.",
    },
    {
      icon: <FiAlertTriangle size={28} />,
      title: "Fraud Prevention",
      desc: "Built-in document validation and audit logs help eliminate forged or duplicate land records.",
    },
  ];

  return (
    <section id="requirements" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold">Why Use the Federal C of O Portal</h2>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Geo Tech provides a trusted, transparent, and federally approved system for managing Certificate of Occupancy applications nationwide.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white">
                {f.icon}
              </div>
              <h4 className="mt-5 font-semibold">{f.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
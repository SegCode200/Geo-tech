import { Link } from "react-router-dom";
export function News() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold">Land & Property Announcements</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-500">Federal Notice</p>
              <h4 className="font-semibold">Digitization of Land Records</h4>
              <p className="mt-2 text-sm text-gray-600">Improved timelines and reduced manual intervention.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ================================
// CTA.tsx
// ================================
export function CTA() {
  return (
    <section className="bg-black py-14">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white">
          <h3 className="text-xl font-bold">Ready to Secure Your Land Ownership?</h3>
          <p className="text-sm text-gray-300">Apply for your Certificate of Occupancy (C of O) today.</p>
        </div>
        <Link to="/auth/register" className="bg-green-700 px-6 py-3 text-white rounded-md">
          Apply Now
        </Link>
      </div>
    </section>
  );
}
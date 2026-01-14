import { Link } from "react-router-dom";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}
export function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Geo Tech – Federal Land Documentation & Certificate of Occupancy Platform
          </h1>
          <p className="mt-3 text-lg font-medium text-gray-700">
            Apply, Register & Secure Land Ownership in Nigeria
          </p>
          <p className="mt-4 text-gray-600 max-w-xl">
            Geo Tech is the official Federal Government digital platform for land documentation, verification, and Certificate of Occupancy (C of O) processing across the 36 states and the FCT.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              className="w-full sm:w-96 rounded-md border px-4 py-3 focus:ring-2 focus:ring-green-700"
              placeholder="Enter property address or plot number"
            />
            <Link
              to="/auth/register"
              className="rounded-md bg-green-700 px-6 py-3 text-white text-center"
            >
              Track Status
            </Link>
          </div>

          <div className="mt-10 flex gap-10 text-sm">
            <Stat label="Processed Applications" value="250,000+" />
            <Stat label="Government Offices" value="36 States + FCT" />
            <Stat label="Approval Transparency" value="100%" />
          </div>
        </div>

        <div className="overflow-hidden rounded-t-full rounded-b-lg shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
            alt="Land property"
            className="h-[420px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

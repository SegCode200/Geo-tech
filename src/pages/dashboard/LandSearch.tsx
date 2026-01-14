import { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useLandSearch } from "../../hooks/useHooks";

const LandSearch = () => {
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const lon = submitted ? parseFloat(longitude) : undefined;
  const lat = submitted ? parseFloat(latitude) : undefined;


  console.log(lon)
  console.log(lat)

  const { data, error, isLoading } = useLandSearch(lon, lat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(Number(longitude)) || isNaN(Number(latitude))) {
      alert("Invalid coordinates");
      return;
    }

    setSubmitted(true);
  };
  console.log(data)

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">
        Check Land Availability
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">
            Longitude
          </label>
          <input
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="3.3792"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Latitude
          </label>
          <input
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="6.5244"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Check Land
        </button>
      </form>

      {/* RESULTS */}
      {submitted && (
        <div className="mt-6">
          {isLoading && <p>Checking land records...</p>}

          {error && (
            <p className="text-red-600">
              Failed to check land
            </p>
          )}

          {data && (
            <div className="bg-gray-50 p-5 rounded-lg border">
              {data.exists ? (
                <>
                  <h2 className="text-red-600 font-semibold flex items-center gap-2">
                    <FaExclamationTriangle />
                    Land Already Registered
                  </h2>

                  <ul className="mt-4 space-y-3">
                    {data.lands.map((land: any) => (
                      <li
                        key={land.id}
                        className="bg-white border p-3 rounded"
                      >
                        <p className="font-semibold">
                          {land.ownerName}
                        </p>
                        <p className="text-sm">
                          Purpose: {(land.purpose).toUpperCase()}
                        </p>
                        <p className="text-sm">
                          Ownership Type: {(land.ownershipType).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Distance:{" "}
                          {Math.round(land.squareMeters)} sqm
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-green-600 flex items-center gap-2">
                  <FaCheckCircle />
                  No land record found. You may proceed.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandSearch;

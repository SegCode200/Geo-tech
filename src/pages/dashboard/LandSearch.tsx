import React, { useState } from "react";

interface SearchData {
  longitude: string;
  latitude: string;
}

const LandSearch: React.FC = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    longitude: "",
    latitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate Longitude and Latitude
    const lon = parseFloat(searchData.longitude);
    const lat = parseFloat(searchData.latitude);
    if (isNaN(lon) || isNaN(lat)) {
      setError("Please enter valid longitude and latitude values.");
      return;
    }

    setLoading(true);

    try {
      // Placeholder API call (Replace with actual API request)
      const response = await fetch(
        `https://your-api.com/land-search?longitude=${lon}&latitude=${lat}`
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch land details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Land Search</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={searchData.longitude}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter longitude"
          />
        </div>
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={searchData.latitude}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter latitude"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Display Search Results */}
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Search Results:</h2>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LandSearch;

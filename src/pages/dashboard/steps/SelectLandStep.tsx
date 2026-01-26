import { useGetUserLands } from "../../../hooks/useHooks";
import { FaMapMarkedAlt, FaCheck } from "react-icons/fa";
import { useState } from "react";

const SelectLandStep = ({ onNext }: { onNext: (id: string) => void }) => {
  const { data, error, isLoading } = useGetUserLands();
  const allLands = data?.lands || [];
  // Filter only approved lands
  const cofaRecords = allLands.filter((land: any) => land.landStatus?.toLowerCase() === "approved");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-slate-600">Loading your registered lands...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading lands. Please try again.</p>
      </div>
    );

  if (allLands.length === 0)
    return (
      <div className="text-center py-12">
        <FaMapMarkedAlt className="text-6xl text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600">
          You have no registered lands yet. Register a land first.
        </p>
      </div>
    );

  if (cofaRecords.length === 0)
    return (
      <div className="text-center py-12">
        <FaMapMarkedAlt className="text-6xl text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600">
          You have no approved lands yet. Your registered lands are still pending approval or have been rejected.
        </p>
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Select Your Land
        </h2>
        <p className="text-slate-600">
          Choose an approved land for which you want to apply for Certificate of
          Occupancy
        </p>
      </div>

      <div className="space-y-4">
        {cofaRecords.map((land: any) => (
          <button
            key={land.id}
            onClick={() => setSelectedId(land.id)}
            className={`w-full text-left border-2 p-5 rounded-lg transition-all ${
              selectedId === land.id
                ? "border-emerald-600 bg-emerald-50 shadow-md"
                : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FaMapMarkedAlt className="text-emerald-600" />
                  <p className="font-bold text-slate-900">
                    Land ID: {land?.id.slice(0, 8).toUpperCase()}
                  </p>
                  <span className="ml-auto px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                    {land.landStatus}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{land.ownerName}</p>
                <div>
                  <p className="text-slate-500 text-xs font-medium">
                    LAND SIZE
                  </p>
                  <p className="font-semibold text-slate-800">
                    {land.squareMeters} sqm
                  </p>
                </div>
                {land.location && (
                  <div>
                    <p className="text-slate-500 text-xs font-medium">
                      LOCATION
                    </p>
                    <p className="text-slate-700">{land.location}</p>
                  </div>
                )}
              </div>

              {selectedId === land.id && (
                <div className="flex-shrink-0 ml-4">
                  <div className="bg-emerald-600 text-white rounded-full p-2">
                    <FaCheck />
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    

      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end">
        <button
          disabled={!selectedId}
          onClick={() => selectedId && onNext(selectedId)}
          className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${
            selectedId
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectLandStep;

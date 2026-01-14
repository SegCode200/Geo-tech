import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserLands } from "../../hooks/useHooks";
import { errorToast, successToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import * as authApi from "../../api/auth";

const COFAList = () => {
  const navigate = useNavigate();
  const {data, error, isLoading, refetch} = useGetUserLands()
  const cofaRecords = data?.lands || [];
  const [selectedLand, setSelectedLand] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  console.log(cofaRecords)

  const handleDeleteLand = async (landId: string) => {
    setDeleting(true);
    try {
      await authApi.deleteLand(landId);
      successToast("Land deleted successfully!");
      setDeleteConfirm(null);
      refetch?.();
    } catch (error: any) {
      const errorMsg = getApiErrorMessage(error);
      errorToast(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading land registrations…</div>;
  }
  if (error) {
    return <div className="p-6">Error loading land registrations.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="list-none flex items-center space-x-2 text-gray-600">
          <li>🏠 Home</li>
          <li>/</li>
          <li className="text-blue-600 font-semibold">Land Registration</li>
        </ol>
      </nav>

      {/* Title and "New Land Registration" Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Land Registration</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate("/dashboard/land-registration")}
        >
          + New Land Registration
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md">📆 All time</span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md">⏳ Status: Pending</span>
        </div>
        <input
          type="text"
          placeholder="🔍 Search..."
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table - Mobile Responsive */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Owner Name</th>
                <th className="px-4 py-3">Ownership Type</th>
                <th className="px-4 py-3">Title Type</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cofaRecords.map((record:any) => (
                <tr key={record.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 text-sm font-semibold">#{(record?.id).slice(0,6).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm">{record?.ownerName}</td>
                  <td className="px-4 py-3 text-sm">{record?.ownershipType}</td>
                  <td className="px-4 py-3 text-sm">{record?.titleType}</td>
                  <td className="px-4 py-3 text-sm">{record?.purpose}</td>
                  <td className="px-4 py-3 flex space-x-2">
                    <button 
                      onClick={() => setSelectedLand(record)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      👁 View
                    </button>
                    <button 
                      onClick={() => setSelectedLand(record)}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(record)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden">
          {cofaRecords.map((record:any) => (
            <div key={record.id} className="border-b p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">ID: #{(record?.id).slice(0,6).toUpperCase()}</p>
                  <p className="text-sm font-bold text-gray-800">{record?.ownerName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Ownership</p>
                  <p className="font-semibold text-gray-700">{record?.ownershipType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Title Type</p>
                  <p className="font-semibold text-gray-700">{record?.titleType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Purpose</p>
                  <p className="font-semibold text-gray-700">{record?.purpose}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedLand(record)}
                  className="flex-1 text-blue-600 hover:text-blue-800 text-xs font-medium py-2 bg-blue-50 rounded"
                >
                  👁 View
                </button>
                <button 
                  onClick={() => setSelectedLand(record)}
                  className="flex-1 text-gray-600 hover:text-gray-900 text-xs font-medium py-2 bg-gray-100 rounded"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => setDeleteConfirm(record)}
                  className="flex-1 text-red-600 hover:text-red-800 text-xs font-medium py-2 bg-red-50 rounded"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Land Detail Modal */}
      {selectedLand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Land Details</h2>
              <button 
                onClick={() => setSelectedLand(null)}
                className="text-2xl hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Land ID</p>
                  <p className="text-sm font-semibold text-gray-800">#{(selectedLand?.id).slice(0,6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Owner Name</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Ownership Type</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.ownershipType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Title Type</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.titleType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Purpose</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.purpose}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Square Meters</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.squareMeters} sq.m</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Latitude</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.latitude}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Longitude</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedLand?.longitude}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Created At</p>
                  <p className="text-sm font-semibold text-gray-800">{new Date(selectedLand?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Documents Section */}
              {selectedLand?.documents && selectedLand?.documents.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">📄 Documents ({selectedLand?.documents.length})</h3>
                  <div className="space-y-2">
                    {selectedLand?.documents.map((doc: any) => (
                      <a
                        key={doc.id}
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 text-sm text-blue-600 truncate"
                      >
                        📎 {doc.fileName}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-2 justify-end">
              <button 
                onClick={() => setSelectedLand(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  // Edit functionality - navigate to edit page with land data
                  navigate(`/dashboard/edit-land/${selectedLand.id}`, { state: { land: selectedLand } });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Edit Land
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Delete Land Details?</h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete the land details for <strong>{deleteConfirm?.ownerName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-4 border-t">
              <button 
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteLand(deleteConfirm.id)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default COFAList;

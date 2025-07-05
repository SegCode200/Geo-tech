
const PropertiesUnderReview = () => {
  const properties = [
    { id: 1, name: 'Chervon', location: 'Lagos Nigeria', status: 'Pending' },
    { id: 2, name: 'Chervon', location: 'Lagos Nigeria', status: 'Pending' },
    { id: 3, name: 'Chervon', location: 'Lagos Nigeria', status: 'Pending' },
  ];

  return (
    <div className="bg-white shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">C of O under review</h2>
      <div className="grid grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white shadow-md p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="bg-green-500 text-white px-2 py-1 rounded">{property.status}</span>
              <span>...</span>
            </div>
            <p className="text-lg font-bold mt-2">{property.name}</p>
            <p className="text-gray-600">lat:245336 lon:-2039</p>
            <p className="text-gray-600">Lagos Nigeria</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesUnderReview;
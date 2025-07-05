

const RejectionReasons = () => {
  const reasons = [
    { name: 'Mark', reason: 'Food could be better.', room: 'A201' },
    { name: 'Christian', reason: 'Facilities are not enough for amount paid.', room: 'A101' },
    { name: 'Alexander', reason: 'Room cleaning could be better.', room: 'A301' },
  ];

  return (
    <div className="bg-white shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">C of O rejection reason</h2>
      <div>
        {reasons.map((reason, index) => (
          <div key={index} className="flex justify-between items-start mb-4">
            <div>
              <p className="text-lg font-bold">{reason.name}</p>
              <p className="text-gray-600">{reason.reason}</p>
            </div>
            <p className="text-gray-600">{reason.room}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RejectionReasons;
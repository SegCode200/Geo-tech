export function Footer() {
  return (
    <footer className="bg-gray-100 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold">Federal Republic of Nigeria · Geo Tech</h4>
          <p className="mt-2 text-gray-600">Official Certificate of Occupancy (C of O) Portal</p>
        </div>
        <div>
          <h4 className="font-semibold">Resources</h4>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>How It Works</li>
            <li>Track Application</li>
            <li>Requirements</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <p className="mt-2 text-gray-600">Privacy Policy · Terms of Service</p>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-gray-500">© Federal Government of Nigeria</p>
    </footer>
  );
}
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src=" https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg"
            alt="Nigeria Coat of Arms"
            className="h-10"
          />
          <div className="leading-tight">
            <p className="font-bold text-green-700 text-sm">Federal Republic of Nigeria · Geo Tech</p>
            <p className="text-xs text-gray-500">Land Registry & Documentation Portal</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <Link to="#how" className="hover:text-green-700">How It Works</Link>
          <Link to="/" className="hover:text-green-700">Track Application</Link>
          <Link to="/" className="hover:text-green-700">Requirements</Link>
        </nav>
        <Link
          to="/auth/register"
          className="rounded-md bg-green-700 px-5 py-2 text-sm text-white hover:bg-green-800"
        >
          Apply for C of O
        </Link>
      </div>
    </header>
  );
}

import { FaHome, FaBuilding,  FaMapMarkerAlt, FaFileUpload, FaUserCog, FaUsers } from 'react-icons/fa';
import { FaLandmarkDome } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0">
      {/* Logo */}
      <div className="flex items-center  p-4 bg-primary text-white">
        {/* <FaHome className="h-6 w-6 mr-2" /> */}
        <span className="text-xl font-bold">GeoTech</span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/" className="flex items-center">
              <FaHome className="h-5 w-5 mr-2" />
              Overview
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/rental-units" className="flex items-center">
              <FaBuilding className="h-5 w-5 mr-2" />
              Rental Units
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/list-of-registrations" className="flex items-center">
              <FaLandmarkDome className="h-5 w-5 mr-2" />
              Land Registration
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/land-search" className="flex items-center">
              <FaMapMarkerAlt className="h-5 w-5 mr-2" />
              Land Search
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/ownership-transfer" className="flex items-center">
              <FaUserCog className="h-5 w-5 mr-2" />
              Ownership Transfer
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/list-c-of-o-application" className="flex items-center">
              <FaFileUpload className="h-5 w-5 mr-2" />
              C of O Application
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/user-management" className="flex items-center">
              <FaUsers className="h-5 w-5 mr-2" />
              User Management
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
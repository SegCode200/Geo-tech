import {
  FaHome,
  FaMapMarkerAlt,
  FaFileUpload,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaLandmarkDome } from "react-icons/fa6";
import { useAppDispatch } from "../../store/hooks";
import { clearAuth } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ isMobile = false, onClose }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Implement logout functionality here
    await logout();
    dispatch(clearAuth());
    navigate("/auth/login");
  };
  return (
    <aside
      className={`${
        isMobile ? "fixed inset-y-0 left-0 z-40 w-64" : "hidden md:block fixed"
      } bg-gray-800 text-white h-screen top-0`}
    >
      {/* Logo */}
      <div className="flex items-center  p-4 bg-primary text-white justify-between">
        {/* <FaHome className="h-6 w-6 mr-2" /> */}
        <span className="text-xl font-bold">GeoTech</span>
        {isMobile && (
          <button onClick={onClose} className="text-white ml-2 md:hidden">
            ✕
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/dashboard" className="flex items-center">
              <FaHome className="h-5 w-5 mr-2" />
              Overview
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a
              href="/dashboard/list-of-registrations"
              className="flex items-center"
            >
              <FaLandmarkDome className="h-5 w-5 mr-2" />
              Land Registration
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/dashboard/land-search" className="flex items-center">
              <FaMapMarkerAlt className="h-5 w-5 mr-2" />
              Land Search
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a
              href="/dashboard/ownership-transfer"
              className="flex items-center"
            >
              <FaUserCog className="h-5 w-5 mr-2" />
              Ownership Transfer
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a
              href="/dashboard/list-c-of-o-application"
              className="flex items-center"
            >
              <FaFileUpload className="h-5 w-5 mr-2" />C of O Application
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <a href="/dashboard/user-management" className="flex items-center">
              <FaUsers className="h-5 w-5 mr-2" />
              User Management
            </a>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center"
            >
              <FiLogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

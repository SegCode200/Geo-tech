import {
  FaHome,
  FaMapMarkerAlt,
  FaFileAlt,
  FaUserCog,
  FaUsers,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaLandmarkDome } from "react-icons/fa6";
import { useAppDispatch } from "../../store/hooks";
import { clearAuth } from "../../store/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../api/auth";

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ isMobile = false, onClose }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    dispatch(clearAuth());
    navigate("/auth/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: FaHome },
    { path: "/dashboard/list-of-registrations", label: "Land Registration", icon: FaLandmarkDome },
    { path: "/dashboard/land-search", label: "Land Search", icon: FaMapMarkerAlt },
    { path: "/dashboard/ownership-transfer", label: "Ownership Transfer", icon: FaUserCog },
    { path: "/dashboard/list-c-of-o-application", label: "C of O Application", icon: FaFileAlt },
    { path: "/dashboard/user-management", label: "User Management", icon: FaUsers },
  ];

  return (
    <aside
      className={`${
        isMobile ? "fixed inset-y-0 left-0 z-40 w-64" : "hidden md:block fixed"
      } bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white h-screen top-0 transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 px-6 py-6 border-b-2 border-blue-700 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">GeoTech</h1>
            <p className="text-xs text-blue-200">Gov Portal</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="mt-2 px-3 py-4">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest px-3 py-2 mb-2">
          Main Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg border-l-4 border-blue-300"
                      : "text-blue-100 hover:bg-blue-700/40 hover:text-white"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-200" : "text-blue-300"}`} />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {active && (
                    <FaChevronRight className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-blue-700/50 flex-shrink-0"></div>

      {/* Account Section - Always Visible */}
      <div className="px-3 py-4 flex-shrink-0">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest px-3 py-2 mb-2">
          Account
        </p>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            text-blue-100 hover:bg-red-600/20 hover:text-red-300
          `}
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm flex-1 text-left">Logout</span>
        </button>
      </div>

      {/* Footer Info - Always At Bottom */}
      <div className="px-4 py-3 bg-gradient-to-t from-blue-950 to-transparent border-t border-blue-700/50 flex-shrink-0">
        <div className="text-xs text-blue-300 space-y-1">
          <p className="font-semibold">Certificate of Occupancy</p>
          <p>Management Portal v1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import img from "../../assets/profile.jpg"
import { FaSearch, FaBell } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="py-6  px-4 flex justify-between items-center">
      {/* Logo */}

      {/* Search Bar */}
      <div className="flex-grow flex items-center ">
        <span className="text-[30px] font-semibold">Welcome, Gilbert Obaseki</span>
      </div>

      {/* Notifications and Profile */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <FaBell className="h-6 w-6" />
        </button>
        <img src={img} alt="User Profile" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
};

export default Header;
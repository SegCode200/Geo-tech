import img from "../../assets/profile.jpg"
import { FaBell } from 'react-icons/fa';
import { useAppSelector } from "../../store/hooks";

type HeaderProps = {
  onToggleSidebar?: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user } = useAppSelector((s) => s.auth);
  
  return (
    <header className="py-4 px-0 md:px-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden text-gray-700 bg-white p-2 rounded shadow">
          ☰
        </button>
        <div className="flex-grow flex items-center">
          <span className="text-lg md:text-[30px] font-semibold">Welcome, {user?.name || ""}</span>
        </div>
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

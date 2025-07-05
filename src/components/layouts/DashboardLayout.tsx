import Header from '../static/Header';
import Sidebar from '../static/SideBar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 pb-6 pt-2 px-6 bg-gray-100 min-h-screen">
        <Header/>
        <Outlet /> {/* Renders the child route content */}
      </main>
    </div>
  );
};

export default DashboardLayout;
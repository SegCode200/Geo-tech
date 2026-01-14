import { useState } from 'react';
import Header from '../static/Header';
import Sidebar from '../static/SideBar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex">
      {/* Desktop Sidebar + Mobile Drawer via Sidebar props */}
      <Sidebar isMobile={false} />
      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setShowSidebar(false)} />
          <Sidebar isMobile={true} onClose={() => setShowSidebar(false)} />
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ml-0 md:ml-48 pb-6 pt-2 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen`}>
        <Header onToggleSidebar={() => setShowSidebar(true)} />
        <Outlet /> {/* Renders the child route content */}
      </main>
    </div>
  );
};

export default DashboardLayout;
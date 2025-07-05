

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      {/* Top Banner */}
      <div className="bg-[#45A9EA] text-white px-4 py-2 flex justify-between items-center">
        <span>✨ Discover Your Dream Property with Estatein | <a href="#" className="text-white">Learn More</a></span>
        <button className="text-white" onClick={() => console.log('Close')}>❌</button>
      </div>

      {/* Main Navigation */}
      <nav className="flex justify-between items-center px-4 py-6">
        <div className="flex items-center space-x-4">
          {/* <img src="/logo.png" alt="Estatein Logo" className="h-8 w-auto" /> Replace with your logo */}
          <span className="text-xl font-bold">GeoTech</span>
        </div>
        <ul className="flex space-x-6">
          <li><a href="#" className="text-gray-700 hover:text-[#45A9EA]">Home</a></li>
          <li><a href="#" className="text-gray-700 hover:text-[#45A9EA]">About Us</a></li>
          <li><a href="#" className="text-[#45A9EA] bg-gray-200 rounded px-4 py-2">Properties</a></li>
          <li><a href="#" className="text-gray-700 hover:text-[#45A9EA]">Services</a></li>
        </ul>
        <button className="bg-[#45A9EA] text-white px-4 py-2 rounded hover:bg-[#3B94DC]">Contact Us</button>
      </nav>
    </header>
  );
};

export default Header;
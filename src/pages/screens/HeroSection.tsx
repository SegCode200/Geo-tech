

const HeroSection = () => {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="mb-8">
          Welcome to Estatein, where your dream property awaits in every corner of our beautiful world.
          Explore our curated selection of properties, each offering a unique story and a chance to redefine your life.
          With categories to suit every dreamer, your journey begins here.
        </p>

        {/* Search Bar */}
        <div className="flex items-center justify-between mb-8">
          <input
            type="text"
            placeholder="Search For A Property"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-3/4"
          />
          <button className="bg-[#45A9EA] text-white px-4 py-2 ml-4 rounded-lg hover:bg-[#3B94DC]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.817-4.818A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Find Property
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 20a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm.5-13.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0-4.5a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <select className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1">
              <option value="">Location</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 20a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm.5-13.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0-4.5a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <select className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1">
              <option value="">Property Type</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 20a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm.5-13.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0-4.5a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <select className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1">
              <option value="">Pricing Range</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 20a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm.5-13.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0-4.5a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <select className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1">
              <option value="">Property Size</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
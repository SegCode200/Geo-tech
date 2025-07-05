import { FaFileUpload } from 'react-icons/fa'; // Import the upload icon
const Dashboard = () => {
  return (
     <div className="container mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="list-none p-0 flex items-center">
              <li className="flex items-center">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Rental Units
                </a>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="flex items-center">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  New Rental Unit
                </a>
              </li>
            </ol>
          </nav>
    
          {/* Form Title */}
          <h1 className="text-2xl font-bold mb-4">New Rental Unit</h1>
          <p className="text-gray-600 mb-6">Register new rental unit here. Click save when you're done.</p>
    
          {/* Form Fields */}
          <form className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700 mb-1">
                Room No.
              </label>
              <input
                type="text"
                id="roomNo"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
                placeholder="Room No."
              />
    
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Floor
              </label>
              <input
                type="number"
                id="floor"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
                placeholder="Floor"
              />
    
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Size
              </label>
              <input
                type="number"
                id="size"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
                placeholder="Size"
              />
    
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Price
              </label>
              <input
                type="text"
                id="price"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
                placeholder="Price"
              />
    
              <label htmlFor="unitType" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Unit Type
              </label>
              <select
                id="unitType"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
              >
                <option value="">Select Unit Type</option>
                <option value="studio">Studio</option>
                <option value="1-bedroom">1-Bedroom</option>
                <option value="2-bedroom">2-Bedroom</option>
              </select>
    
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Status
              </label>
              <select
                id="status"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
              >
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
    
            {/* Right Column */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
              >
                <option value="">Select Condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
    
              <label htmlFor="minimumRentalDays" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Minimum Rental Day
              </label>
              <input
                type="number"
                id="minimumRentalDays"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
                placeholder="Minimum Rental Days"
              />
    
              <label htmlFor="numberOfPeopleAllowed" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Number of People Allowed
              </label>
              <input
                type="number"
                id="numberOfPeopleAllowed"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
                placeholder="Number of People Allowed"
              />
            </div>
          </form>
    
          {/* Room Photos Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-2">Room Photos</h2>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <FaFileUpload className="h-6 w-6 text-gray-500" />
              </div>
              <div className="w-24 h-24 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <FaFileUpload className="h-6 w-6 text-gray-500" />
              </div>
              <div className="w-24 h-24 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <FaFileUpload className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Formats: pdf, png, jpg</p>
          </div>
    
          {/* Save Button */}
          <button className="bg-green-500 text-white px-4 py-2 mt-8 rounded-md hover:bg-green-600 transition duration-300">Save rental unit</button>
        </div>
  )
}

export default Dashboard
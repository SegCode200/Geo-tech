import React from 'react';

const PropertyListing = ({ title, description, price, imageSrc }:any) => {
  return (
    <div className="bg-black text-white rounded-lg overflow-hidden shadow-md mb-8">
      <img src={imageSrc} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <p className="text-sm bg-gray-800 rounded px-2 py-1">{description}</p>
        <h2 className="text-xl font-bold mt-2">{title}</h2>
        <p className="mt-2">
          Price: ${price}
          <button className="bg-[#45A9EA] text-white px-4 py-2 ml-4 rounded-lg hover:bg-[#3B94DC]">
            View Property Details
          </button>
        </p>
      </div>
    </div>
  );
};

export default PropertyListing;
"use client";

import { useState } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import useSearchModal from "@/app/hooks/useSearchModal";

const MobileSearchButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchModal = useSearchModal();

  const handleSearchClick = () => {
    if (isExpanded) {
      // Close expanded search
      setIsExpanded(false);
    } else {
      // Open expanded search
      setIsExpanded(true);
    }
  };

  const handleSearchSubmit = () => {
    // Open the search modal for detailed search
    searchModal.open("location");
    setIsExpanded(false);
  };

  if (isExpanded) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Search</h2>
          <button
            onClick={handleSearchClick}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Search Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Quick Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Activity, Place or Company"
              className="w-full p-4 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              // onClick={handleSearchSubmit}
              className="absolute right-2 top-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <HiMagnifyingGlass className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Popular searches</h3>
            <div className="space-y-2">
              <button 
                // onClick={handleSearchSubmit}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    🏖️
                  </div>
                  <div>
                    <p className="font-medium">Beach activities</p>
                    <p className="text-sm text-gray-500">Scuba Diving, Surfboarding</p>
                  </div>
                </div>
              </button>
              
              <button 
                // onClick={handleSearchSubmit}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    🏔️
                  </div>
                  <div>
                    <p className="font-medium">Mountain adventures</p>
                    <p className="text-sm text-gray-500">Hiking & Bungee Jumping</p>
                  </div>
                </div>
              </button>

              <button 
                // onClick={handleSearchSubmit}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    🏙️
                  </div>
                  <div>
                    <p className="font-medium">City experiences</p>
                    <p className="text-sm text-gray-500">Go Kart, Bike Riding</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Advanced Search Button */}
          <button
            // onClick={handleSearchSubmit}
            className="w-full p-4 bg-gray-100 rounded-lg text-center font-medium hover:bg-gray-200"
          >
            Advanced search with filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleSearchClick}
      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      <HiMagnifyingGlass className="w-6 h-6 text-gray-700" />
    </button>
  );
};

export default MobileSearchButton;

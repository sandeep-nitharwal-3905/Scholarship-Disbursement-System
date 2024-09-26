import React, { useState } from "react";

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="bg-[#4A4947] text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Scholarship Disbursement System</h1>

      <div className="relative">
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black z-10">
            <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
              Settings
            </div>

            <div className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-t border-gray-200">
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;

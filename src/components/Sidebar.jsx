import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
  GraduationCap,
  Building,
  UserPlus,
  BookOpen,
  Home,
  Layout,
  BarChart2,
} from "lucide-react";

const Sidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState({
    documentStatus: false,
    scholarshipInfo: false,
    userManagement: false,
  });

  const toggleDropdown = (section) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const items = [
    { name: "Home", icon: Home },
    { name: "Dashboard", icon: BarChart2 },
    {
      name: "Document Status",
      icon: GraduationCap,
      dropdown: ["Upload Documents", "Track Submission Status"],
    },
    {
      name: "Scholarship Info",
      icon: Building,
      dropdown: ["Eligibility Criteria", "Scholarship Types"],
    },
    {
      name: "User Management",
      icon: Users,
      dropdown: ["Manage Users", "User Roles"],
    },
    { name: "Payment History", icon: UserPlus },
    { name: "Guidelines", icon: BookOpen },
    { name: "Settings", icon: Layout },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 overflow-y-auto">
      {/* User Profile Section */}
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-600 mr-3"></div>
        <div>
          <p className="font-semibold">idk 123</p>
          <p className="text-xs text-gray-400">
            Student / Admin (will depend!)
          </p>
        </div>
      </div>

      {/* Sidebar Items */}
      {items.map((item, index) => (
        <div key={index}>
          {/* Main Item */}
          <div
            className={`flex items-center py-2 px-4 rounded cursor-pointer ${
              item.name === "Dashboard" ? "bg-[#CDC1FF]" : "hover:bg-gray-700"
            }`}
            onClick={() => (item.dropdown ? toggleDropdown(item.name) : null)}
          >
            {/* Icon */}
            <item.icon size={20} className="mr-2" />
            {item.name}
            {/* Chevron Up/Down */}
            {item.dropdown &&
              (dropdownOpen[item.name] ? (
                <ChevronUp size={20} className="ml-auto" />
              ) : (
                <ChevronDown size={20} className="ml-auto" />
              ))}
          </div>

          {/* Sub-Items (Dropdown Content) */}
          {item.dropdown && dropdownOpen[item.name] && (
            <div className="ml-8">
              {item.dropdown.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  className="py-2 px-4 rounded cursor-pointer hover:bg-gray-700"
                >
                  {subItem}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
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
  BarChart2,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom"; // Import NavLink for active styling

const Sidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState({
    documentStatus: true, // Default dropdown open for Document Status
    scholarshipInfo: false,
    userManagement: false,
  });

  const [activeLink, setActiveLink] = useState("Dashboard"); // Set initial active link to Dashboard

  const toggleDropdown = (section) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    // Add your logout logic here, such as redirecting or clearing session
    console.log("User logged out");
  };

  const items = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Dashboard", icon: BarChart2, path: "/dashboard" },
    {
      name: "Document Status",
      icon: GraduationCap,
      dropdown: [
        { name: "Upload Documents", path: "/upload" },
        { name: "Track Submission Status", path: "/track" }, // Example sublink
      ],
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
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-[calc(100vh-20px)] p-4 overflow-y-auto">
      {/* User Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src="https://drive.google.com/file/d/1CJFuZdn4dyvL-GLTovts5A0p9waCHJwt/view?usp=drive_link" // Replace with the actual image URL
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-lg">UserID123</p>
          <p className="text-xs text-gray-400">Student</p>
        </div>
      </div>

      {items.map((item, index) => (
        <div key={index}>
          {/* Main Item */}
          <div
            onClick={() => {
              if (item.dropdown) {
                toggleDropdown(item.name);
              } else {
                setActiveLink(item.name); // Set active link
              }
            }}
          >
            <NavLink
              to={item.path || "#"}
              className={`flex items-center py-2 px-4 rounded cursor-pointer ${
                activeLink === item.name ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                if (!item.dropdown) setActiveLink(item.name); // Set active link if not dropdown
              }}
            >
              <item.icon size={20} className="mr-2" />
              <span className="text-base">{item.name}</span>
              {item.dropdown &&
                (dropdownOpen[item.name] ? (
                  <ChevronUp size={20} className="ml-auto" />
                ) : (
                  <ChevronDown size={20} className="ml-auto" />
                ))}
            </NavLink>
          </div>

          {/* Dropdown handling */}
          {item.dropdown && dropdownOpen[item.name] && (
            <div className="ml-8">
              {item.dropdown.map((subItem, subIndex) => {
                if (typeof subItem === "object") {
                  return (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `py-2 px-4 rounded cursor-pointer hover:bg-gray-700 text-sm block ${
                          activeLink === subItem.name ? "bg-gray-600" : ""
                        }`
                      }
                      onClick={() => setActiveLink(subItem.name)} // Set active link for dropdown
                    >
                      {subItem.name}
                    </NavLink>
                  );
                }
                return (
                  <div
                    key={subIndex}
                    className="py-2 px-4 rounded cursor-pointer hover:bg-gray-700 text-sm"
                  >
                    {subItem}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Logout Button Container */}
      <div className="mt-4 bg-gray-700 rounded-lg">
        <div
          className="flex items-center py-2 px-4 rounded cursor-pointer hover:bg-red-600 transition duration-200"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          <span className="text-base font-semibold">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

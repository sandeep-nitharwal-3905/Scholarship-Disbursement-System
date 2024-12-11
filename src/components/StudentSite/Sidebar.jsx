import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    documentStatus: true,
    scholarshipInfo: false,
    userManagement: false,
  });

  const [activeLink, setActiveLink] = useState("home"); // Set initial active link to Dashboard


  const toggleDropdown = (section) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("uid");
    navigate("/login");
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
        { name: "Documents Status", path: "/docs-track" },
        { name: "Download Your Documents", path: "/download-documents" },
      ],
    },
    {
      name: "Scholarship Status",
      icon: Building,
      dropdown: [
        { name: "Available Scholarships", path: "/viewScholarships" },
        { name: "Applications Status", path: "/updatedDashboard" },
      ],
    },
    {
      name: "User Management",
      icon: Users,
      dropdown: ["Manage Users", "User Roles"],
    },
    { name: "Video Verification", icon: UserPlus, path: "/ekyc0" },
    { name: "FAQ", icon: BookOpen, path: "/FAQ" },
    { name: "Payment History", icon: UserPlus },
    { name: "Guidelines", icon: BookOpen },
    { name: "Settings", icon: Settings },
  ];

  const convertToNameFormat = (text) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div
        className="sm:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 sm:w-64 bg-gray-900 text-white 
          shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out z-40 
          ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        {/* User Profile Section */}
        <div className="flex items-center p-6 border-b border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300">
          <img
            src="https://thumbs.dreamstime.com/b/half-body-father-avatar-vector-stock-illustration-isolated-blue-background-312576179.jpg"
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4 border-2 border-gray-600 shadow-lg"
          />
          <div>
            <p className="font-bold text-xl text-gray-100">
              {convertToNameFormat(props.user.fullName)}
            </p>
            <p className="text-sm text-gray-400">
              {props.user.role === "student" ? "Student" : "Admin"}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="py-4">
          {items.map((item, index) => (
            <div key={index} className="group">
              {/* Main Item */}
              <div
                onClick={() => {
                  if (item.dropdown) {
                    toggleDropdown(item.name);
                  } else {
                    setActiveLink(item.name);
                  }
                }}
                className="relative"
              >
                <NavLink
                  to={item.path || "#"}
                  className={({ isActive }) => `flex items-center py-3 px-6 
                    ${isActive || activeLink === item.name
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"}
                  `}
                >
                  <item.icon size={24} className="mr-4" />
                  <span>{item.name}</span>
                  {item.dropdown &&
                    (dropdownOpen[item.name] ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
                </NavLink>
              </div>

              {/* Dropdown Items */}
              {item.dropdown && dropdownOpen[item.name] && (
                <div className="bg-gray-800/50">
                  {item.dropdown.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path || "#"}
                      className="block py-2 px-12 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900/50">
          <div
            className="flex items-center py-3 px-6 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-300 hover:text-red-100 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={24} className="mr-4" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

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
    { name: "Video Verification", icon: UserPlus, path: "/ekyc0" },
    { name: "FAQ", icon: BookOpen, path: "/FAQ" },
    { name: "Settings", icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 text-white rounded-md shadow-md focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center p-6 border-b border-gray-700 bg-gray-800/50">
          <img
            src="https://via.placeholder.com/48"
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-bold">{props.user.fullName || "User Name"}</p>
            <p className="text-sm text-gray-400">{props.user.role || "Role"}</p>
          </div>
        </div>
        <nav className="py-4">
          {items.map((item, index) => (
            <div key={index} className="group">
              <div
                onClick={() =>
                  item.dropdown ? toggleDropdown(item.name) : setIsOpen(false)
                }
              >
                <NavLink
                  to={item.path || "#"}
                  className={({ isActive }) => `
                    flex items-center py-3 px-6 cursor-pointer 
                    transition-all duration-300
                    ${isActive ? "bg-gray-700 text-white" : "text-gray-300"}
                  `}
                >
                  <item.icon size={24} className="mr-4" />
                  <span>{item.name}</span>
                  {item.dropdown && (
                    <span className="ml-auto">
                      {dropdownOpen[item.name] ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  )}
                </NavLink>
              </div>
              {item.dropdown && dropdownOpen[item.name] && (
                <div className="pl-12">
                  {item.dropdown.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) => `
                        block py-2 text-sm
                        ${isActive ? "text-white" : "text-gray-300"}
                      `}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
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
  BarChart2,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for dropdowns, active link, sidebar visibility
  const [dropdownOpen, setDropdownOpen] = useState({
    documentStatus: true,
    scholarshipInfo: false,
    userManagement: false,
  });
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Check screen size and update sidebar mode
  useEffect(() => {
    const checkScreenSize = () => {
      // Mobile view: sidebar hidden by default
      if (window.innerWidth < 768) {
        setIsCompactMode(false);
        setIsSidebarOpen(false);
      } 
      // Desktop view: check if screen is small
      else if (window.innerWidth < 1024) {
        setIsCompactMode(true);
        setIsSidebarOpen(false);
      } 
      // Large desktop: full sidebar
      else {
        setIsCompactMode(false);
        setIsSidebarOpen(true);
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for resizing
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const items = [
    {
      name: "Documents Section",
      icon: GraduationCap,
      dropdown: [
        { name: "Documents Verification", path: "/docs-verification" },
      ],
    },
    {
      name: "Scholarship Section",
      icon: GraduationCap,
      dropdown: [
        { name: "Add Scholarship", path: "/admin-add-scholarship" },
        { name: "Edit Scholarship", path: "/admin-track" },
        { name: "Applications Verification", path: "/applications-check" },
      ],
    },
    { name: "Video Verification", icon: BarChart2, path: "/ekyc1" },
    { name: "Settings", icon: Settings },
  ];

  const convertToNameFormat = (text) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Mobile Menu Button
  const MobileMenuToggle = () => (
    <div 
      className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-full"
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />

      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 z-40 
          w-64 bg-gray-800 text-white 
          h-full p-4 overflow-y-auto 
          transform transition-transform duration-300 ease-in-out
          ${isCompactMode ? 'w-20' : 'w-64'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 
          ${isCompactMode && !isSidebarOpen ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Close Button for Mobile/Compact Mode */}
        {(isSidebarOpen || isCompactMode) && (
          <div 
            className="absolute top-4 right-4 cursor-pointer"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </div>
        )}

        {/* User Profile Section */}
        <div className="flex items-center mb-6">
          <img
            src="https://thumbs.dreamstime.com/b/half-body-father-avatar-vector-stock-illustration-isolated-blue-background-312576179.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className={isCompactMode ? 'hidden' : ''}>
            <p className="font-semibold text-lg">
              {convertToNameFormat(props.user.fullName)}
            </p>
            <p className="text-xs text-gray-400">
              {props.user.role === "student" ? "Student" : "Admin"}
            </p>
          </div>
        </div>

        {items.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => {
                if (item.dropdown) {
                  toggleDropdown(item.name);
                } else {
                  setActiveLink(item.name);
                }
              }}
            >
              <NavLink
                to={item.path || "#"}
                className={`
                  flex items-center py-2 px-4 rounded cursor-pointer 
                  ${activeLink === item.name ? "bg-gray-600" : "hover:bg-gray-700"}
                  ${isCompactMode ? 'justify-center' : ''}
                `}
                onClick={() => {
                  if (!item.dropdown) setActiveLink(item.name);
                }}
              >
                <item.icon size={20} className="mr-2" />
                <span 
                  className={`text-base ${isCompactMode ? 'hidden' : ''}`}
                >
                  {item.name}
                </span>
                {item.dropdown && !isCompactMode && 
                  (dropdownOpen[item.name] ? (
                    <ChevronUp size={20} className="ml-auto" />
                  ) : (
                    <ChevronDown size={20} className="ml-auto" />
                  ))
                }
              </NavLink>
            </div>

            {item.dropdown && dropdownOpen[item.name] && !isCompactMode && (
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
                        onClick={() => setActiveLink(subItem.name)}
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
        <div className={`mt-4 bg-gray-700 rounded-lg ${isCompactMode ? 'text-center' : ''}`}>
          <div
            className={`
              flex items-center py-2 px-4 rounded cursor-pointer 
              hover:bg-red-600 transition duration-200
              ${isCompactMode ? 'justify-center' : ''}
            `}
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            <span className={`text-base font-semibold ${isCompactMode ? 'hidden' : ''}`}>
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
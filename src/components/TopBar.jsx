import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  BellDot, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown 
} from "lucide-react";

const TopBar = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const bellDropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleBellDropdown = () => {
    setIsBellDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("uid");
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellDropdownRef.current &&
        !bellDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsBellDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "tween",
        duration: 0.2 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: { 
        duration: 0.1 
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-900 to-black text-white p-4 shadow-2xl"
    >
      <div className="flex justify-between items-center min-w-[800px] max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-blue-300 whitespace-nowrap pr-4 tracking-wider">
          Scholarship Disbursement System
        </h1>

        <div className="flex items-center space-x-6 ml-auto">
          {/* Notification Icon */}
          <motion.div 
            className="relative" 
            ref={bellDropdownRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {props.isNotification ? (
              <BellDot
                color="#3e9392"
                className="cursor-pointer"
                onClick={toggleBellDropdown}
                size={24}
              />
            ) : (
              <Bell
                color="#3e9392"
                className="cursor-pointer"
                onClick={toggleBellDropdown}
                size={24}
              />
            )}
            <AnimatePresence>
              {isBellDropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Notification Header */}
                  <div className="bg-gray-100 p-3 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                    <span className="text-xs text-gray-500">{props.notificationCount || 0} new</span>
                  </div>

                  {/* Notification Items */}
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { title: "New Scholarship", description: "A new scholarship opportunity is available" },
                      { title: "Document Verification", description: "Your documents need review" }
                    ].map((notification, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* View All Link */}
                  <div 
                    onClick={() => navigate('/notifications')}
                    className="p-3 text-center bg-gray-100 text-sm font-medium text-blue-600 hover:bg-gray-200 cursor-pointer"
                  >
                    View All Notifications
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Avatar with dropdown */}
          <motion.div 
            className="relative" 
            ref={dropdownRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
              whileHover={{ rotate: 2 }}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-xl font-bold text-white">
                  {props.user?.fullName?.[0]?.toUpperCase() || 'S'}
                </span>
              </div>
              <ChevronDown size={18} className="text-gray-300" />
            </motion.div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* User Profile Section */}
                  <div className="bg-gray-100 p-4 flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-2xl font-bold text-white">
                        {props.user?.fullName?.[0]?.toUpperCase() || 'S'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {props.user?.fullName || 'Student'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {props.user?.role || 'Student Role'}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div>
                    <motion.div 
                      onClick={handleSettings}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-50"
                    >
                      <Settings size={18} className="mr-3 text-gray-600" />
                      <span className="text-sm text-gray-800">Settings</span>
                    </motion.div>
                    <motion.div 
                      onClick={handleLogout}
                      whileHover={{ backgroundColor: "#fee2e2" }}
                      className="px-4 py-3 flex items-center cursor-pointer hover:bg-red-50 border-t border-gray-200"
                    >
                      <LogOut size={18} className="mr-3 text-red-600" />
                      <span className="text-sm text-red-600">Log Out</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
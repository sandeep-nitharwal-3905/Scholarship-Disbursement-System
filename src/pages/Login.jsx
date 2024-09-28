import React, { useState, useEffect } from "react";

const App = () => {
  const [role, setRole] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
  }, []);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setRole("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div
        className={`${
          isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        } transition-all duration-800 ease-out bg-gray-100 p-10 rounded-lg shadow-lg text-center w-[400px]`}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Scholarship Portal
        </h1>
        {role === "" ? (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-2 border-gray-300">
              Select your role:
            </h2>
            <button
              className="w-full bg-gray-800 text-white py-3 mt-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
              onClick={() => handleSelectRole("admin")}
            >
              Admin
            </button>
            <button
              className="w-full bg-gray-800 text-white py-3 mt-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
              onClick={() => handleSelectRole("student")}
            >
              Student
            </button>
          </div>
        ) : role === "admin" ? (
          <AdminLogin onBack={handleBack} />
        ) : (
          <StudentLogin onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

const AdminLogin = ({ onBack }) => {
  return (
    <div className="animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
        Admin Login
      </h2>
      <input
        type="text"
        placeholder="Admin Username"
        className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
      />
      <input
        type="password"
        placeholder="Admin Password"
        className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
      />
      <button className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95">
        Login as Admin
      </button>
      <button
        className="w-full bg-gray-800 text-white py-3 mt-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};

const StudentLogin = ({ onBack }) => {
  return (
    <div className="animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
        Student Login
      </h2>
      <input
        type="text"
        placeholder="Student ID"
        className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
      />
      <button className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95">
        Login as Student
      </button>
      <button
        className="w-full bg-gray-800 text-white py-3 mt-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { loginUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [role, setRole] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <ToastContainer />
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
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

const AdminLogin = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      toast.success("Admin logged in successfully!");

      // Navigate to the dashboard with only uid
      setTimeout(() => {
        navigate("/dashboard", { state: { uid: userData.uid } });
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
        Admin Login
      </h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
        />
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95"
        >
          Login as Admin
        </button>
      </form>
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      toast.success("Student logged in successfully!");

      // Navigate to the dashboard with only uid
      setTimeout(() => {
        navigate("/dashboard", { state: { uid: userData.uid } });
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
        Student Login
      </h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
        />
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95"
        >
          Login as Student
        </button>
      </form>
      <button
        className="w-full bg-gray-800 text-white py-3 mt-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};

export default Login;

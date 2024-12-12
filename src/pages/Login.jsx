import React, { useState, useEffect } from "react";
import { loginUser } from "../firebase/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = location.state || {};
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage: `url('https://www.bpmb.com.my/wp-content/uploads/bagus-scholarship.jpg')`,
      }}
    >
      <ToastContainer />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 px-4">
        {/* Left Content */}
        <div
          className={`text-white max-w-md text-center md:text-left mb-8 md:mb-0 transition-all duration-700 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
        >
          <h1 className="text-7xl font-bold mb-4 animate-fadeIn" style={{
            WebkitTextStroke: "1px #000", // Black border
            color: "white", // Fill color
          }}>
            Empower Your Future
          </h1>
          <p className="text-lg mb-6" >
            Welcome to the Scholarship Disbursement System. Our platform is
            designed to help students achieve their dreams by connecting them
            with the financial resources they need.
          </p>
          <p className="text-lg">
            Whether you're a student seeking opportunities or an administrator
            managing funds, we're here to make the process seamless and
            efficient.
          </p>
        </div>
        {/* Right Login Form */}
        <div
          className={`${isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
            } transition-all duration-800 ease-out bg-gray-100 p-10 rounded-lg shadow-lg text-center w-full md:w-[400px]`}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">Scholarship System</span>
          </h1>
          {name === "student" ? (
            <StudentLogin />
          ) : name === "admin" ? (
            <AdminLogin />
          ) : name === "SAG" ? (
            <SAGLogin />
          ) : (
            <DefaultLogin /> // Optional fallback
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      toast.success("Admin logged in successfully!");
      localStorage.setItem("userRole", "admin");

      setTimeout(() => {
        navigate("/admin-dashboard", {

          state: { uid: userData.uid, role: "admin" },
        });
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="animate-fadeIn">
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
        <Link
          to="/signup"
          className="block w-full bg-blue-600 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95"
        >
          Sign Up
        </Link>
      </form>
      <div className="bg-gray-100 p-4 rounded-lg mt-6 border border-gray-300 text-gray-700">
        <h3 className="font-semibold mb-2">Sample Login Credentials:</h3>
        <p>Email: admin@gmail.com</p>
        <p>Password: 123456</p>
      </div>
    </div>
  );
};

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      toast.success("Student logged in successfully!");
      localStorage.setItem("userRole", "student");

      setTimeout(() => {
        navigate("/home", {
          state: { uid: userData.uid, role: "student" },
        });
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="animate-fadeIn">
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
        <Link
          to="/signup"
          className="block w-full bg-blue-600 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95"
        >
          Sign Up
        </Link>
      </form>
      <div className="bg-gray-100 p-4 rounded-lg mt-6 border border-gray-300 text-gray-700">
        <h3 className="font-semibold mb-2">Sample Login Credentials:</h3>
        <p>Email: Student@gmail.com</p>
        <p>Password: 123456</p>
      </div>
    </div>
  );
};

const SAGLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      toast.success("SAG logged in successfully!");

      setTimeout(() => {
        navigate("/sag-home-page", {
          state: { uid: userData.uid, role: "SAG" },
        });
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
        SAG Login
      </h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="SAG Email"
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
          Login as SAG
        </button>
        <Link
          to="/signup"
          className="block w-full bg-blue-600 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95"
        >
          Sign Up
        </Link>
      </form>
      <div className="bg-gray-100 p-4 rounded-lg mt-6 border border-gray-300 text-gray-700">
        <h3 className="font-semibold mb-2">Sample Login Credentials:</h3>
        <p>Email: sag@gmail.com</p>
        <p>Password: 123456</p>
      </div>
    </div>
  );
};

export default Login;

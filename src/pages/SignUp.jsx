import React, { useState, useEffect } from "react";
import { registerUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be greater than 5 characters.");
      return;
    }

    try {
      await registerUser(email, password, fullName, dob, phoneNumber);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to register. Please try again.");
    }
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
        <h1 className="text-4xl font-bold text-gray-800 mb-10">Sign Up</h1>
        <form onSubmit={handleSubmit} className="animate-fadeIn">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 mt-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;

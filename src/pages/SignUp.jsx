import React, { useState } from "react";
import { registerUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password, fullName, dob, phoneNumber);
      toast.success("Sign up successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to sign up. Please check your credentials.");
      setError("Signup failed. " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <ToastContainer />
      <div className="bg-gray-100 p-10 rounded-lg shadow-lg text-center w-[400px]">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Scholarship Portal
        </h1>
        <form onSubmit={handleSignup}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
            Student Signup
          </h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            type="email"
            placeholder="Student Email"
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
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 active:scale-95"
          >
            Signup as Student
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;

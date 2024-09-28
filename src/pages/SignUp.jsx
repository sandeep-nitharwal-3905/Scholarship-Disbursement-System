import React, { useState, useEffect } from "react";

const SignUp = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 transition"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
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
      </div>
    </div>
  );
};

export default SignUp;

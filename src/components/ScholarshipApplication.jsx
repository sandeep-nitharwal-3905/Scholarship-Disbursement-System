import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScholarshipApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scholarship } = location.state || {}; // Get the scholarship passed through navigation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [documents, setDocuments] = useState({}); // Store documents in an object

  const handleFileChange = (event, documentName) => {
    setDocuments((prev) => ({
      ...prev,
      [documentName]: event.target.files[0], // Store the file for the corresponding document
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement submission logic here
    toast.success("Application submitted successfully");
    navigate("/dashboard");
  };

  // Split the requiredDocuments string into an array
  const requiredDocuments = scholarship?.requiredDocuments[0].split(";") || [];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg transition-all duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Apply for {scholarship?.name}
      </h2>
      <button
        onClick={() => navigate("/viewScholarships")}
        className="mb-4 text-blue-600 hover:underline transition duration-200"
      >
        &larr; Back to Scholarships
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {requiredDocuments.map((documentName, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700">
              Upload {documentName.trim()}:
            </label>
            <input
              type="file"
              onChange={(event) => handleFileChange(event, documentName.trim())}
              required
              className="w-full p-2 border border-gray-300 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 transform hover:scale-105"
        >
          Submit Application
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ScholarshipApplication;

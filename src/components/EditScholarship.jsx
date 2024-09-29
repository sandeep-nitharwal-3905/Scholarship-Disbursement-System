import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFirebase } from "../firebase/FirebaseContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditScholarship = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scholarship } = location.state || {};
  const Firebase = useFirebase();

  const [name, setName] = useState(scholarship.name);
  const [eligibility, setEligibility] = useState(scholarship.eligibility);
  const [requiredDocuments, setRequiredDocuments] = useState(
    scholarship.requiredDocuments.join(";")
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Firebase.updateScholarship(scholarship.id, {
        name,
        eligibility,
        requiredDocuments: requiredDocuments.split(";"),
      });
      toast.success("Scholarship updated successfully");
      navigate("/admin-scholarship-list");
    } catch (error) {
      toast.error(`Error updating scholarship: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg transition-all duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Edit Scholarship
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Scholarship Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Eligibility:</label>
          <input
            type="text"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Required Documents (separated by ";"):
          </label>
          <input
            type="text"
            value={requiredDocuments}
            onChange={(e) => setRequiredDocuments(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Update Scholarship
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditScholarship;

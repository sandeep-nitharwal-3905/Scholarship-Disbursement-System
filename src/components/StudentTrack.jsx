import React, { useEffect, useState } from "react";
import { useFirebase } from "../firebase/FirebaseContext";
import { useNavigate } from "react-router-dom";

const StudentTrack = () => {
  const Firebase = useFirebase();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Firebase.fetchScholarships();
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, [Firebase]);

  const handleApply = (scholarship) => {
    // Navigate to the application form with the scholarship details
    navigate("/apply", { state: { scholarship } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-4xl w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Available Scholarships
        </h2>
        {loading ? ( // Show loading effect
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="mb-4 p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-bold">{scholarship.name}</h3>
              <p className="text-gray-700">{scholarship.eligibility}</p>
              <p className="text-gray-600">
                Required Documents: {scholarship.requiredDocuments.join(", ")}
              </p>
              <button
                onClick={() => handleApply(scholarship)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-colors duration-200 transform hover:scale-105"
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentTrack;

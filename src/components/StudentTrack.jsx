import React, { useEffect, useState } from "react";
import { useFirebase } from "../firebase/FirebaseContext";
import { useNavigate } from "react-router-dom";

const StudentTrack = () => {
  const Firebase = useFirebase();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Firebase.fetchScholarships();
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Firebase]);

  const handleApply = (scholarship) => {
    navigate("/apply", { state: { scholarship } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-4xl w-full p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Available Scholarships
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {scholarship.name}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Eligibility: </strong>
                {scholarship.eligibility}
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Required Documents: </strong>
                {scholarship.requiredDocuments.join(", ")}
              </p>
              <button
                onClick={() => handleApply(scholarship)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
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

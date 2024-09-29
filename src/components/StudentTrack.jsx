import React, { useEffect, useState } from "react";
import { useFirebase } from "../firebase/FirebaseContext";
import { useNavigate } from "react-router-dom";

const StudentTrack = () => {
    const Firebase = useFirebase();
    const [scholarships, setScholarships] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Firebase.fetchScholarships();
                setScholarships(data);
            } catch (error) {
                console.error("Error fetching scholarships:", error);
            }
        };
        fetchData();
    }, [Firebase]);

    const handleApply = (scholarship) => {
        // Navigate to the application form with the scholarship details
        navigate("/apply", { state: { scholarship } });
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Available Scholarships
            </h2>
            {scholarships.map((scholarship) => (
                <div key={scholarship.id} className="mb-4">
                    <h3 className="text-lg font-bold">{scholarship.name}</h3>
                    <p className="text-gray-700">{scholarship.eligibility}</p>
                    <p className="text-gray-600">
                        Required Documents: {scholarship.requiredDocuments.join(", ")}
                    </p>
                    <button
                        onClick={() => handleApply(scholarship)}
                        className="text-blue-500 hover:underline"
                    >
                        Apply
                    </button>
                </div>
            ))}
        </div>
    );
};

export default StudentTrack;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../Firebase";

const DocDetails = () => {
  const { id } = useParams(); // Get the document ID from the URL
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const firestore = getFirestore(app);
        const realtimeDb = getDatabase(app);

        // Fetch document data from Firestore
        const docRef = doc(firestore, "usersDocs", id);
        const docSnapshot = await getDoc(docRef);
        const docData = docSnapshot.exists() ? docSnapshot.data() : null;

        // Fetch user data from Realtime Database
        const userRef = ref(realtimeDb, `users/${id}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.exists() ? userSnapshot.val() : {};

        // Combine the data
        setDocument({
          id,
          ...docData,
          name: userData.fullName || "Unknown",
          email: userData.email || "No Email Provided",
        });
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Document not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Document Details
        </h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-700">
              <strong>UID:</strong> {document.id}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <strong>Name:</strong> {document.name}
            </p>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            <strong>Email:</strong> {document.email}
          </p>
          <h2 className="mt-6 text-xl font-bold text-gray-700">
            Document Data:
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner overflow-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(document, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocDetails;

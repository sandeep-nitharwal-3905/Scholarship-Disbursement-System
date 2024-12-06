import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const StatusBadge = ({ status }) => {
  const statusColors = {
    1: "bg-yellow-100 text-yellow-800",   // Pending
    2: "bg-green-100 text-green-800",     // Approved
    3: "bg-red-100 text-red-800"          // Rejected
  };

  const statusLabels = {
    1: "Pending Verification",
    2: "Approved",
    3: "Rejected"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
      {statusLabels[status] || 'Unknown Status'}
    </span>
  );
};

const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDocRef = doc(db, "usersDocs", uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data());
        } else {
          setError("No document found for this user.");
        }
      } catch (err) {
        console.error("Error fetching user document:", err);
        setError("Failed to fetch user document.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const renderDocumentInfo = (key, documentInfo) => {
    if (!documentInfo || typeof documentInfo !== 'object') return null;

    return (
      <div key={key} className="mb-4 p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold capitalize">
            {key.replace(/_/g, ' ')}
          </h3>
          <StatusBadge status={documentInfo.status} />
        </div>
        {documentInfo.url && (
          <div className="text-sm text-gray-600">
            <p>Uploaded on: {new Date(documentInfo.uploadTimestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!userData) return <div className="text-center p-4">No data found for this user.</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        My Documents
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(userData)
          .filter(([key, value]) => typeof value === 'object' && value !== null)
          .map(([key, documentInfo]) => renderDocumentInfo(key, documentInfo))}
      </div>
    </div>
  );
};

export default UserData;
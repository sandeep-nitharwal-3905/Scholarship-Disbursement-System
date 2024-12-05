import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
    return value;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No data found for this user.</div>;

  return (
    <div>
      <h1>User Data</h1>
      <div>
        {Object.keys(userData).map((key) => (
          <div key={key}>
            <strong>{key}:</strong> {renderValue(userData[key])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserData;

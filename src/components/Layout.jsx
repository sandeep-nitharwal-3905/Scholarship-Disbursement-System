import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import NewTopBar from "./NewTopBar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import AdminSidebar from "./AdminSide/AdminSidebar";
import { useFirebase } from "../firebase/FirebaseContext";

const Layout = ({ children }) => {
  const { user, logout } = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const db = getDatabase();

  useEffect(() => {
    // Retrieve uid from location.state or localStorage
    let uid = location.state?.uid || localStorage.getItem("uid");

    if (!uid) {
      // If no uid is found, navigate to login
      navigate("/login");
      return;
    }

    // Store the UID in localStorage to persist across pages
    localStorage.setItem("uid", uid);

    // Fetch user data from Firebase Realtime Database
    get(ref(db, "users/" + uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val()); // Set user data if it exists
        } else {
          navigate("/login"); // Navigate to login if user data doesn't exist
        }
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred while fetching user data.");
        navigate("/login"); // Navigate to login on error
      });
  }, [location.state, navigate, db]);

  if (!userData) {
    // Render a loading state while waiting for user data
    return <p>Loading user data...</p>;
  }
  if (userData.role == "student") {
    return (
      <div className="flex flex-col h-screen bg-white-100">
        <TopBar isNotification={true} />
        <NewTopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar user={userData} />
          <div className="flex-1 p-8 overflow-auto">{children}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col h-screen bg-white-100">
        <TopBar isNotification={true} />
        <NewTopBar />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar user={userData} />
          <div className="flex-1 p-8 overflow-auto">{children}</div>
        </div>
      </div>
    );
  }
};

export default Layout;

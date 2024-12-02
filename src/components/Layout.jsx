import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import NewTopBar from "./NewTopBar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import AdminSidebar from "./AdminSidebar";
import { useFirebase } from "../firebase/FirebaseContext";

const Layout = ({ children }) => {
  const { user, logout, fetchScholarships } = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();
  const db = getDatabase();
  const [userData, setUserData] = useState(null);
  // setUserData(fetchScholarships());
  // console.log(fetchScholarships());

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

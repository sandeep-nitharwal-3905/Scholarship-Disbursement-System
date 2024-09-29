import React, { useEffect, useState } from "react";
import { Users, GraduationCap, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import StatButton from "./StatButton";
import TrackStat from "./TrackStat";
import PhotoSlider from "./CursorSlider";
import NotificationPanel from "./NotificationPanel";
import SubmissionStatus from "./SubmissionStatus";
import { fetchUserData } from "../firebase/auth"; // Adjust the import path as needed
import { collection, query, where } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";
import { useFirebase } from "../context/Firebase";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const db = getDatabase();
  const firebase = useFirebase();

  // const uid = location.state.uid;

  // get(ref(db, "users/" + uid))
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log(snapshot.val());
  //     } else {
  //       navigate("/login");
  //       return;
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        {/* {userData && <p>Welcome, {userData.name}</p>}  */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatButton
          count={15}
          title="Documents Submitted"
          color="red"
          icon={Users}
        />
        <StatButton
          count={11}
          title="Documents Verified"
          color="green"
          icon={GraduationCap}
        />
        <StatButton
          count={69}
          title="Notifications"
          color="blue"
          icon={UserPlus}
        />
        <StatButton
          count={2}
          title="Scholarship Status"
          color="blue-100"
          icon={Users}
        />
      </div>
      <TrackStat status="3" />
      <PhotoSlider />
      <SubmissionStatus />
      <NotificationPanel />
    </div>
  );
};

export default Dashboard;

// Dashboard.js
import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import StatButton from "./StatButton";
import TrackStat from "./TrackStat";
import PhotoSlider from "./CursorSlider"; // Import the new component
import NotificationPanel from "./NotificationPanel"; // New Notification Panel Component
import SubmissionStatus from "./SubmissionStatus"; // New Submission Status Component
import { Users, GraduationCap, UserPlus } from "lucide-react";

const Dashboard = () => (
  <div className="flex flex-col h-screen bg-gray-100">
    <TopBar isNotification={true} />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatButton count={15} title="Documents Submitted" color="red" icon={Users} />
          <StatButton count={11} title="Documents Verified" color="green" icon={GraduationCap} />
          <StatButton count={69} title="Notifications" color="blue" icon={UserPlus} />
          <StatButton count={2} title="Scholarship Status" color="blue-100" icon={Users} />
        </div>
        
        {/* Add the PhotoSlider component here */}
        <PhotoSlider />

        {/* New Components */}
        <SubmissionStatus />
        <NotificationPanel />
        
        <TrackStat status="3" />
      </div>
    </div>
  </div>
);

export default Dashboard;

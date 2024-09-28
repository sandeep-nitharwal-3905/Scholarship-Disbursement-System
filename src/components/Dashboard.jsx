// Dashboard.jsx
import React from "react";
import StatButton from "./StatButton";
import TrackStat from "./TrackStat";
import PhotoSlider from "./CursorSlider";
import NotificationPanel from "./NotificationPanel";

import SubmissionStatus from "./SubmissionStatus";
import { Users, GraduationCap, UserPlus } from "lucide-react";

const Dashboard = () => (
  <div>
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatButton count={15} title="Documents Submitted" color="red" icon={Users} />
      <StatButton count={11} title="Documents Verified" color="green" icon={GraduationCap} />
      <StatButton count={69} title="Notifications" color="blue" icon={UserPlus} />
      <StatButton count={2} title="Scholarship Status" color="blue-100" icon={Users} />
    </div>
    <TrackStat status="3" />
    <PhotoSlider />
    <SubmissionStatus />
    <NotificationPanel />
  </div>
);

export default Dashboard;

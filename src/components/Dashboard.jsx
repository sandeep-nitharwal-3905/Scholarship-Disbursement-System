import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import StatButton from "./StatButton";
import TrackStat from "./TrackStat";
import { Users, GraduationCap, UserPlus } from "lucide-react";
const Dashboard = () => (
  <div className="flex flex-col h-screen bg-gray-100">
    <TopBar isNotification={false} />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatButton count={15} title="Text1" color="red" icon={Users} />
          <StatButton
            count={11}
            title="Text2"
            color="green"
            icon={GraduationCap}
          />
          <StatButton count={69} title="Text3" color="blue" icon={UserPlus} />
          <StatButton count={2} title="Text4" color="blue-100" icon={Users} />
        </div>
        <TrackStat status="3" />
      </div>
    </div>
  </div>
);

export default Dashboard;

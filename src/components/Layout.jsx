// Layout.jsx
import React from "react";
import TopBar from "./TopBar";
import NewTopBar from "./NewTopBar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-white-100">
      <TopBar isNotification={true} />
      <NewTopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;


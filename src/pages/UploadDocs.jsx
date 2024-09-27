import React from "react";
import NewTopBar from "../components/NewTopBar";
import NotificationPanel from "../components/NotificationPanel";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
function UploadDocs() {
  return (
    <>
      <TopBar isNotification={true} />
      <NewTopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
      </div>
    </>
  );
}

export default UploadDocs;

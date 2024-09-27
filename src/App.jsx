import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import UploadDocs from "./pages/UploadDocs"; // Import the new UploadDocs component
import Layout from "./components/Layout"; // Import the Layout component
// import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Layout>
        {/* Uncomment the desired component to display */}
        {/* <Login /> */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDocs />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

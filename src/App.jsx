import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import UploadDocs from "./pages/UploadDocs";
import Layout from "./components/Layout";
import Track from "./components/Track";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./components/AdminDashboard";
import AdminTrack from "./components/AdminTrack";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/upload" element={<UploadDocs />} />
                <Route path="/track" element={<Track />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-track" element={<AdminTrack />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

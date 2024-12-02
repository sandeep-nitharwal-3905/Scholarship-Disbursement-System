import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import UploadDocs from "./pages/UploadDocs";
import Layout from "./components/Layout";
import Track from "./components/Track";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./components/AdminDashboard";
import AdminTrack from "./components/AdminTrack";
import AdminSignup from "./pages/AdminSignup";
import AddScholarshipForm from "./components/AddScholarshipForm";
import ScholarshipList from "./components/ScholarshipList";
import StudentTrack from "./components/StudentTrack";
import ScholarshipApplication from "./components/ScholarshipApplication";
import "react-toastify/dist/ReactToastify.css";
import EditScholarship from "./components/EditScholarship";
const App = () => {
  return (
    <>
      <Analytics />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminSignup />} />

          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/upload" element={<UploadDocs />} />
                  <Route path="/track" element={<Track />} />
                  <Route
                    path="/editScholarship"
                    element={<EditScholarship />}
                  />
                  <Route
                    path="/admin-dashboard"
                    element={<AddScholarshipForm />}
                  />
                  <Route path="/apply" element={<ScholarshipApplication />} />
                  <Route path="/admin-track" element={<ScholarshipList />} />
                  <Route
                    path="/admin-scholarship-list"
                    element={<ScholarshipList />}
                  />
                  <Route path="/viewScholarships" element={<StudentTrack />} />
                  <Route
                    path="//admin-add-scholarship"
                    element={<AddScholarshipForm />}
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
};

export default App;

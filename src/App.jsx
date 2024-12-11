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
import AdminSignup from "./pages/AdminSignup";
import AddScholarshipForm from "./components/AdminSide/AddScholarshipForm";
import ScholarshipList from "./components/ScholarshipList";
import StudentTrack from "./components/StudentTrack";
import ScholarshipApplication from "./components/StudentSite/ScholarshipApplication";
import "react-toastify/dist/ReactToastify.css";
import EditScholarship from "./components/EditScholarship";
import DocsTrack from "./components/AdminSide/DocsTrack";
import DocsVerification from "./components/AdminSide/DocsVerification";
import DocDetails from "./components/DocsDetails";
import ApplicationsCheck from "./components/AdminSide/ApplicationsCheck";
import UpdatedDashboard from "./components/StudentSite/UpdatedDashboard";
import EKYC from "./components/EKYC";
import FAQ from "./pages/FAQ";
import DocumentDownload from './components/DocsDownload';
import AdminPanel from "./components/AdminSide/AdminPanel";
import SAGHomePage  from "./components/SAG/SAGHomePage";

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
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/upload" element={<UploadDocs />} />
                  <Route path="/track" element={<Track />} />
                  <Route path="/ekyc0" element={<EKYC />} />
                  <Route path="/ekyc1" element={<AdminPanel />} />
                  <Route path="/docs-track" element={<DocsTrack />} />
                  <Route
                    path="/docs-verification"
                    element={<DocsVerification />}
                  />
                  <Route path="/download-documents" element={<DocumentDownload />} />
                  <Route
                    path="/applications-check"
                    element={<ApplicationsCheck />}
                  />
                  <Route
                    path="/updatedDashboard"
                    element={<UpdatedDashboard />}
                  />
                  <Route path="/details/:id" element={<DocDetails />} />
                  <Route
                    path="/editScholarship"
                    element={<EditScholarship />}
                  />
                  <Route
                    path="/admin-dashboard"
                    element={<AddScholarshipForm />}
                  />
                  <Route
                    path="/sag-home-page"
                    element={<SAGHomePage />}
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

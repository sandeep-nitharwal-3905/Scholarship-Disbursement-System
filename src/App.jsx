import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import  Home  from "./components/Home";
import UploadDocs from "./pages/UploadDocs";
import Layout from "./components/Layout";
import Track from "./components/Track";
// import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDocs />} />
          <Route path="/track" element={<Track />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );

};

export default App;

import React, { useState, useEffect } from "react";
import "./Login.css";

const App = () => {
  const [role, setRole] = useState(""); // admin or student
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
  }, []);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setRole("");
  };

  return (
    <div className={`login-container ${isPageLoaded ? "loaded" : ""}`}>
      <h1 className="portal-title">Scholarship Portal</h1>
      {role === "" ? (
        <div className="role-selection">
          <h2>Select your role:</h2>
          <button
            className="role-button"
            onClick={() => handleSelectRole("admin")}
          >
            Admin
          </button>
          <button
            className="role-button"
            onClick={() => handleSelectRole("student")}
          >
            Student
          </button>
        </div>
      ) : role === "admin" ? (
        <AdminLogin onBack={handleBack} />
      ) : (
        <StudentLogin onBack={handleBack} />
      )}
    </div>
  );
};

const AdminLogin = ({ onBack }) => {
  return (
    <div className="login-form admin-form">
      <h2>Admin Login</h2>
      <input type="text" placeholder="Admin Username" />
      <input type="password" placeholder="Admin Password" />
      <button>Login as Admin</button>
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

const StudentLogin = ({ onBack }) => {
  return (
    <div className="login-form student-form">
      <h2>Student Login</h2>
      <input type="text" placeholder="Student ID" />
      <input type="password" placeholder="Password" />
      <button>Login as Student</button>
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default App;

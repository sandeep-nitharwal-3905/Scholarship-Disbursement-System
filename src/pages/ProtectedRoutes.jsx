import React from 'react';
import { Navigate } from 'react-router-dom';

// Example authentication and role check functions
// const isAuthenticated = () => {
//   // Replace this with your actual authentication logic
//   return localStorage.getItem('authToken') !== null;
// };

const getUserRole = () => {
  // Replace with your actual role fetching logic
  return localStorage.getItem('userRole'); // e.g., 'admin' or 'student'
};
const handleReturnHome = () => {
    // Basic navigation to home page
    window.location.href = "/forbidden";
  };
const ProtectedRoute = ({ element: Component, role, ...rest }) => {
//   if (!isAuthenticated()) {
//     return <Navigate to="/" replace />;
//   }

  const userRole = getUserRole();
  
  if (role && userRole !== role) {
    console.log('User role:', userRole);
    handleReturnHome();
    // Redirect to a "Not Authorized" page or the home page
    return <></>;
  }

  return Component;
};

export default ProtectedRoute;

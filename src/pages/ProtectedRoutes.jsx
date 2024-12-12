import React from 'react';
import { Navigate } from 'react-router-dom';

// Example authentication and role check functions
// const isAuthenticated = () => {
//   // Replace this with your actual authentication logic
//   return localStorage.getItem('authToken') !== null;
// };

const getUserRole = () => {
  // Replace with your actual role fetching logic
  console.log(localStorage.getItem('userRole'));
  return localStorage.getItem('userRole'); // e.g., 'admin' or 'student'
};

const ProtectedRoute = ({ element: Component, role, ...rest }) => {
//   if (!isAuthenticated()) {
//     return <Navigate to="/" replace />;
//   }

  const userRole = getUserRole();

  if (role && userRole !== role) {
    // Redirect to a "Not Authorized" page or the home page
    return <Navigate to="/" replace />;
  }

  return Component;
};

export default ProtectedRoute;

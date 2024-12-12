import React, { useState, useEffect } from "react";
import { Users, GraduationCap, FileText, PaperclipIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { 
  getAuth, 
  onAuthStateChanged 
} from "firebase/auth";
import StatButton from "./StatButton";
import PhotoSlider from "./CursorSlider";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  // State for tracking current user and dashboard statistics
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    documentsSubmitted: 0,
    documentsVerified: 0,
    applicationsSubmitted: 0,
    applicationsVerified: 0,
    passingCertificatesSubmitted: 0,
    passingCertificatesVerified: 0
  });

  // Comprehensive data fetching function (same as previous implementation)
  const fetchDashboardStatistics = async (uid) => {
    try {
      // Fetch documents collection
      const documentsRef = collection(db, 'usersDocs');
      const documentsQuery = query(documentsRef, where('id', '==', uid));
      const documentsSnapshot = await getDocs(documentsQuery);

      // Process document statistics
      const allDocuments = documentsSnapshot.docs.map(doc => doc.data());
      const submittedDocuments = allDocuments.filter(doc => 
        doc.status2 !== undefined
      );
      const verifiedDocuments = allDocuments.filter(doc => 
        doc.status2 === 2
      );
      console.log(submittedDocuments, verifiedDocuments);

      // Fetch user collection
      const usersRef = collection(db, 'scholarshipApplications');
      const userQuery = query(usersRef, where('userId', '==', uid));
      const userSnapshot = await getDocs(userQuery);

      // Process application and passing certificate statistics
      let applicationsSubmitted = 0;
      let applicationsVerified = 0;
      let passingCertificatesSubmitted = 0;
      let passingCertificatesVerified = 0;

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        
        // Check application status
        if (userData.reviewStatus === "approved") {
          applicationsVerified = 1;
        } else {
          // Count submitted stages (assuming any checked stage counts as submitted)
          if (userData.reviewStages) {
            applicationsSubmitted = Object.values(userData.reviewStages)
              .filter(stage => stage.checked === true)
              .length;
          }
        }
        
        // Process passing certificate status
        if (userData.passingCertificate) {
          const passingCertificate = userData.passingCertificate;
          
          if (passingCertificate.status === 3) {
            passingCertificatesVerified = 1;
          } else {
            passingCertificatesSubmitted = 1;
          }
        }
      }

      // Update dashboard statistics
      console.log(dashboardStats);
      setDashboardStats({
        documentsSubmitted: submittedDocuments.length,
        documentsVerified: verifiedDocuments.length,
        applicationsSubmitted,
        applicationsVerified,
        passingCertificatesSubmitted,
        passingCertificatesVerified
      });

    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        
        // Fetch stats using the current user's UID
        fetchDashboardStatistics(user.uid);
      } else {
        // User is signed out
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Redirect if no user
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 -z-10"></div>
      
      {/* Container with subtle shadow and rounded corners */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Slider Section */}
        <div className="mb-8">
          <PhotoSlider />
        </div>
        
        {/* Header Section */}
        <div className="px-6 md:px-10 py-6 bg-gray-100/50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              My Dashboard
            </h1>
            {currentUser && (
              <p className="text-gray-600 font-medium">
                Welcome, <span className="text-blue-600">{currentUser.email}</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Statistics Grid */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Documents Submitted */}
            <StatButton
              count={dashboardStats.documentsSubmitted}
              title="Documents Submitted"
              color="red"
              icon={FileText}
              className="hover:scale-105 transition-transform"
            />
            
            {/* Documents Verified */}
            <StatButton
              count={dashboardStats.documentsVerified}
              title="Documents Verified"
              color="green"
              icon={Users}
              className="hover:scale-105 transition-transform"
            />
            
            {/* Applications Submitted */}
            <StatButton
              count={dashboardStats.applicationsSubmitted}
              title="Applications Submitted"
              color="blue"
              icon={GraduationCap}
              className="hover:scale-105 transition-transform"
            />
            
            {/* Applications Verified */}
            <StatButton
              count={dashboardStats.applicationsVerified}
              title="Applications Verified"
              color="purple"
              icon={Users}
              className="hover:scale-105 transition-transform"
            />
            
            {/* Passing Certificates Submitted */}
            <StatButton
              count={dashboardStats.passingCertificatesSubmitted}
              title="Passing Certificates Submitted"
              color="orange"
              icon={PaperclipIcon}
              className="hover:scale-105 transition-transform"
            />
            
            {/* Passing Certificates Verified */}
            <StatButton
              count={dashboardStats.passingCertificatesVerified}
              title="Passing Certificates Verified"
              color="green-100"
              icon={PaperclipIcon}
              className="hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
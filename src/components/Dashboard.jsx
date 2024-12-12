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

  // Comprehensive data fetching function
  const fetchDashboardStatistics = async (uid) => {
    try {
      // Fetch documents collection
      const documentsRef = collection(db, 'usersDocs');
      const documentsQuery = query(documentsRef, where('id', '==', uid));
      const documentsSnapshot = await getDocs(documentsQuery);

      // Process document statistics
      const allDocuments = documentsSnapshot.docs.map(doc => doc.data());
      const submittedDocuments = allDocuments.filter(doc => 
        doc.status === 1
      );
      const verifiedDocuments = allDocuments.filter(doc => 
        doc.status === 2
      );

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PhotoSlider />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        {currentUser && <p>Welcome, {currentUser.email}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Documents Submitted */}
        <StatButton
          count={dashboardStats.documentsSubmitted}
          title="Documents Submitted"
          color="red"
          icon={FileText}
        />
        
        {/* Documents Verified */}
        <StatButton
          count={dashboardStats.documentsVerified}
          title="Documents Verified"
          color="green"
          icon={Users}
        />
        
        {/* Applications Submitted */}
        <StatButton
          count={dashboardStats.applicationsSubmitted}
          title="Applications Submitted"
          color="blue"
          icon={GraduationCap}
        />
        
        {/* Applications Verified */}
        <StatButton
          count={dashboardStats.applicationsVerified}
          title="Applications Verified"
          color="purple"
          icon={Users}
        />
        
        {/* Passing Certificates Submitted */}
        <StatButton
          count={dashboardStats.passingCertificatesSubmitted}
          title="Passing Certificates Submitted"
          color="orange"
          icon={PaperclipIcon}
        />
        
        {/* Passing Certificates Verified */}
        <StatButton
          count={dashboardStats.passingCertificatesVerified}
          title="Passing Certificates Verified"
          color="green-100"
          icon={PaperclipIcon}
        />
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";
import {
  ClipboardList,
  Eye,
  Check,
  X,
  FileText,
  Clock,
  Search,
  Filter,
  AlertTriangle
} from "lucide-react";

const ReviewModal = ({ application, onClose, onReviewComplete }) => {
  const [reviewStages, setReviewStages] = useState({});
  const [activeStage, setActiveStage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (application?.reviewStages) {
      setReviewStages(application.reviewStages);
    }
  }, [application]);

  const updateStageStatus = (stage, field, value) => {
    setReviewStages((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [field]: value,
      },
    }));
  };

  const handleFinalReview = () => {
    const allStagesChecked = Object.values(reviewStages).every((stage) => stage.checked);
    onReviewComplete({
      reviewStages,
      reviewStatus: allStagesChecked ? "approved" : "pending",
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    onReviewComplete({
      reviewStages: reviewStages,
      reviewStatus: "rejected",
      rejectionReason: rejectionReason.trim(),
    });
  };

  const stages = [
    { key: 'preliminaryScreening', label: 'Preliminary Screening' },
    { key: 'eligibilityVerification', label: 'Eligibility Verification' },
    { key: 'documentAuthentication', label: 'Document Authentication' },
    { key: 'personalStatementReview', label: 'Personal Statement Review' },
    { key: 'referenceCheck', label: 'Reference Check' },
    { key: 'academicReview', label: 'Academic Review' },
    { key: 'financialNeedAssessment', label: 'Financial Need Assessment' },
    { key: 'interviewAssessment', label: 'Interview Assessment' },
    { key: 'finalApproval', label: 'Final Approval' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-6xl h-5/6 rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Application Details */}
        <div className="w-1/2 p-8 overflow-y-auto bg-gray-50 border-r">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 flex items-center">
            <FileText className="mr-3 text-blue-500" />
            Application Details
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Personal Information</h3>
              <p><strong>Name:</strong> {application.name}</p>
              <p><strong>Email:</strong> {application.email}</p>
              <p><strong>Contact:</strong> {application.contactNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Academic Information</h3>
              <p><strong>Course:</strong> {application.courseOfStudy}</p>
              <p><strong>School:</strong> {application.schoolName}</p>
              <p><strong>GPA:</strong> {application.gpa}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Additional Details</h3>
              <p><strong>Roll Number:</strong> {application.registrationNumber}</p>
              <p><strong>Annual Income:</strong> ₹{application.annualIncome}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Review Stages */}
        <div className="w-1/2 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 flex items-center">
            <ClipboardList className="mr-3 text-blue-500" />
            Review Stages
          </h2>
          <div className="space-y-4">
            {stages.map((stage) => {
              const stageData = reviewStages[stage.key] || {};
              return (
                <div 
                  key={stage.key} 
                  className={`p-4 rounded-lg transition-all ${
                    activeStage === stage.key 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } border`}
                >
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setActiveStage(activeStage === stage.key ? null : stage.key)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 rounded focus:ring-blue-500"
                        checked={stageData.checked || false}
                        onChange={(e) => updateStageStatus(stage.key, "checked", e.target.checked)}
                      />
                      <span className={`font-semibold ${stageData.checked ? 'text-green-600' : 'text-gray-700'}`}>
                        {stage.label}
                      </span>
                    </div>
                    {stageData.checked ? (
                      <Check className="text-green-500" />
                    ) : (
                      <Clock className="text-gray-400" />
                    )}
                  </div>
                  {activeStage === stage.key && (
                    <textarea
                      value={stageData.notes || ''}
                      onChange={(e) => updateStageStatus(stage.key, "notes", e.target.value)}
                      placeholder="Add detailed notes..."
                      className="w-full mt-4 p-2 border rounded focus:ring-blue-500"
                      rows={3}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Rejection Section */}
          {isRejecting ? (
            <div className="mt-6 bg-red-50 p-4 rounded-lg">
              <div className="flex items-center mb-4 text-red-600">
                <AlertTriangle className="mr-2" />
                <h3 className="font-semibold">Reject Application</h3>
              </div>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a detailed reason for rejecting the application..."
                className="w-full p-2 border rounded focus:ring-red-500"
                rows={4}
              />
            </div>
          ) : null}

          <div className="flex justify-between mt-6">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <div className="space-x-4">
              {!isRejecting ? (
                <button 
                  onClick={() => setIsRejecting(true)} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              ) : (
                <button 
                  onClick={handleReject} 
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  Confirm Rejection
                </button>
              )}
              <button 
                onClick={handleFinalReview} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "scholarshipApplications"));
        const applicationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(applicationsList);
        setFilteredApplications(applicationsList);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    let result = applications;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(app => app.reviewStatus === filterStatus);
    }

    setFilteredApplications(result);
  }, [searchTerm, filterStatus, applications]);

  const handleReviewComplete = async (reviewData) => {
    try {
      const applicationRef = doc(db, "scholarshipApplications", selectedApplication.id);

      // Prepare email details
      const emailDetails = prepareEmailDetails(reviewData, selectedApplication);

      // Send email via your existing server endpoint
      await axios.post('http://localhost:5000/send-application-update-email', {
        email: selectedApplication.email,
        ...emailDetails
      });

      // Update Firestore document
      await updateDoc(applicationRef, reviewData);

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id ? { ...app, ...reviewData } : app
        )
      );
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application. Please try again.");
    }
  };

  // Helper function to prepare email details
  const prepareEmailDetails = (reviewData, application) => {
    let subject = "Scholarship Application Status Update";
    let body = `Dear ${application.name},\n\n`;

    if (reviewData.reviewStatus === 'approved') {
      body += `We are pleased to inform you that your scholarship application has been approved.\n\n`;

      // Add details about review stages
      if (reviewData.reviewStages) {
        body += "Review Stages Completed:\n";
        Object.entries(reviewData.reviewStages).forEach(([stage, stageData]) => {
          if (stageData.checked) {
            body += `- ${stage.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}\n`;
          }
        });
      }
    } else if (reviewData.reviewStatus === 'rejected') {
      subject = "Scholarship Application Rejection";
      body += `We regret to inform you that your scholarship application has been rejected.\n\n`;

      if (reviewData.rejectionReason) {
        body += `Reason for Rejection: ${reviewData.rejectionReason}\n`;
      }
    } else {
      body += `Your application is currently under review.\n`;
    }

    body += "\nBest regards,\nScholarship Committee";

    return { subject, body };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center">
            <ClipboardList className="mr-3" /> Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td className="px-4 py-2 text-gray-700">{application.name}</td>
                  <td className={`px-4 py-2 ${getStatusColor(application.reviewStatus)}`}>
                    {application.reviewStatus || 'Pending'}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsReviewModalOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          application={selectedApplication}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

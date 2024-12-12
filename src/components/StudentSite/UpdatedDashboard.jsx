import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useFirebase } from "../../firebase/FirebaseContext";
import {
    GraduationCap,
    FileText,
    Check,
    X,
    Clock
} from "lucide-react";

const ScholarshipData = () => {
    const { user } = useFirebase();
    const [scholarshipData, setScholarshipData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore();
    
    useEffect(() => {
        const fetchAllScholarshipData = async () => {
            try {
                // Get all documents from the "scholarshipApplications" collection
                const scholarshipRef = collection(db, "scholarshipApplications");
                const querySnapshot = await getDocs(scholarshipRef);
                const applications = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().userId == user.uid) {
                      applications.push({
                        id: doc.id,
                        ...doc.data(), // This will include all fields of the scholarship application
                    });
                    }
                });

                setScholarshipData(applications);
            } catch (err) {
                console.error("Error fetching scholarship documents:", err);
                setError("Failed to fetch scholarship data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllScholarshipData();
    }, [db]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <Check className="text-green-500" />;
            case 'rejected':
                return <X className="text-red-500" />;
            default:
                return <Clock className="text-yellow-500" />;
        }
    };

    const renderReviewStages = (reviewStages) => {
        if (!reviewStages) return null;

        const stages = [
            { key: 'preliminaryScreening', label: 'Preliminary Screening' },
            { key: 'eligibilityVerification', label: 'Eligibility Verification' },
            { key: 'documentAuthentication', label: 'Document Authentication' },
            // { key: 'personalStatementReview', label: 'Personal Statement Review' },
            // { key: 'referenceCheck', label: 'Reference Check' },
            { key: 'academicReview', label: 'Academic Review' },
            // { key: 'financialNeedAssessment', label: 'Financial Need Assessment' },
            // { key: 'interviewAssessment', label: 'Interview Assessment' },
            { key: 'finalApproval', label: 'Final Approval' }
        ];

        return (
            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FileText className="mr-2 text-blue-600" /> Review Stages
                </h2>
                <div className="space-y-3">
                    {stages.map((stage) => {
                        const isComplete = reviewStages[stage.key]?.checked;
                        const iconClass = isComplete ? 'text-green-500' : 'text-gray-400'; // Green if checked
                        const statusClass = isComplete ? 'text-green-600' : 'text-gray-500'; // Green if checked
                        const statusText = isComplete ? 'Completed' : 'Pending';

                        return (
                            <div
                                key={stage.key}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <Check className={`mr-3 ${iconClass}`} />
                                    <span className={`font-medium text-gray-700 ${isComplete ? 'text-green-600' : ''}`}>
                                        {stage.label}
                                    </span>
                                </div>
                                <span className={`text-sm ${statusClass}`}>
                                    {statusText}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <X className="mx-auto mb-4 text-red-500" size={48} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (scholarshipData.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <Clock className="mx-auto mb-4 text-yellow-500" size={48} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Applications</h2>
                    <p className="text-gray-600">No scholarship applications found.</p>
                </div>
            </div>
        );
    }
return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-4xl">
            {scholarshipData.map((application) => {
                // Only render application if the userId matches the allowed userId
                if (application.userId !== user.uid&&application.userId ===undefined) {
                    // console.log(application.userId, user.uid,);
                    return null; 
                }

                return (
                    <div key={application.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <GraduationCap className="mr-3" size={36} />
                                <h2 className="text-2xl font-bold text-gray-800">{application.name}</h2>
                            </div>
                            <div className="flex items-center">
                                {getStatusIcon(application.reviewStatus)}
                                <span className="ml-2 text-gray-700 font-semibold capitalize">
                                    {application.reviewStatus || 'Pending'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Applicant Information</h3>
                                <div className="space-y-2">
                                    <p><strong>Course of Study:</strong> {application.courseOfStudy}</p>
                                    <p><strong>School:</strong> {application.schoolName}</p>
                                    <p><strong>GPA:</strong> {application.gpa}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Application Details</h3>
                                <div className="space-y-2">
                                    <p><strong>Submitted On:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
                                    <p><strong>Annual Income:</strong> ₹{application.annualIncome}</p>
                                </div>
                            </div>
                        </div>

                        {/* Render Review Stages */}
                        {renderReviewStages(application.reviewStages)}
                    </div>
                );
            })}
        </div>
    </div>
);
};

export default ScholarshipData;
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
    GraduationCap,
    FileText,
    Check,
    X,
    Clock
} from "lucide-react";

const ScholarshipData = () => {
    const [scholarshipData, setScholarshipData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchScholarshipData = async (uid) => {
            try {
                const scholarshipDocRef = doc(db, "scholarshipApplications", uid);
                const docSnapshot = await getDoc(scholarshipDocRef);

                if (docSnapshot.exists()) {
                    setScholarshipData(docSnapshot.data());
                } else {
                    setError("No scholarship document found.");
                }
            } catch (err) {
                console.error("Error fetching scholarship document:", err);
                setError("Failed to fetch scholarship document.");
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchScholarshipData(user.uid);
            } else {
                setScholarshipData(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

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

    const renderReviewStages = () => {
        if (!scholarshipData?.reviewStages) return null;

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
            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FileText className="mr-2 text-blue-600" /> Review Stages
                </h2>
                <div className="space-y-3">
                    {stages.map((stage) => {
                        const isComplete = scholarshipData.reviewStages[stage.key]?.checked;
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

    if (!scholarshipData) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <Clock className="mx-auto mb-4 text-yellow-500" size={48} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data</h2>
                    <p className="text-gray-600">No scholarship data found for this user.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <GraduationCap className="mr-3" size={36} />
                        Scholarship Application
                    </h1>
                    <div className="flex items-center">
                        {getStatusIcon(scholarshipData.reviewStatus)}
                        <span className="ml-2 text-white font-semibold capitalize">
                            {scholarshipData.reviewStatus || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Application Details */}
                <div className="bg-white shadow-md rounded-b-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Applicant Information
                            </h2>
                            <div className="space-y-2">
                                <p>
                                    <strong className="text-gray-600">Name:</strong> {scholarshipData.name}
                                </p>
                                <p>
                                    <strong className="text-gray-600">Course of Study:</strong> {scholarshipData.courseOfStudy}
                                </p>
                                <p>
                                    <strong className="text-gray-600">School:</strong> {scholarshipData.schoolName}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Application Details
                            </h2>
                            <div className="space-y-2">
                                <p>
                                    <strong className="text-gray-600">Submitted On:</strong>{" "}
                                    {new Date(scholarshipData.submittedAt).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className="text-gray-600">GPA:</strong> {scholarshipData.gpa}
                                </p>
                                <p>
                                    <strong className="text-gray-600">Annual Income:</strong> ₹{scholarshipData.annualIncome}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Review Stages */}
                    {renderReviewStages()}
                </div>
            </div>
        </div>
    );
};

export default ScholarshipData;
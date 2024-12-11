import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import { ArrowLeft } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { doc, setDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { db } from "../../Firebase";

const ScholarshipApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scholarship } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    registrationNumber: "",
    schoolName: "",
    fatherName: "",
    address: "",
    annualIncome: "",
    dateOfBirth: null,
    gpa: "",
    extracurriculars: "",
    courseOfStudy: "",
    contactNumber: "",
    documents: {},
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleFileChange = (event, documentName) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentName]: event.target.files[0],
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Get the current user UID from Firebase Authentication
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      toast.error("User not logged in. Please log in to submit your application.");
      return;
    }
  
    // Validate required documents
    for (let doc of requiredDocuments) {
      if (!formData.documents[doc.trim()]) {
        toast.error(`Please upload ${doc.trim()}`);
        return;
      }
    }
  
    try {
      // Generate a unique ID for this application
      const applicationRef = doc(collection(db, "scholarshipApplications"));
  
      // Convert file objects to base64 for storage
      const documentsBase64 = {};
      for (const [docName, file] of Object.entries(formData.documents)) {
        documentsBase64[docName] = await convertFileToBase64(file);
      }
  
      // Initialize review stages and review notes
      const reviewStages = {
        academicReview: { checked: false },
        documentAuthentication: { checked: false },
        eligibilityVerification: { checked: false },
        finalApproval: { checked: false },
        financialNeedAssessment: { checked: false },
        interviewAssessment: { checked: false },
        personalStatementReview: { checked: false },
        preliminaryScreening: { checked: false },
        referenceCheck: { checked: false },
      };
  
      const reviewNotes = {
        academicReview: "",
        documentAuthentication: "",
        eligibilityVerification: "",
        finalApproval: "",
        financialNeedAssessment: "",
        interviewAssessment: "",
        personalStatementReview: "",
        preliminaryScreening: "",
        referenceCheck: "",
      };
  
      // Save form data to Firestore with unique application ID
      await setDoc(applicationRef, {
        ...formData,
        scholarshipId: scholarship?.id, // Store the scholarship ID
        scholarshipName: scholarship?.name, // Optionally include the name
        documents: documentsBase64,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        submittedAt: new Date().toISOString(),
        reviewNotes, // Store empty notes for each stage
        reviewStages, // Store stages and their checked status
        reviewStatus: "pending", // Initial review status
        userId: user.uid, // Store the UID of the logged-in user
      });
  
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };
  

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Split the requiredDocuments string into an array and add more documents
  const additionalDocuments = [
    "Transcript",
    "Recommendation Letter",
    "Personal Statement",
  ];
  const requiredDocuments =
    scholarship?.requiredDocuments[0]
      .split(";")
      .map((doc) => doc.trim())
      .concat(additionalDocuments) || [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Apply for {scholarship?.name}
            </h2>
            <button
              onClick={() => navigate("/viewScholarships")}
              className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="School Name"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    textarea
                  />
                </div>
                <InputField
                  label="Annual Income ($)"
                  name="annualIncome"
                  type="number"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={formData.dateOfBirth}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholderText="Select your date of birth"
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    required
                  />
                </div>
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="GPA"
                  name="gpa"
                  type="number"
                  step="0.01"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Course of Study"
                  name="courseOfStudy"
                  value={formData.courseOfStudy}
                  onChange={handleInputChange}
                  required
                />
                <div className="md:col-span-2">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="extracurriculars"
                      className="text-sm font-medium text-gray-700"
                    >
                      Extracurricular Activities
                    </label>
                    <textarea
                      id="extracurriculars"
                      name="extracurriculars"
                      value={formData.extracurriculars}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Upload */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Upload Required Documents
              </h3>
              <div className="space-y-4">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={(event) => handleFileChange(event, doc)}
                      className="hidden"
                      id={`file-${doc}`}
                    />
                    <label
                      htmlFor={`file-${doc}`}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                    >
                      {doc}
                    </label>
                    {formData.documents[doc] && (
                      <span className="text-sm text-green-600">
                        {formData.documents[doc].name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

const InputField = ({ label, name, value, onChange, required, type = "text", textarea }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    {textarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        required={required}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        required={required}
      />
    )}
  </div>
);

export default ScholarshipApplication;

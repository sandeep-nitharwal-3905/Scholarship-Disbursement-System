import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Adjust path if firebase.js is in a different folder
import app from "../Firebase";
import { db } from "../Firebase";

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

    // Validate required documents
    for (let doc of requiredDocuments) {
      if (!formData.documents[doc.trim()]) {
        toast.error(`Please upload ${doc.trim()}`);
        return;
      }
    }

    try {
      // Reference Firestore document
      const docRef = doc(db, "scholarshipApplications", formData.email);

      // Convert file objects to base64 for storage
      const documentsBase64 = {};
      for (const [docName, file] of Object.entries(formData.documents)) {
        documentsBase64[docName] = await convertFileToBase64(file);
      }

      // Save form data to Firestore
      await setDoc(docRef, {
        ...formData,
        documents: documentsBase64,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        submittedAt: new Date().toISOString(),
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
                      required
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      rows={4}
                      placeholder="Describe your extracurricular activities"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <Upload className="mr-2" size={20} /> Required Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requiredDocuments.map((documentName, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {documentName}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(event) =>
                          handleFileChange(event, documentName)
                        }
                        required
                        accept=".pdf,.doc,.docx,image/*"
                        className="sr-only"
                        id={`file-${index}`}
                      />
                      <label
                        htmlFor={`file-${index}`}
                        className="w-full cursor-pointer bg-blue-50 border border-blue-200 text-blue-600 rounded-md px-4 py-2 flex items-center justify-center hover:bg-blue-100 transition duration-200"
                      >
                        <Upload className="mr-2" size={18} />
                        {formData.documents[documentName] ? (
                          <span>
                            {formData.documents[documentName].name.length > 20
                              ? `${formData.documents[documentName].name.slice(
                                0,
                                17
                              )}...`
                              : formData.documents[documentName].name}
                          </span>
                        ) : (
                          "Choose File"
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <Upload size={20} />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  textarea = false,
  ...props
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    {textarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      ></textarea>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />
    )}
  </div>
);

export default ScholarshipApplication;

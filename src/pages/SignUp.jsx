import React, { useState } from "react";
import { registerUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, FileUp, User, Lock } from "lucide-react";

const Signup = () => {
  // Personal Information State
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);

  // Contact Information State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Academic and Financial Information State
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [income, setIncome] = useState("");

  // Address State
  const [address, setAddress] = useState("");

  // Document Upload State
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [incomeProofFile, setIncomeProofFile] = useState(null);
  const [collegeIdFile, setCollegeIdFile] = useState(null);

  // Error and Navigation
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Age Calculation and Validation
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDobChange = (e) => {
    const selectedDate = e.target.value;
    setDob(selectedDate);
    const calculatedAge = calculateAge(selectedDate);
    setAge(calculatedAge);
  };

  const handleFileUpload = (e, setFileFunction) => {
    const file = e.target.files[0];
    if (file) {
      // Enhanced file validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (file.size > maxSize) {
        toast.error("File size should be less than 5MB");
        e.target.value = null; // Reset file input
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed");
        e.target.value = null; // Reset file input
        return;
      }

      setFileFunction(file);
    }
  };

  const validateForm = () => {
    // Comprehensive form validation
    if (age < 16) {
      toast.error("You must be at least 16 years old to register");
      return false;
    }

    if (!aadharNumber || !panNumber) {
      toast.error("Please provide Aadhar and PAN card numbers");
      return false;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error("Mobile number must be 10 digits");
      return false;
    }

    if (!/^\d{12}$/.test(aadharNumber)) {
      toast.error("Aadhar number must be 12 digits");
      return false;
    }

    if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(panNumber)) {
      toast.error("Invalid PAN card number format");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare document upload logic 
      const documentUrls = await uploadDocuments();

      await registerUser(email, password, {
        firstName,
        middleName,
        lastName,
        fatherName,
        dob,
        age,
        mobileNumber,
        institution,
        course,
        cgpa,
        income,
        address,
        aadharNumber,
        panNumber,
        documentUrls,
      });

      toast.success("Sign up successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to sign up. Please check your credentials.");
      setError("Signup failed. " + error.message);
    }
  };

  const uploadDocuments = async () => {
    // Enhanced document upload logic with error handling
    try {
      return {
        aadharUrl: aadharFile ? await uploadFile(aadharFile, "aadhar") : null,
        panUrl: panFile ? await uploadFile(panFile, "pan") : null,
        incomeProofUrl: incomeProofFile
          ? await uploadFile(incomeProofFile, "income-proof")
          : null,
        collegeIdUrl: collegeIdFile
          ? await uploadFile(collegeIdFile, "college-id")
          : null,
      };
    } catch (error) {
      toast.error("Document upload failed");
      throw error;
    }
  };

  const uploadFile = async (file, fileType) => {
    // Improved file upload placeholder
    // Replace with actual Firebase or cloud storage upload logic
    if (!file) {
      throw new Error(`No ${fileType} file provided`);
    }
    
    // Simulate async upload 
    return new Promise((resolve) => {
      // Simulated upload delay
      setTimeout(() => {
        resolve(`placeholder-url-for-${fileType}`);
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Scholarship Portal Signup
        </h1>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Login Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <Lock className="mr-2" /> Login Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
                minLength="8"
                title="Password must be at least 8 characters long"
              />
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <User className="mr-2" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Father's Name"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="w-full p-3 mt-4 rounded-lg border border-gray-300"
            />
          </div>

          {/* Contact and Age Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <Calendar className="mr-2" /> Date of Birth and Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {/* <label className="block text-sm mb-2">Date of Birth</label> */}
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                />
                {age !== null && (
                  <p className="text-sm text-gray-600 mt-2">
                    Your Age: {age} years
                  </p>
                )}
              </div>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <FileUp className="mr-2" /> Academic & Financial Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="School/College Name"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
              <input
                type="text"
                placeholder="Course of Study"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
              <input
                type="number"
                placeholder="CGPA"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                step="0.01"
                min="0"
                max="10"
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
            </div>
            <input
              type="number"
              placeholder="Annual Family Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full p-3 mt-4 rounded-lg border border-gray-300"
              required
            />
          </div>

          {/* Address Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Address Details
            </h2>
            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          {/* Document Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Document Uploads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Aadhar Card Number"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  className="w-full p-3 mb-2 rounded-lg border border-gray-300"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setAadharFile)}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="PAN Card Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full p-3 mb-2 rounded-lg border border-gray-300"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setPanFile)}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2">Income Proof</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setIncomeProofFile)}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block mb-2">College ID</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setCollegeIdFile)}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg mt-6 hover:bg-blue-800 transition-colors"
          >
            Create Scholarship Account
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;

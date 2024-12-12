import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User, Mail, Phone, Calendar, Lock, MapPin,
  Upload, CheckCircle, XCircle
} from "lucide-react";
import axios from "axios";
import {
  getAuth, RecaptchaVerifier, createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
// import { getDatabase, set, get } from "firebase/database";
import { ref, get, query, orderByChild, equalTo,getDatabase, set } from "firebase/database";

import app from "../Firebase";
import { collection, where, getDocs } from "firebase/firestore";
const auth = getAuth(app);
const database = getDatabase(app);


const ScholarshipSignup = () => {
  // Personal Information State
  const [fullName, setFullName] = useState("");
  const [kyc, setKyc] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [role, setRole] = useState("student");

  // Address State
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });

  // Authentication State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Additional Information State
  const [income, setIncome] = useState("");
  const [collegeInfo, setCollegeInfo] = useState({
    institutionName: "",
    course: "",
    cgpa: ""
  });

  // Terms and Conditions
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  // Age Calculation Function
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

  // Date of Birth Change Handler
  const handleDobChange = (e) => {
    const selectedDate = e.target.value;
    setDob(selectedDate);
    const calculatedAge = calculateAge(selectedDate);
    setAge(calculatedAge);
  };

  // Form Validation
  const validateForm = () => {
    if (!fullName) {
      toast.error("Please enter your full name");
      return false;
    }

    if (age && age < 16) {
      toast.error("You must be at least 16 years old to register");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return false;
    }

    return true;
  };

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!handleVerifyOTP()) {
      return;
    }

    try {
      // Step 1: Create user with email & password (Firebase Authentication)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Store additional user information in Firestore
      await set(ref(database, "users/" + user.uid), {
        fullName,
        email,
        phoneNumber,
        dob,
        age,
        gender,
        address,
        income,
        collegeInfo,
        createdAt: new Date(),
        kyc,
        role
      });
      toast.success("Sign up successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already in use. Please use a different email.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use a stronger password.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email address. Please enter a valid email.");
      } else {
        console.error("Firebase signup error:", error.message);
        toast.error("Signup failed: " + error.message);
      }
    }
  };

  // Reset Form
  const handleReset = () => {
    setFullName("");
    setUsername("");
    setEmail("");
    setPhoneNumber("");
    setDob("");
    setAge(null);
    setGender("");
    setAddress({ street: "", city: "", state: "", zipCode: "" });
    setPassword("");
    setConfirmPassword("");
    setProfilePicture(null);
    setIncome("");
    setCollegeInfo({ institutionName: "", course: "", cgpa: "" });
    setAgreeTerms(false);
  };
  const handleGenerateOTP = async () => {
    if (!validateForm()) {
      return;
    }
  
    try {
      setLoading(true);
      setError("");

      // Check if email already exists in Realtime Database
      const usersRef = ref(database, "users"); // Adjust the path if your user data is stored elsewhere
      const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const snapshot = await get(emailQuery);
        console.log(snapshot.exists())
      if (snapshot.exists()) {
        toast.error("A user with this email already exists. Please use a different email.");
        return;
      }
      // Proceed with OTP generation
      const response = await fetch("http://172.16.11.157:5007/generate-otp-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "+91" + phoneNumber,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("OTP generation failed:", data.error);
        throw new Error(data.error || "Failed to generate OTP");
      }
  
      console.log("OTP sent successfully");
      setSuccessMessage("OTP sent successfully to your email");
      setStep(2); // Move to the next step
    } catch (err) {
      console.error("Error during OTP generation:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // const handleGenerateOTP = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const response = await fetch("http://172.16.11.157:5007/generate-otp-phone", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         phoneNumber: "+91" + phoneNumber
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       console.error("OTP generation failed:", data.error);
  //       throw new Error(data.error || "Failed to generate OTP");
  //     }

  //     console.log("OTP sent successfully");
  //     setSuccessMessage("OTP sent successfully to your email");
  //     setStep(2); // Move to the next step
  //   } catch (err) {
  //     console.error("Error during OTP generation:", err.message);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://172.16.11.157:5007/verify-otp-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "+91" + phoneNumber,
          otp
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }
      setSuccessMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.message);
      return false
    } finally {
      setLoading(false);
      return true
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Scholarship Portal Signup
        </h1>

        <form onSubmit={handleSignup} className="space-y-6">
          {step === 1 && <>
            {/* Personal Information Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <User className="mr-2" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                />
                {/* </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"> */}
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                />
                {age !== null && (
                  <p className="p-3 text-gray-600">Age: {age} years</p>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <Mail className="mr-2" /> Contact Information
              </h2>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-md shadow-md mt-6">
  <p className="font-semibold text-lg mb-2">Please Note:</p>
  <p className="text-base">
    For non-paid API SMS service, you can use only the following number: <span className="font-bold">9434589888</span>
  </p>
</div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <MapPin className="mr-2" /> Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            {/* College and Income Information */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                Educational & Financial Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="College/Institution Name"
                  value={collegeInfo.institutionName}
                  onChange={(e) => setCollegeInfo({ ...collegeInfo, institutionName: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="Course of Study"
                  value={collegeInfo.course}
                  onChange={(e) => setCollegeInfo({ ...collegeInfo, course: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                <input
                  type="number"
                  placeholder="CGPA"
                  value={collegeInfo.cgpa}
                  onChange={(e) => setCollegeInfo({ ...collegeInfo, cgpa: e.target.value })}
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
              </div>
              <input
                type="number"
                placeholder="Annual Family Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full p-3 mt-4 rounded-lg border border-gray-300"
              />
            </div>

            {/* Authentication Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <Lock className="mr-2" /> Account Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                  minLength="8"
                />
                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the Terms and Conditions
              </label>
            </div></>}

          {/* OTP Section */}
          {step === 2 && <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <User className="mr-2" /> Enter OTP
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
            </div>
          </div>}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {step === 1 && <><button
              type="button"
              id="sign-in-button"
              className="flex-1 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
              onClick={handleGenerateOTP}
            >
              <CheckCircle className="mr-2" /> Generate OTP
            </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <XCircle className="mr-2" /> Reset
              </button>
            </>}
            {step === 2 && <button
              type="submit"
              className="flex-1 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
            >
              <CheckCircle className="mr-2" /> Verify OTP
            </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipSignup;
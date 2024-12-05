import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Required for basic calendar styles
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../Firebase";
import { useFirebase } from "../firebase/FirebaseContext";

const EKYC = () => {
  const { user } = useFirebase();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [kycKey, setKycKey] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const firestore = getFirestore(app);

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  useEffect(() => {
    if (!user) return; // User not logged in
    const checkExistingSlot = async () => {
      try {
        const userUid = user?.uid;
        const docRef = doc(firestore, "kyc", userUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // User already has a KYC slot
          const data = docSnap.data();
          setKycKey(data.kycKey);
          setSelectedDate(new Date(data.slot.date));
          setSelectedSlot(data.slot.time);
          setStep(4); // Move to Step 4 if already has a slot
        } else {
          setStep(1); // Step 1 for new users
        }
      } catch (err) {
        setError(err.message);
      }
    };
    checkExistingSlot();
  }, [user, firestore]);

  const handleGenerateOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate OTP");
      }

      setSuccessMessage("OTP sent successfully to your email");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      setKycKey(data.kycKey);
      setSuccessMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlot = async () => {
    try {
      setLoading(true);
      setError("");

      if (!selectedDate || !selectedSlot) {
        throw new Error("Please select a date and time slot");
      }

      const userUid = user?.uid;
      if (!userUid) {
        throw new Error("User not authenticated");
      }

      const kycData = {
        email,
        kycKey,
        slot: {
          date: selectedDate.toISOString().split("T")[0],
          time: selectedSlot,
        },
        generatedAt: new Date().toISOString(),
      };

      await setDoc(doc(firestore, "kyc", userUid), kycData);

      setSuccessMessage("Slot saved successfully!");
      setStep(4); // Move to final confirmation step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDisabledDate = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Disable Sundays (0) and Saturdays (6)
  };

  const isDisabledSlot = (slot) => {
    const now = new Date();
    const [hours, minutes] = slot.split(":");
    const slotDate = new Date(selectedDate);
    slotDate.setHours(parseInt(hours), parseInt(minutes.split(" ")[0]), 0, 0);
    return slotDate < now; // Disable past slots
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          {step === 1 && "eKYC Verification"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Select Slot"}
          {step === 4 && "OTP Verification and Slot Booking Completed"}
        </h2>

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-center mb-4">{successMessage}</div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={handleGenerateOTP}
              disabled={!email || loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              disabled={loading}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select a Date</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileDisabled={({ date }) => isDisabledDate(date)}
            />

            {selectedDate && (
              <div>
                <h3 className="text-lg font-semibold mt-4">Select a Time Slot</h3>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`py-2 px-4 rounded ${
                        selectedSlot === slot
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      } hover:bg-blue-400`}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={isDisabledSlot(slot)} // Disable past slots
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
                  onClick={handleSaveSlot}
                  disabled={!selectedSlot || loading}
                >
                  {loading ? "Saving Slot..." : "Save Slot"}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-lg">
              Thank you for completing first step of eKYC! Your selected slot is:{" "}
              <span className="font-bold">
                {selectedDate?.toDateString()} at {selectedSlot}
              </span>.<br />
              Your KYC Key is: {kycKey}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EKYC;

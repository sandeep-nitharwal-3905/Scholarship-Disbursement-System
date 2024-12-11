import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '../firebase/FirebaseContext';
// import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../Firebase";
// import { useFirebase } from "../firebase/FirebaseContext";
const EKYC = () => {
  const { user } = useFirebase();
  const [adminAvailable, setAdminAvailable] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  // const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [email, setEmail] = useState("");
  const [status,setStatus]= useState("")
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

  const signalingSocketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };
  useEffect(() => {
    if (!user) return; 
    const checkExistingSlot = async () => {
      try {
        const userUid = user?.uid;
        const docRef = doc(firestore, "kyc", userUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // console.log(data.status)
          setStatus(data.status);
          setKycKey(data.kycKey);
          setSelectedDate(new Date(data.slot.date));
          setSelectedSlot(data.slot.time);
          setStep(4); 
        } else {
          setStep(1); 
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
    return day === 0 || day === 6; 
  };

  const isDisabledSlot = (slot) => {
    const now = new Date();
    const [hours, minutes] = slot.split(":");
    const slotDate = new Date(selectedDate);
    slotDate.setHours(parseInt(hours), parseInt(minutes.split(" ")[0]), 0, 0);
    return slotDate < now; 
  };
  useEffect(() => {
    let reconnectAttempt = 0;
    const maxReconnectAttempts = 5;

    const connectSignalingServer = () => {
      const socket = new WebSocket('ws://localhost:3000');
      // const socket = new WebSocket('ws://172.20.10.4:3000');
      signalingSocketRef.current = socket;

      socket.onopen = () => {
        console.log('Connected to signaling server');
        setConnectionStatus('connected');
        reconnectAttempt = 0;
        
        socket.send(JSON.stringify({
          type: 'register',
          role: 'client',
          sessionId: user.uid
        }));
      };

      socket.onmessage = handleSignalingMessage;
      
      socket.onclose = () => {
        console.log('Disconnected from signaling server');
        setConnectionStatus('disconnected');
        setAdminAvailable(false);
        
        if (reconnectAttempt < maxReconnectAttempts) {
          reconnectAttempt++;
          setTimeout(connectSignalingServer, 5000 * reconnectAttempt);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again later.');
      };

      return socket;
    };

    const socket = connectSignalingServer();

    return () => cleanup(socket);
  }, [user.uid]);

  const cleanup = (socket) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.close();
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const handleSignalingMessage = async (event) => {
    const data = JSON.parse(event.data);
    
    try {
      switch (data.type) {
        case 'ready':
          setAdminAvailable(true);
          break;
          
        case 'offer':
          await handleIncomingOffer(data.offer);
          break;
          
        case 'answer':
          if (peerConnectionRef.current && data.answer) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
          break;
          
        case 'candidate':
          if (peerConnectionRef.current && data.candidate) {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          }
          break;
          
        case 'disconnected':
          handlePeerDisconnection(data.role);
          break;
      }
    } catch (err) {
      setError(`Signal handling error: ${err.message}`);
    }
  };

  const setupPeerConnection = async () => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && signalingSocketRef.current?.readyState === WebSocket.OPEN) {
        signalingSocketRef.current.send(JSON.stringify({
          type: 'candidate',
          candidate: event.candidate
        }));
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', peerConnection.iceConnectionState);
      setConnectionStatus(peerConnection.iceConnectionState);
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  const startCall = async () => {
    try {
      setVideoCallActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = await setupPeerConnection();
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await peerConnection.setLocalDescription(offer);
      signalingSocketRef.current.send(JSON.stringify({
        type: 'offer',
        offer: offer
      }));
    } catch (err) {
      setError(`Failed to start call: ${err.message}`);
      setVideoCallActive(false);
    }
  };

  const handleIncomingOffer = async (offer) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = await setupPeerConnection();
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      signalingSocketRef.current.send(JSON.stringify({
        type: 'answer',
        answer: answer
      }));
    } catch (err) {
      setError(`Failed to handle offer: ${err.message}`);
    }
  };

  const handlePeerDisconnection = (role) => {
    setError(`${role === 'admin' ? 'Admin' : 'Client'} disconnected`);
    setVideoCallActive(false);
    setAdminAvailable(false);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
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
                      disabled={isDisabledSlot(slot)} 
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
      Thank you for completing the first step of eKYC! Your selected slot is:{" "}
      <span className="font-bold">
        {selectedDate?.toDateString()} at {selectedSlot}
      </span>.
      <br />
      Your KYC Key is: {kycKey}
    </p>

    {/* Display KYC status */}
    {status === "approved" && (
      <div className="text-green-500 font-semibold">
        Your KYC is approved.
      </div>
    )}
    {status === "rejected" && (
      <div className="text-red-500 font-semibold">
        Your KYC is rejected. Please try again.
      </div>
    )}
  </div>
)}
      {step==4&&(<>
        <h2 className="text-2xl font-bold mb-4">eKYC Video Call</h2>
      
      <div className="mb-4 text-sm">
        <span className={`px-2 py-1 rounded ${
          connectionStatus === 'connected' ? 'bg-green-500 text-white' :
          connectionStatus === 'connecting' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </span>
      </div>

      {!videoCallActive ? (
        <button
          className={`py-2 px-4 rounded ${
            adminAvailable ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          } text-white`}
          onClick={startCall}
          disabled={!adminAvailable}
        >
          {adminAvailable ? "Start Video Call" : "Admin Not Available"}
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-64 h-48 border rounded"
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
              You
            </span>
          </div>
          <div className="relative">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-64 h-48 border rounded"
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
              Admin
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      </>)}
    </div>
  );
};

export default EKYC;
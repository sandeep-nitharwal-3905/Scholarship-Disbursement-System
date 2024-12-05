import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '../firebase/FirebaseContext';

const EKYC = () => {
  const { user } = useFirebase();
  const [adminAvailable, setAdminAvailable] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
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
    let reconnectAttempt = 0;
    const maxReconnectAttempts = 5;

    const connectSignalingServer = () => {
      const socket = new WebSocket('ws://localhost:3000');
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
    </div>
  );
};

export default EKYC;
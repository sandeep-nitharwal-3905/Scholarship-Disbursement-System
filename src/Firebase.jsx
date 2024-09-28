import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth from firebase/auth
import { getAnalytics } from "firebase/analytics"; // If you plan to use analytics
import { getDatabase } from "firebase/database"; // If you plan to use the database

const firebaseConfig = {
  apiKey: "AIzaSyDBuelLIkUgYVAGCXu3QavuHsNDUejF2EA",
  authDomain: "scholarship-disbursement-app.firebaseapp.com",
  projectId: "scholarship-disbursement-app",
  storageBucket: "scholarship-disbursement-app.appspot.com",
  messagingSenderId: "601280860171",
  appId: "1:601280860171:web:7eb2646914ec3c26df770e",
  measurementId: "G-N1E33X8KSY",
  databaseURL:
    "https://scholarship-disbursement-app-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication

export default app;

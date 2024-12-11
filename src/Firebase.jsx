import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDBuelLIkUgYVAGCXu3QavuHsNDUejF2EA",
  authDomain: "scholarship-disbursement-app.firebaseapp.com",
  projectId: "scholarship-disbursement-app",
  storageBucket: "scholarship-disbursement-app.appspot.com",
  messagingSenderId: "601280860171",
  appId: "1:601280860171:web:7eb2646914ec3c26df770e",
  measurementId: "G-N1E33X8KSY",
  databaseURL: "https://scholarship-disbursement-app-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);
const functions = getFunctions(app);

export { 
  db, 
  auth, 
  database, 
  functions 
};
export default app;
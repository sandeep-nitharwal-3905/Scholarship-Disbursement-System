import { addDoc, setDoc } from 'firebase/firestore';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { createContext, useContext } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
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

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(FirebaseApp); // Initialize auth
const database = getDatabase(FirebaseApp); // Initialize Realtime Database
const db = getFirestore(FirebaseApp); // Initialize Firestore
const analytics = getAnalytics(FirebaseApp); // Optional: Initialize Analytics

// Create Firebase context
const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {

    const fetchUserData = async (uid) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            throw new Error("No such document!");
        }
    };

    const registerUser = async (email, password, fullName, dob, phoneNumber) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user data to the Realtime Database
            await set(ref(database, "users/" + user.uid), {
                fullName,
                email,
                dob,
                phoneNumber,
                role: "student", // Default role for new registrations
            });

            return { uid: user.uid, email, fullName, dob, phoneNumber, role: "student" };
        } catch (error) {
            throw error;
        }
    };

    const signupUser = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    const loginUser = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    };

    const getCurrentUser = () => {
        return auth.currentUser;
    };

    const getUserData = async (uid) => {
        try {
            const userRef = ref(database, "users/" + uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            throw error;
        }
    };

    const createScholarship = async (info) => {
        try {
            console.log(info)
            const result = await addDoc(collection(db, "scholarships"), info);
            console.log("Scholarship created with ID:", result.id);
        } catch (error) {
            throw error;
        }
    };

    return (
        <FirebaseContext.Provider
            value={{
                fetchUserData,
                getUserData,
                getCurrentUser,
                loginUser,
                logoutUser,
                signupUser,
                registerUser,
                createScholarship,
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};

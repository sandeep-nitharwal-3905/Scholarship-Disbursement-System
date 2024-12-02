import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase"; // Firebase Auth instance
import { db } from "../Firebase"; // Firestore instance
import { getDatabase, ref, get } from "firebase/database";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const FirebaseContext = createContext();

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const dbRTDB = getDatabase(); // Realtime Database reference if needed

  // Firebase Authentication: Create User
  const createUser = async (email, password) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Authentication: Sign In
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Authentication: Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Firestore: Create Scholarship
  const createScholarship = async (scholarshipData) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error("User not authenticated");

      const newScholarshipRef = doc(collection(db, "scholarships"));
      await setDoc(newScholarshipRef, {
        ...scholarshipData,
        createdBy: user.uid,
        modifiedBy: user.uid,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Firestore: Update Scholarship
  const updateScholarship = async (scholarshipId, updatedData) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error("User not authenticated");

      const scholarshipRef = doc(db, "scholarships", scholarshipId);
      const scholarshipSnap = await getDoc(scholarshipRef);
      if (
        scholarshipSnap.exists() &&
        scholarshipSnap.data().createdBy === user.uid
      ) {
        await updateDoc(scholarshipRef, {
          ...updatedData,
          modifiedBy: user.uid,
          modifiedAt: new Date(),
        });
      } else {
        throw new Error("Unauthorized to modify this scholarship");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Firestore: Delete Scholarship
  const deleteScholarship = async (scholarshipId) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error("User not authenticated");

      const scholarshipRef = doc(db, "scholarships", scholarshipId);
      const scholarshipSnap = await getDoc(scholarshipRef);
      if (
        scholarshipSnap.exists() &&
        scholarshipSnap.data().createdBy === user.uid
      ) {
        await deleteDoc(scholarshipRef);
      } else {
        throw new Error("Unauthorized to delete this scholarship");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Firestore: Fetch Scholarships
  const fetchScholarships = async () => {
    try {
      setIsLoading(true);
      const scholarships = [];
      const querySnapshot = await getDocs(collection(db, "scholarships"));
      querySnapshot.forEach((doc) => {
        scholarships.push({ id: doc.id, ...doc.data() });
      });
      return scholarships;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Firestore: Fetch User Data
  const fetchUserData = async (uid) => {
    try {
      setIsLoading(true);
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        return userSnap.data();
      } else {
        throw new Error("User document does not exist.");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        createUser,
        signIn,
        logout,
        createScholarship,
        updateScholarship,
        deleteScholarship,
        fetchScholarships,
        fetchUserData,
        user,
        userData,
        isLoading,
        error,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

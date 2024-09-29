import React, { createContext, useContext } from "react";
import { db } from "../Firebase"; // Firestore instance
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { getCurrentUser } from "./auth"; // From your auth.js

const FirebaseContext = createContext();

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const createScholarship = async (scholarshipData) => {
    const user = getCurrentUser();
    if (user) {
      const newScholarshipRef = doc(collection(db, "scholarships"));
      await setDoc(newScholarshipRef, {
        ...scholarshipData,
        createdBy: user.uid,
        modifiedBy: user.uid,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
    } else {
      throw new Error("User not authenticated");
    }
  };

  const updateScholarship = async (scholarshipId, updatedData) => {
    const user = getCurrentUser();
    if (user) {
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
    } else {
      throw new Error("User not authenticated");
    }
  };

  // Add fetchScholarships function here
  const fetchScholarships = async () => {
    const scholarships = [];
    const querySnapshot = await getDocs(collection(db, "scholarships"));
    querySnapshot.forEach((doc) => {
      scholarships.push({ id: doc.id, ...doc.data() });
    });
    return scholarships;
  };

  return (
    <FirebaseContext.Provider
      value={{ createScholarship, updateScholarship, fetchScholarships }} // include fetchScholarships here
    >
      {children}
    </FirebaseContext.Provider>
  );
};

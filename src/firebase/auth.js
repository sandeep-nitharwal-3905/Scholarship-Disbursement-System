import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import app from "../Firebase";

const auth = getAuth(app);
const database = getDatabase(app);
export const fetchUserData = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error("No such document!");
  }
};
export const registerUser = async (
  email,
  password,
  fullName,
  dob,
  phoneNumber
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save additional user data to the database
    await set(ref(database, "users/" + user.uid), {
      fullName: fullName,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
      role: "student", // Default role for new registrations
    });

    // Return a serializable object with user data
    return {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      dob: dob,
      phoneNumber: phoneNumber,
      role: "student",
    };
  } catch (error) {
    throw error; // Rethrow error to handle in the calling function
  }
};

export const signupUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // User signed up successfully
    return userCredential.user; // Return the user data
  } catch (error) {
    throw error; // Pass the error back to the component
  }
};

// Function to handle user login
export const loginUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // User logged in successfully
    return userCredential.user; // Return the user data
  } catch (error) {
    throw error; // Pass the error back to the component
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser; // Consider checking if the user exists before using
};

export const getUserData = async (uid) => {
  try {
    const userRef = ref(database, "users/" + uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Returns user data as an object
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw error; // Rethrow error to handle in the calling function
  }
};

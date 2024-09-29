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
  phoneNumber,
  role = "student" // Default role is 'student'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await set(ref(database, "users/" + user.uid), {
      fullName: fullName,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
      role: role,
    });

    return {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      dob: dob,
      phoneNumber: phoneNumber,
      role: role,
    };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
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
  return auth.currentUser;
};

export const getUserData = async (uid) => {
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

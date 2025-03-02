// src/services/authService.js
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Register with Email & Password
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login with Email
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Sign-In
const googleProvider = new GoogleAuthProvider();
export const googleSignIn = () => {
  return signInWithPopup(auth, googleProvider);
};

// Logout
export const logout = () => {
  return signOut(auth);
};

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// من Firebase console → Project settings → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyA7zHJfmRXc081NFj7zqZ4bC40yOZ7tcTI",
  authDomain: "tablya-mvp.firebaseapp.com",
  databaseURL:
    "https://tablya-mvp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tablya-mvp",
  storageBucket: "tablya-mvp.firebasestorage.app",
  messagingSenderId: "276362601619",
  appId: "1:276362601619:web:ec446487a81604652e9966",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

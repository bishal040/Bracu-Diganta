import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA554H-OiINYYEN9yJ9uzti5vltUoicWK0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bracu-diganta.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bracu-diganta",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bracu-diganta.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "155074440256",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:155074440256:web:d2d29aff604bba5dbdc3a5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9TG322PPQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

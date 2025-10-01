// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Import getAnalytics only if you are using Analytics
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration with safe fallbacks to avoid crashes
export const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demoappid",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined, // Optional, for Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize the Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only if you need it
// export const analytics = getAnalytics(app);

export default app;
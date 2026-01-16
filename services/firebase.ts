
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// =========================================================================
// CONFIGURATION REQUIRED:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project.
// 3. Register a "Web App" to get these config values.
// 4. Enable "Email/Password" sign-in method in the Authentication section.
// 5. Replace the strings below with your actual values.
// =========================================================================

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

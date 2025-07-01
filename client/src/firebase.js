// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Import environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set up Google and Facebook providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", // Always prompt account selection
});

const facebookProvider = new FacebookAuthProvider();

// Function to handle Google Sign-In Sign-up
export const signInSignUpWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    return { user, token, accessToken };
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    return null;
  }
};

// Function to handle Facebook Sign-In Sign-up
export const signInSignUpWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const token = await result.user.getIdToken();
    const user = result.user;
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    return { user, token, accessToken };
  } catch (error) {
    console.error("Facebook Sign-In Error:", error.message);
    return null;
  }
};

// Export the Firebase app for use in other parts of the application

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-project-b2e2a.firebaseapp.com",
  projectId: "estate-project-b2e2a",
  storageBucket: "estate-project-b2e2a.appspot.com",
  messagingSenderId: "681644541391",
  appId: "1:681644541391:web:7c5c9a73fc8db49b72beba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
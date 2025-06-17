// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "curasync-2b594.firebaseapp.com",
  projectId: "curasync-2b594",
  storageBucket: "curasync-2b594.firebasestorage.app",
  messagingSenderId: "787923191642",
  appId: "1:787923191642:web:ec976ee960a4c798571563",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNIvxMu4hYsfjjEb8lUrYjCBLUvrulyQQ",
  authDomain: "dripster-trendy-fashion.firebaseapp.com",
  projectId: "dripster-trendy-fashion",
  storageBucket: "dripster-trendy-fashion.firebasestorage.app",
  messagingSenderId: "723827678023",
  appId: "1:723827678023:web:d49d29cdd7d3a2f078ca62",
  measurementId: "G-JETGXKXSEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage }; 
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlGQjSBH_J6aT09f_pi7En6XGefA12Yzc",
  authDomain: "teknikhusetkalmarab.firebaseapp.com",
  projectId: "teknikhusetkalmarab",
  storageBucket: "teknikhusetkalmarab.firebasestorage.app",
  messagingSenderId: "134273796730",
  appId: "1:134273796730:web:e5724fbe8027b3930c89c3",
  measurementId: "G-F11DHPT0NS"
};

// Starta Firebase
const app = initializeApp(firebaseConfig);

// Exportera databasen
export const db = getFirestore(app);

export default app;
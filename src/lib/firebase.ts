import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Provisioned config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAaYOczGQBH82cVX04FCeaVOdB-IZmSeq0",
  authDomain: "concentrated-flash-3cf5x.firebaseapp.com",
  projectId: "concentrated-flash-3cf5x",
  storageBucket: "concentrated-flash-3cf5x.firebasestorage.app",
  messagingSenderId: "407955831719",
  appId: "1:407955831719:web:baa6f25868a4201880d482"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

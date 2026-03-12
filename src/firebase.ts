import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbbSYG2-GN16bXNo6sR6WvRrFXaw9l9SM",
  authDomain: "hideakimtg.firebaseapp.com",
  projectId: "hideakimtg",
  storageBucket: "hideakimtg.firebasestorage.app",
  messagingSenderId: "507158824521",
  appId: "1:507158824521:web:df23c834e1a289400e2198",
  measurementId: "G-0PDH0HMVV4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "clue-battle.firebaseapp.com",
  projectId: "clue-battle",
  storageBucket: "clue-battle.firebasestorage.app",
  messagingSenderId: "1071360403106",
  appId: "1:1071360403106:web:a314289f4df8f7c153d9fb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
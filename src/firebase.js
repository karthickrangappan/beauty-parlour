
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCvbB50LEmiqg2_xKWvYbhylDL6uXzDBYQ",
  authDomain: "beauty-parlour-7e393.firebaseapp.com",
  projectId: "beauty-parlour-7e393",
  storageBucket: "beauty-parlour-7e393.firebasestorage.app",
  messagingSenderId: "516720842877",
  appId: "1:516720842877:web:7e7b333f6ab41b36c43914",
  measurementId: "G-Z6PL1YMM7P"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;






import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCD5MefyNj2pmI-_B4IVpp0YL-Ur3K168c",
  authDomain: "bookstagram-bed22.firebaseapp.com",
  projectId: "bookstagram-bed22",
  storageBucket: "bookstagram-bed22.firebasestorage.app",
  messagingSenderId: "79289185853",
  appId: "1:79289185853:web:70550ee61af1f3b74b1c54",
  measurementId: "G-0RD1GXR35T"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
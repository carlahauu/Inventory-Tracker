// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { Firestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "pantry-app-cba76.firebaseapp.com",
  projectId: "pantry-app-cba76",
  storageBucket: "pantry-app-cba76.appspot.com",
  messagingSenderId: "281010789102",
  appId: "1:281010789102:web:fa95759ca8f5481dca31ff",
  measurementId: "G-4SE3QYKGSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
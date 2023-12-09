// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD20fVX3gIrGIIrFFKIz-GINoIxPtub97c",
  authDomain: "ecommerceapp-a636b.firebaseapp.com",
  projectId: "ecommerceapp-a636b",
  storageBucket: "ecommerceapp-a636b.appspot.com",
  messagingSenderId: "94539330946",
  appId: "1:94539330946:web:c1059b6c4fe58644cf4b9b",
  measurementId: "G-C9B0HBMS1F"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

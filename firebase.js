// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection,  addDoc ,getDoc } from "firebase/firestore";
import "firebase/firestore";
// import { firebase } from "@react-native-firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD20fVX3gIrGIIrFFKIz-GINoIxPtub97c",
  authDomain: "ecommerceapp-a636b.firebaseapp.com",
  projectId: "ecommerceapp-a636b",
  storageBucket: "ecommerceapp-a636b.appspot.com",
  messagingSenderId: "94539330946",
  appId: "1:94539330946:web:c1059b6c4fe58644cf4b9b",
  measurementId: "G-C9B0HBMS1F"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// const analytics = getAnalytics(app);
const storage = getStorage(app);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDatabase = getFirestore(app)
const db = firebase.firestore();
export {firebaseConfig, firebaseDatabase, db,app,storage, getFirestore, collection, addDoc, getDoc}
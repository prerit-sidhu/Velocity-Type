'use client';
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "velocitytype",
  "appId": "1:446119994650:web:90d6b55101d7d8902d78a3",
  "storageBucket": "velocitytype.firebasestorage.app",
  "apiKey": "AIzaSyDATHcpSp8ZpmgT8WK70YINfFTng40gt5I",
  "authDomain": "velocitytype.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "446119994650"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVJuDk_Kqd96MDuXt4or5RmjqBvP2Qves",
  authDomain: "ashrafi-engineers-12.firebaseapp.com",
  projectId: "ashrafi-engineers-12",
  storageBucket: "ashrafi-engineers-12.firebasestorage.app",
  messagingSenderId: "1025431318991",
  appId: "1:1025431318991:web:1e7726208767b6e932a2ba",
  measurementId: "G-EZ19RLSEM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth =getAuth(app)
export const db = getFirestore(app);
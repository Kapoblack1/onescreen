// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAcYTHYeJbRBZbaBMTZUhKaM8xrPgupwGI",
  authDomain: "onescreen-93a4c.firebaseapp.com",
  projectId: "onescreen-93a4c",
  storageBucket: "onescreen-93a4c.appspot.com",
  messagingSenderId: "464242634816",
  appId: "1:464242634816:web:61522745f2b85ef454efa5"
};


// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
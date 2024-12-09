// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc ,getDocs,doc, updateDoc, deleteDoc} from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGX5pn3N4DPwS4Cc0XSfRaHJIXMzU5kXk",
    authDomain: "fir-cloudfunctiontest-cfb74.firebaseapp.com",
    projectId: "fir-cloudfunctiontest-cfb74",
    storageBucket: "fir-cloudfunctiontest-cfb74.firebasestorage.app",
    messagingSenderId: "869066215667",
    appId: "1:869066215667:web:a44d3077a76a13b45da786",
    measurementId: "G-S80YPJYSX6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export {
  app,
  db,
  auth,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};

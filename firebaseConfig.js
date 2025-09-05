// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Configul tău Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEbSF7OG4Ye68SXxOE_6DIo_L3GrGHeV0",
  authDomain: "fitmate-5aac2.firebaseapp.com",
  projectId: "fitmate-5aac2",
  storageBucket: "fitmate-5aac2.appspot.com", // corectat .app -> .appspot.com
  messagingSenderId: "328541962137",
  appId: "1:328541962137:web:6485e623324c37c1499d08",
  measurementId: "G-02PLJS3RTM"
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);

// Auth cu persistență pe dispozitiv (rămâi logat între sesiuni)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// Exportă Firestore pentru a salva datele utilizatorilor
export const db = getFirestore(app);
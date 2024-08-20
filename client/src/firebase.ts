// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b2a70.firebaseapp.com",
  projectId: "mern-blog-b2a70",
  storageBucket: "mern-blog-b2a70.appspot.com",
  messagingSenderId: "913532574416",
  appId: "1:913532574416:web:3975a77dd3440376d01cd5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

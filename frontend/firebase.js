// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "food2u-757a8.firebaseapp.com",
    projectId: "food2u-757a8",
    storageBucket: "food2u-757a8.firebasestorage.app",
    messagingSenderId: "178076152273",
    appId: "1:178076152273:web:54dd0a63e6a99d7878b0f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export { app, auth }
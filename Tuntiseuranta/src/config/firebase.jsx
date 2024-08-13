// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVsbxLYC_IUKK21GI-3fn0gmHYFAQkcI8",
  authDomain: "tuntiseuranta-7e96b.firebaseapp.com",
  projectId: "tuntiseuranta-7e96b",
  storageBucket: "tuntiseuranta-7e96b.appspot.com",
  messagingSenderId: "839804201790",
  appId: "1:839804201790:web:049f7b81ff21edf25e5a6f",
  measurementId: "G-8QTRDCKW9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

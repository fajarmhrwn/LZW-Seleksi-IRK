// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtdTtZ0t29jgZWA28OQoKHALdgQ5vo82M",
  authDomain: "compress-f61de.firebaseapp.com",
  projectId: "compress-f61de",
  storageBucket: "compress-f61de.appspot.com",
  messagingSenderId: "226318117135",
  appId: "1:226318117135:web:df7b42ca4cc4d6648f367a",
  measurementId: "G-L130F01CLF"
};


console.log(firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};
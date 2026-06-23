// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOfUSi-3ysu7pTxftupfNKPfJ5fk-TgcE",
  authDomain: "crypto-wallet-app-b4484.firebaseapp.com",
  projectId: "crypto-wallet-app-b4484",
  storageBucket: "crypto-wallet-app-b4484.firebasestorage.app",
  messagingSenderId: "557665167176",
  appId: "1:557665167176:web:cb98d39e800f75efdc757d",
  measurementId: "G-T1Z47NKJ7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
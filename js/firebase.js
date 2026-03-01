// js/firebase.js

// Firebase ES6 modules using CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCBrcKKUgXBzf9F3Fu9H7xoKiL9c9ddOFA",
  authDomain: "todo-app-72113.firebaseapp.com",
  projectId: "todo-app-72113",
  storageBucket: "todo-app-72113.firebasestorage.app",
  messagingSenderId: "226973448485",
  appId: "1:226973448485:web:a85c669a604796ea19c2cc",
  measurementId: "G-DMG690DS0V"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export instances to be used in other modules
export { auth, db };

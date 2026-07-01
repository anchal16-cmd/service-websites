// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVtmxy2ZOcg-G5-vcH_w5Kb9yhGBSRD8Y",
    authDomain: "citymate-30743.firebaseapp.com",
    projectId: "citymate-30743",
    storageBucket: "citymate-30743.firebasestorage.app",
    messagingSenderId: "300220084580",
    appId: "1:300220084580:web:f30d39ae066c90155b0a71",
    measurementId: "G-4P84MQD7Y9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
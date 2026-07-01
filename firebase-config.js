// =====================================================
// CITYMATE — FIREBASE CONFIGURATION
// =====================================================
// Firebase Web API keys are not secret by design (they only
// identify your project to Google's servers) — but access to
// your data MUST be locked down using Firestore Security Rules
// (see firestore.rules in this project) and by restricting this
// API key to your site's domains in the Google Cloud Console:
// APIs & Services -> Credentials -> Browser key restrictions.
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVtmxy2ZOcg-G5-vcH_w5Kb9yhGBSRD8Y",
    authDomain: "citymate-30743.firebaseapp.com",
    projectId: "citymate-30743",
    storageBucket: "citymate-30743.firebasestorage.app",
    messagingSenderId: "300220084580",
    appId: "1:300220084580:web:f30d39ae066c90155b0a71",
    measurementId: "G-4P84MQD7Y9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

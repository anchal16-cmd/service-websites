import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
    friendlyAuthError,
    showError,
    clearError,
    setButtonLoading,
    resetButton
} from "./auth-helpers.js";

const form = document.getElementById("providerSignupForm");
const nameInput = document.getElementById("providerName");
const emailInput = document.getElementById("providerEmail");
const phoneInput = document.getElementById("providerPhone");
const passwordInput = document.getElementById("providerPassword");
const confirmInput = document.getElementById("providerConfirmPassword");
const serviceInput = document.getElementById("serviceCategory");
const experienceInput = document.getElementById("experience");
const stateInput = document.getElementById("state");
const cityInput = document.getElementById("city");
const areaInput = document.getElementById("area");
const errorEl = document.getElementById("providerSignupError");
const submitBtn = document.getElementById("providerSignupBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError(errorEl);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const service = serviceInput.value;
    const experience = experienceInput.value;
    const state = stateInput.value;
    const city = cityInput.value;
    const area = areaInput.value.trim();

    if (password !== confirm) {
        showError(errorEl, "Passwords do not match. Please re-check.");
        return;
    }

    if (password.length < 6) {
        showError(errorEl, "Password should be at least 6 characters.");
        return;
    }

    setButtonLoading(submitBtn, "Registering...");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, { displayName: name });

        await setDoc(doc(db, "providers", userCredential.user.uid), {
            name,
            email,
            phone,
            service,
            experience: Number(experience),
            state,
            city,
            area,
            role: "provider",
            createdAt: new Date().toISOString()
        });

        window.location.href = "provider-dashboard.html";
    } catch (error) {
        showError(errorEl, friendlyAuthError(error));
        resetButton(submitBtn);
    }
});

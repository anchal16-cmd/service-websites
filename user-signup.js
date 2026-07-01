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

const form = document.getElementById("userSignupForm");
const nameInput = document.getElementById("userName");
const emailInput = document.getElementById("userEmail");
const phoneInput = document.getElementById("userPhone");
const passwordInput = document.getElementById("userPassword");
const confirmInput = document.getElementById("userConfirmPassword");
const errorEl = document.getElementById("userSignupError");
const submitBtn = document.getElementById("userSignupBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError(errorEl);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (password !== confirm) {
        showError(errorEl, "Passwords do not match. Please re-check.");
        return;
    }

    if (password.length < 6) {
        showError(errorEl, "Password should be at least 6 characters.");
        return;
    }

    setButtonLoading(submitBtn, "Creating account...");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, { displayName: name });

        await setDoc(doc(db, "users", userCredential.user.uid), {
            name,
            email,
            phone,
            role: "user",
            createdAt: new Date().toISOString()
        });

        window.location.href = "dashboard.html";
    } catch (error) {
        showError(errorEl, friendlyAuthError(error));
        resetButton(submitBtn);
    }
});

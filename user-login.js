import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    friendlyAuthError,
    showError,
    clearError,
    setButtonLoading,
    resetButton
} from "./auth-helpers.js";

const form = document.getElementById("userLoginForm");
const emailInput = document.getElementById("userEmail");
const passwordInput = document.getElementById("userPassword");
const rememberMeInput = document.getElementById("rememberMe");
const toggleBtn = document.getElementById("toggleUserPassword");
const errorEl = document.getElementById("userLoginError");
const loginBtn = document.getElementById("userLoginBtn");
const googleBtn = document.getElementById("userGoogleLoginBtn");
const forgotLink = document.getElementById("forgotPasswordLink");

// If a "remember me" email was saved from a previous visit, pre-fill it.
const savedEmail = localStorage.getItem("citymate_remembered_email");
if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeInput.checked = true;
}

// If the person is already logged in, skip straight to the dashboard.
onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "dashboard.html";
});

// Toggle password visibility
toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleBtn.classList.toggle("fa-eye");
    toggleBtn.classList.toggle("fa-eye-slash");
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError(errorEl);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    setButtonLoading(loginBtn, "Logging in...");

    try {
        await signInWithEmailAndPassword(auth, email, password);

        if (rememberMeInput.checked) {
            localStorage.setItem("citymate_remembered_email", email);
        } else {
            localStorage.removeItem("citymate_remembered_email");
        }

        window.location.href = "dashboard.html";
    } catch (error) {
        showError(errorEl, friendlyAuthError(error));
        resetButton(loginBtn);
    }
});

googleBtn.addEventListener("click", async () => {
    clearError(errorEl);
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        window.location.href = "dashboard.html";
    } catch (error) {
        showError(errorEl, friendlyAuthError(error));
    }
});

forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    clearError(errorEl);

    const email = emailInput.value.trim();
    if (!email) {
        showError(errorEl, "Enter your email above first, then tap 'Forgot password?' again.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showError(errorEl, `Password reset link sent to ${email}. Check your inbox.`);
    } catch (error) {
        showError(errorEl, friendlyAuthError(error));
    }
});

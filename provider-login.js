import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
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

const form = document.getElementById("providerLoginForm");
const emailInput = document.getElementById("providerEmail");
const passwordInput = document.getElementById("providerPassword");
const rememberMeInput = document.getElementById("rememberMe");
const toggleBtn = document.getElementById("toggleProviderPassword");
const errorEl = document.getElementById("providerLoginError");
const loginBtn = document.getElementById("providerLoginBtn");
const forgotLink = document.getElementById("forgotPasswordLink");

const savedEmail = localStorage.getItem("citymate_provider_remembered_email");
if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeInput.checked = true;
}

onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "provider-dashboard.html";
});

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
            localStorage.setItem("citymate_provider_remembered_email", email);
        } else {
            localStorage.removeItem("citymate_provider_remembered_email");
        }

        window.location.href = "provider-dashboard.html";
    } catch (error) {
        showError(errorEl, friendlyAuthError(error));
        resetButton(loginBtn);
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

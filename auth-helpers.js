/* =====================================================
   CITYMATE — SHARED AUTH HELPERS
   Small utilities reused across login/signup/dashboard
   pages so every page does not repeat the same
   Firebase auth-guard / logout / error-message code.
   ===================================================== */

import { auth, db } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Protects a page: if nobody is logged in, redirect to `redirectTo`.
 * If logged in, fetch their profile document from `collectionName`
 * ("users" or "providers") and hand it to `onReady`.
 *
 * Usage:
 *   requireAuth("users", "user-login.html", (user, profile) => { ... });
 */
export function requireAuth(collectionName, redirectTo, onReady) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = redirectTo;
            return;
        }

        try {
            const snap = await getDoc(doc(db, collectionName, user.uid));
            const profile = snap.exists() ? snap.data() : null;
            onReady(user, profile);
        } catch (err) {
            console.error("Could not load profile:", err);
            onReady(user, null);
        }
    });
}

/** Wires a logout button/link to sign the user out and redirect home. */
export function wireLogout(el, redirectTo = "index.html") {
    if (!el) return;
    el.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
        } finally {
            window.location.href = redirectTo;
        }
    });
}

/** Turns raw Firebase error codes into friendly, human copy. */
export function friendlyAuthError(error) {
    const code = error?.code || "";

    const messages = {
        "auth/invalid-email": "That email address doesn't look right.",
        "auth/user-not-found": "No account found with that email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/email-already-in-use": "An account already exists with this email.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/too-many-requests": "Too many attempts. Please wait a bit and try again.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
        "auth/popup-closed-by-user": "Sign-in popup was closed before finishing.",
    };

    return messages[code] || error?.message || "Something went wrong. Please try again.";
}

/** Shows an inline error message inside a given element and un-hides it. */
export function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
}

/** Hides an inline error message element. */
export function clearError(el) {
    if (!el) return;
    el.textContent = "";
    el.classList.remove("show");
}

/** Puts a submit button into a disabled "loading" state with new label. */
export function setButtonLoading(btn, loadingText) {
    if (!btn) return;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = loadingText;
    btn.disabled = true;
}

/** Restores a submit button to its normal, clickable state. */
export function resetButton(btn) {
    if (!btn) return;
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
}

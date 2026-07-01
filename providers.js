/* =====================================================
   CITYMATE — PROVIDERS LISTING
   Reads ?service=<name> from the URL and pulls matching
   provider profiles live from Firestore ("providers"
   collection), so Local Services links to real data
   instead of dead pages.
   ===================================================== */

import { db } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const service = params.get("service") || "";

const titleEl = document.getElementById("serviceTitle");
const subtitleEl = document.getElementById("serviceSubtitle");
const listEl = document.getElementById("providerList");

titleEl.textContent = service ? `${service}s Near You` : "Providers";

function initials(name) {
    return (name || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
}

function renderEmptyState(message, icon = "fa-magnifying-glass") {
    listEl.innerHTML = `
        <div class="state-msg">
            <i class="fa-solid ${icon}"></i>
            <p>${message}</p>
        </div>
    `;
}

function renderProviders(providers) {
    listEl.innerHTML = "";

    providers.forEach((p) => {
        const card = document.createElement("div");
        card.className = "provider-card";

        card.innerHTML = `
            <div class="provider-avatar">${initials(p.name)}</div>
            <div class="provider-info">
                <h3>${p.name || "Provider"}</h3>
                <div class="provider-meta">
                    <span><i class="fa-solid fa-briefcase"></i> ${p.experience ?? "?"} yrs experience</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${[p.area, p.city].filter(Boolean).join(", ")}</span>
                </div>
                <div class="provider-actions">
                    ${p.phone ? `<a class="call-btn" href="tel:${p.phone}"><i class="fa-solid fa-phone"></i> Call</a>` : ""}
                    ${p.email ? `<a class="email-btn" href="mailto:${p.email}"><i class="fa-solid fa-envelope"></i> Email</a>` : ""}
                </div>
            </div>
        `;

        listEl.appendChild(card);
    });
}

async function loadProviders() {
    if (!service) {
        renderEmptyState("Pick a service category from the Local Services page to see providers.", "fa-list");
        return;
    }

    renderEmptyState("Loading providers...", "fa-spinner");

    try {
        const providersRef = collection(db, "providers");
        const q = query(providersRef, where("service", "==", service));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            renderEmptyState(`No ${service} providers have registered in your area yet. Check back soon!`, "fa-user-slash");
            return;
        }

        const providers = snapshot.docs.map((doc) => doc.data());
        renderProviders(providers);
        subtitleEl.textContent = `${providers.length} verified provider${providers.length === 1 ? "" : "s"} found.`;
    } catch (err) {
        console.error("Failed to load providers:", err);
        renderEmptyState("Couldn't load providers right now. Please try again in a moment.", "fa-triangle-exclamation");
    }
}

loadProviders();

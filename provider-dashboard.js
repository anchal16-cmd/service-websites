import { requireAuth, wireLogout } from "./auth-helpers.js";

wireLogout(document.getElementById("logoutBtn"), "index.html");

function initials(name) {
    return (name || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
}

requireAuth("providers", "provider-login.html", (user, profile) => {
    if (!profile) {
        // Signed in, but no provider profile document exists — this
        // account isn't registered as a provider.
        document.getElementById("providerName").textContent = "No provider profile found";
        return;
    }

    document.getElementById("providerAvatar").textContent = initials(profile.name);
    document.getElementById("providerName").textContent = profile.name || "Provider";
    document.getElementById("providerEmail").textContent = profile.email || user.email || "";
    document.getElementById("providerServiceBadge").innerHTML =
        `<i class="fa-solid fa-briefcase"></i> ${profile.service || "—"}`;
    document.getElementById("providerPhone").textContent = profile.phone || "—";
    document.getElementById("providerExperience").textContent =
        profile.experience != null ? `${profile.experience} years` : "—";
    document.getElementById("providerCity").textContent = profile.city || "—";
    document.getElementById("providerArea").textContent = profile.area || "—";
});

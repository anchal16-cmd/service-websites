# CityMate — "Your First Friend in Every City"

CityMate ek local-services discovery website hai jo naye shehar me aane wale logon ko trusted service providers (plumber, electrician, carpenter, painter, maid, etc.) se connect karta hai. Do roles hain — **User** (jo service dhundh raha hai) aur **Provider** (jo service de raha hai) — Firebase Authentication + Firestore ke saath.

---

## ✅ What changed in this update

Analysis me kaafi bugs mile the, sabse bada issue ye tha ki **login pages actually signup forms the** (aur asli signup pages non-functional plain HTML the, koi Firebase connection nahi). Sab fix kar diya gaya hai:

| Area | Before | After |
|---|---|---|
| `user-login.html` | Signup form ka duplicate, koi login logic nahi | Real login form, `user-login.js` se properly connected |
| `provider-login.html` | Signup form ka duplicate | Real login form, provider theme |
| `user-signup.html` | Plain HTML form, no `id`s, no Firebase | Real signup form wired to `user-signup.js` |
| `provider-signup.html` | Plain HTML form, no `id`s | Real signup form wired to `provider-signup.js`, state→city dropdown intact |
| `dashboard.js` | Called `initLocationDropdown()` which didn't exist → console error | Function properly defined, wrapped, null-safe |
| Dashboard auth | Hardcoded name `"Radhe"`, no login check | Real Firebase auth-guard — redirects to login if not signed in, greets by real name from Firestore |
| Logout | Missing everywhere | Logout button added to user dashboard + provider dashboard |
| `local-services.html` | Linked to `plumber.html`, `electrician.html`, etc. — **none of these existed** | Links to new `providers.html?service=...` which loads real providers from Firestore |
| Provider dashboard | Referenced (`provider-dashboard.html`) but never existed | Built: shows the provider's own profile, guarded by auth |
| Error handling | Everything used blocking `alert()` | Inline, styled error messages on all forms |
| Password fields | No visibility toggle | Eye-icon toggle added on login forms |
| Extra | — | "Forgot password" (Firebase reset email), Google sign-in on user login, "remember me", Firestore security rules file |

## 🚀 Features

- **Landing Page (`index.html`)** — Hero, role selection (User / Provider), stats.
- **User Auth** — Signup & Login with Firebase Email/Password, plus Google sign-in and password reset on login.
- **Provider Auth** — Signup (service category, experience, state → city cascade, area) & Login.
- **User Dashboard (`dashboard.html`)** — Dynamic greeting with real name, location search (OpenStreetMap Nominatim), global search, feature grid, popular service pills (now deep-link to real provider listings), notifications, bottom nav, logout.
- **Local Services → Providers** — Browsing a category (e.g. Plumber) queries Firestore live and shows real registered providers with call/email actions.
- **Provider Dashboard (`provider-dashboard.html`)** — Provider's own profile summary, logout.
- **Route protection** — Dashboards redirect to the right login page if nobody (or the wrong role) is signed in.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Auth & Database | Firebase Authentication + Cloud Firestore (v12 SDK, CDN import) |
| Icons | Font Awesome 6.5.1 (CDN) |
| Fonts | Google Fonts — Poppins & Inter |
| Location Search | OpenStreetMap Nominatim API |

## 📁 Project Structure

```
service website/
├── index.html                    # Landing page
├── style.css
├── logo.jpeg
│
├── auth-helpers.js                # Shared: auth guard, logout, error helpers
├── firebase-config.js             # Firebase init + exported auth/db
├── firestore.rules                # Recommended security rules (paste into console)
│
├── user-login.html / .js          # User login (Google sign-in, forgot password)
├── user-signup.html / .js         # User signup
├── provider-login.html / .js      # Provider login
├── provider-signup.html / .js     # Provider signup
├── auth.css                       # Shared login styles
├── signup.css                     # Shared signup styles
│
├── dashboard.html / .js / .css    # User dashboard (auth-guarded)
├── local-services.html / .css     # Service category picker
├── providers.html / .js / .css    # Live provider listing per category (Firestore)
└── provider-dashboard.html / .js / .css  # Provider's own profile (auth-guarded)
```

## ⚙️ Setup & Run

Static frontend, no build step.

1. Extract the project folder.
2. Firebase ES Modules need a real server (not `file://`), so run:
   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```
3. Open `index.html` in the browser via that local server's URL.
4. Using your own Firebase project? Swap the config in `firebase-config.js`.

## 🔐 Firebase Setup Checklist

- Authentication → Sign-in method → enable **Email/Password** and **Google**.
- Firestore Database → create it, then paste `firestore.rules` into the Rules tab and publish. (Test mode leaves your data open to anyone.)
- Two collections are used: `users` and `providers`, keyed by the Firebase Auth `uid`.

## 🗺️ Ideas for next iteration

- Provider profile editing (currently read-only).
- Bookings/requests flow between user and provider.
- Ratings & reviews on provider cards.
- City/area filter on the providers listing (data already has `city`/`area`).
- Real "Nearby Shops", "Emergency", "Explore Area", "Food & Restaurants", "Transport" categories (currently only Local Services is wired to real data).

---

*Ye README project analysis ke baad update kiya gaya hai. Naya feature add karte time isse bhi update karte rehna.*

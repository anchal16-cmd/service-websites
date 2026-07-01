# CityMate — "Your First Friend in Every City"

CityMate ek local-services discovery website hai jo naye shehar me aane wale logon ko trusted service providers (plumber, electrician, carpenter, painter, maid, etc.) aur nearby shops/hospitals/transport se connect karta hai. Website me do roles hain — **User** (jo service dhundh raha hai) aur **Provider** (jo service de raha hai) — dono ke apne alag signup/login flow hain, Firebase Authentication + Firestore ke saath.

---

## 🚀 Features

- **Landing Page (`index.html`)** — Hero section, role selection (User / Provider), platform stats.
- **User Auth** — Signup (`user-signup.html`) & Login (`user-login.html`) using Firebase Email/Password auth. User data (name, email, phone, role) Firestore ke `users` collection me save hota hai.
- **Provider Auth** — Signup (`provider-signup.html`) & Login (`provider-login.html`) with extra fields: service category, experience, state, city, area. Data Firestore ke `providers` collection me save hota hai.
- **User Dashboard (`dashboard.html`)** — Dynamic greeting (Good Morning/Afternoon/Evening), location search (OpenStreetMap Nominatim API se live suggestions), global search bar (services/places directory), feature grid (Local Services, Nearby Shops, Emergency, Explore Area, Food & Restaurants, Transport), popular service pills, notification badge, bottom navigation, aur micro-interactions (ripple effect, bounce animation).
- **Local Services Listing (`local-services.html`)** — Plumber, Electrician, Maid, Carpenter, Painter ki list.

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
├── index.html                 # Landing page
├── style.css                  # Landing page styles
├── logo.jpeg                  # Brand image
│
├── user-login.html / .js      # User login
├── user-signup.html / .js     # User signup
├── provider-login.html / .js  # Provider login
├── provider-signup.html / .js # Provider signup
├── auth.css                   # Shared login styles
├── signup.css                 # Shared signup styles
│
├── dashboard.html / .js / .css # User dashboard (post-login home)
├── local-services.html / .css  # Local services listing page
│
└── firebase-config.js         # Firebase init + exported auth/db instances
```

## ⚙️ Setup & Run

Ye ek static frontend project hai — koi build step nahi chahiye.

1. Repo/zip ko ek folder me extract karo.
2. Firebase ES Modules ko browser directly load karta hai, isliye plain `file://` open karne par CORS/module errors aa sakte hain. Isliye local server se chalao:
   ```bash
   npx serve .
   # ya
   python3 -m http.server 5500
   ```
3. Browser me `index.html` open karo.
4. Apna khud ka Firebase project banake `firebase-config.js` me apni config keys daal do (Authentication → Email/Password enable karna zaroori hai, aur Firestore database create karna hoga).

## 🔐 Firebase Setup Checklist

- Firebase Console → Authentication → Sign-in method → **Email/Password** enable karo.
- Firestore Database create karo (test mode se shuru karo, phir proper security rules likho).
- `firebaseConfig` object me apna project ka config paste karo (`firebase-config.js`).

---

*Ye README project ko analyse karke banaya gaya hai. Agar koi feature already implemented hai jo yaha miss ho gaya, ya koi naya file add ho, please README update kar dena.*

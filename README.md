# CityMate — Marketplace Upgrade (Pass 2)

This builds on top of the previous Service Selector + Location Search
feature. Same rule as before: nothing existing was redesigned, only added
to. Dark navy + orange theme, fonts, and spacing all stayed exactly as they
were.

## What's in this folder
```
index.html            Landing page (login/signup) — minor edit only
dashboard.html         Dashboard — new sections added
results.html           NEW — provider search results page
profile.html            NEW — user profile page
partner.html             NEW — "Become a Partner" registration page
app-data.js              NEW — shared data layer (providers, bookings, reviews, profile)
india-locations.js      State -> City data (unchanged from before)
style.css                All styling — only new CSS appended, nothing removed
logo.png                 Your existing logo
```
Upload/replace these files in your site's folder. Everything is plain
HTML/CSS/JS — no build step, no server required to try it locally (just
open `index.html` or run a static file server).

## The 7 features, and where they live

### 1. Real provider results page — `results.html`
When someone searches (e.g. Plumber to Ranchi to Doranda), the location
form now redirects to `results.html?service=...&state=...&city=...&area=...`
instead of showing an alert. That page:
- Looks up matching providers from `app-data.js` and renders a card per
  provider: name, star rating + review count, a Call now button (a real
  `tel:` link), Book now, location, years of experience, and a Verified
  badge where applicable.
- Shows filter chips across the top if a service has providers in more
  than one city.
- Shows a friendly empty state (with a way back to search again) if there
  are genuinely no matches yet — never a dead page.
- Clicking a provider's name, or "Book now", opens a detail popup with
  their existing reviews and a way to leave a new one (see #4 below).

### 2. User profile page — `profile.html`
Reachable from the navbar ("Profile"). Shows:
- **Full name & email** — pulled in automatically from whatever was
  entered at signup; editable in place.
- **Saved addresses** — add a labeled address (Home, Work, etc.), remove
  any time.
- **Service history** — every search and booking made from the dashboard
  or results page shows up here automatically, with date and service type.

### 3. Become a Partner — `partner.html`
Reachable from the navbar. A form for Name, Phone, Service type (dropdown,
same 12 categories), State to City (dependent dropdown, same dataset as
the search form), and Experience. On submit, the provider is saved and
**immediately shows up in search results** — try registering as a Painter
in your own city, then search for Painters there.

### 4. Ratings & reviews
Built into the results page's provider popup: a 1-5 star picker and a
review text box. Submitted reviews appear instantly under that provider,
listed newest-first alongside the seeded reviews already there. A
provider's average rating recalculates as new reviews come in (only for
providers added through "Become a Partner" — the original seed providers
keep their fixed sample rating since their reviews are part of the demo
data, not really tied to a person).

### 5. Emergency numbers — on `dashboard.html`
A dedicated, always-visible section above "Why CityMate" with Ambulance
(108), Police (100), Fire Brigade (101), and a Women's Helpline (1091).
Each is a real `tel:` link — tapping it on a phone starts a call directly.

### 6. Dashboard stat cards — on `dashboard.html`
"500+ Verified providers", "50+ Cities covered", "1000+ Happy users",
right under the search box. They count up from 0 with an animated
ease-out effect the first time they scroll into view, then stay at their
final value.

### 7. Real location detection — "Use my current location" on `dashboard.html`
A button under the search box that calls the browser's
`navigator.geolocation.getCurrentPosition()`. On success, the coordinates
are sent to **OpenStreetMap's free Nominatim API** (no key needed) to turn
them into a city/state name, which is then matched against your existing
`india-locations.js` list. The next time someone picks a service, the
location form pre-fills with the detected state/city and jumps straight to
the Area field. If the person denies permission, or the browser doesn't
support geolocation, or the network call fails, a clear status message
explains what happened and the manual dropdowns still work as before —
geolocation is a shortcut, never a requirement.

> **Note on testing geolocation:** the sandbox this was built in blocks
> outbound requests to nominatim.openstreetmap.org, so the reverse
> geocoding call couldn't be exercised end-to-end here — only the
> permission flow and the graceful failure path were verified. Nominatim
> is a standard public API with no key requirement, so it should work
> normally once this is live on a real domain. If it doesn't, the most
> common cause is Nominatim's usage policy expecting a Referer or
> identifiable User-Agent header — see operations.osmfoundation.org's
> Nominatim usage policy page if you see 403 errors in production.

## How data is stored right now
There's still no backend, so `app-data.js` is the stand-in "database":
- **Seed data** (`SEED_PROVIDERS`, `SEED_REVIEWS`) ships with the site —
  a realistic set of providers across the 12 service categories so search
  always has something to show, concentrated around Ranchi/Jharkhand with
  a few in other major cities.
- **Anything a user adds** — new partner registrations, bookings/search
  history, reviews, profile edits and saved addresses — is saved to
  `localStorage` and merged on top of the seed data. It persists across
  reloads on the same browser/device, but isn't shared between devices or
  visible to other users (e.g. a review you write only appears on your own
  browser today, not for everyone visiting the site).

## Connecting this to a real backend later
Every page only ever calls functions on the `CityMateData` object in
`app-data.js` — none of them touch `localStorage` directly. That means
swapping in a real backend is mostly a matter of rewriting the bodies of
these functions to call your API instead:

```js
// Example: today
function getAllProviders(){
  const userAdded = readJSON(KEYS.providers, []);
  return SEED_PROVIDERS.concat(userAdded);
}

// Example: with a backend
function getAllProviders(){
  return fetch("/api/providers").then(res => res.json());
}
```
Note that today's version is synchronous and a real backend version would
be asynchronous (returns a Promise) — pages calling these functions would
need a small update to use `.then()` or `await`, but the call sites
themselves (`CityMateData.getAllProviders()`, `.addProvider(...)`, etc.)
would stay the same.

The login gate (`localStorage.citymate_loggedIn`) is still the same
frontend-only placeholder from before — swap it for a real session/token
check whenever a backend exists.

## Tested
Full flow tested end-to-end: signup, dashboard, stat card animation,
emergency tel: links, geolocation permission/fallback handling, service
search, results page, city filters, provider reviews (read + submit),
booking, Become a Partner, new provider appearing live in search,
profile (details, addresses, history), login gate on all three new pages,
and mobile responsive layout on every page.

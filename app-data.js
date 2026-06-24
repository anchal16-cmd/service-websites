/* =====================================================================
   CityMate — Shared app data & storage helpers
   ---------------------------------------------------------------------
   No backend exists yet, so this file is the stand-in "database":
     - SEED_PROVIDERS / SEED_REVIEWS ship with the site (read-only).
     - Anything a user adds (new partner signups, bookings, reviews,
       profile edits) is saved to localStorage and merged on top of the
       seed data, so it survives reloads on the same device/browser.
   When a real backend exists, replace the bodies of the CityMateData
   functions below with fetch() calls — every page only talks to this
   object, never to localStorage directly, so that's the one place
   that needs to change.
   ===================================================================== */

const EMERGENCY_NUMBERS = [
  { name: "Ambulance",     number: "108", emoji: "🚑" },
  { name: "Police",        number: "100", emoji: "🚓" },
  { name: "Fire Brigade",  number: "101", emoji: "🚒" },
  { name: "Women's Helpline", number: "1091", emoji: "🆘" }
];

const PLATFORM_STATS = [
  { value: 500, suffix: "+", label: "Verified providers" },
  { value: 50,  suffix: "+", label: "Cities covered" },
  { value: 1000, suffix: "+", label: "Happy users" }
];

// Seed providers: a handful of realistic providers per service so every
// category returns something, across a few major cities. Real providers
// added later via "Become a Partner" don't need to follow this list —
// they're addressed by whatever city/service they actually picked.
const SEED_PROVIDERS = [
  { id: "p001", name: "Raj Plumbing Service", service: "Plumber", city: "Ranchi", state: "Jharkhand", area: "Doranda", phone: "+91 98765 43210", rating: 4.8, reviewCount: 132, experience: 8, verified: true },
  { id: "p002", name: "Singh Pipe & Tap Works", service: "Plumber", city: "Ranchi", state: "Jharkhand", area: "Lalpur", phone: "+91 98765 11111", rating: 4.5, reviewCount: 76, experience: 5, verified: true },
  { id: "p003", name: "QuickFix Plumbers", service: "Plumber", city: "Patna", state: "Bihar", area: "Boring Road", phone: "+91 99887 23456", rating: 4.6, reviewCount: 98, experience: 6, verified: true },
  { id: "p004", name: "Mumbai Plumb Pro", service: "Plumber", city: "Mumbai", state: "Maharashtra", area: "Andheri East", phone: "+91 98200 12345", rating: 4.7, reviewCount: 210, experience: 10, verified: true },

  { id: "p005", name: "Bright Spark Electricals", service: "Electrician", city: "Ranchi", state: "Jharkhand", area: "Doranda", phone: "+91 97654 32109", rating: 4.9, reviewCount: 154, experience: 9, verified: true },
  { id: "p006", name: "PowerFix Electric Co.", service: "Electrician", city: "Bengaluru", state: "Karnataka", area: "Indiranagar", phone: "+91 90000 11223", rating: 4.6, reviewCount: 89, experience: 7, verified: true },
  { id: "p007", name: "Volt Masters", service: "Electrician", city: "Delhi", state: "Delhi", area: "Karol Bagh", phone: "+91 98111 22334", rating: 4.4, reviewCount: 61, experience: 4, verified: false },

  { id: "p008", name: "Sparkle Home Cleaning", service: "Maid / House Cleaning", city: "Ranchi", state: "Jharkhand", area: "Kanke Road", phone: "+91 96543 21098", rating: 4.7, reviewCount: 120, experience: 6, verified: true },
  { id: "p009", name: "TidyHome Services", service: "Maid / House Cleaning", city: "Pune", state: "Maharashtra", area: "Kothrud", phone: "+91 98765 99887", rating: 4.5, reviewCount: 73, experience: 5, verified: true },

  { id: "p010", name: "Sharma Furniture Works", service: "Carpenter", city: "Ranchi", state: "Jharkhand", area: "Bariatu", phone: "+91 95432 10987", rating: 4.6, reviewCount: 64, experience: 12, verified: true },
  { id: "p011", name: "WoodCraft Carpentry", service: "Carpenter", city: "Jaipur", state: "Rajasthan", area: "Malviya Nagar", phone: "+91 94321 09876", rating: 4.4, reviewCount: 45, experience: 8, verified: false },

  { id: "p012", name: "ColorTouch Painters", service: "Painter", city: "Ranchi", state: "Jharkhand", area: "Hinoo", phone: "+91 93210 98765", rating: 4.5, reviewCount: 58, experience: 7, verified: true },
  { id: "p013", name: "Wall Wizards", service: "Painter", city: "Hyderabad", state: "Telangana", area: "Gachibowli", phone: "+91 92345 67890", rating: 4.3, reviewCount: 39, experience: 5, verified: true },

  { id: "p014", name: "CoolAir AC Services", service: "AC Repair", city: "Ranchi", state: "Jharkhand", area: "Doranda", phone: "+91 91234 56789", rating: 4.7, reviewCount: 102, experience: 9, verified: true },
  { id: "p015", name: "FrostFix AC Repair", service: "AC Repair", city: "Chennai", state: "Tamil Nadu", area: "T. Nagar", phone: "+91 90123 45678", rating: 4.6, reviewCount: 84, experience: 6, verified: true },

  { id: "p016", name: "City Care Pharmacy", service: "Medical Shop / Pharmacy", city: "Ranchi", state: "Jharkhand", area: "Main Road", phone: "+91 89012 34567", rating: 4.8, reviewCount: 145, experience: 15, verified: true },
  { id: "p017", name: "HealthPlus Medicals", service: "Medical Shop / Pharmacy", city: "Lucknow", state: "Uttar Pradesh", area: "Hazratganj", phone: "+91 88901 23456", rating: 4.5, reviewCount: 67, experience: 10, verified: true },

  { id: "p018", name: "Doranda General Store", service: "General Store", city: "Ranchi", state: "Jharkhand", area: "Doranda", phone: "+91 87890 12345", rating: 4.4, reviewCount: 52, experience: 11, verified: true },

  { id: "p019", name: "FreshCart Grocery Delivery", service: "Grocery Delivery", city: "Ranchi", state: "Jharkhand", area: "Lalpur", phone: "+91 86789 01234", rating: 4.6, reviewCount: 91, experience: 4, verified: true },
  { id: "p020", name: "QuickBasket Delivery", service: "Grocery Delivery", city: "Kolkata", state: "West Bengal", area: "Salt Lake", phone: "+91 85678 90123", rating: 4.3, reviewCount: 48, experience: 3, verified: false },

  { id: "p021", name: "StyleCut Salon", service: "Salon / Barber", city: "Ranchi", state: "Jharkhand", area: "Hinoo", phone: "+91 84567 89012", rating: 4.7, reviewCount: 110, experience: 8, verified: true },
  { id: "p022", name: "Gentleman's Barber Studio", service: "Salon / Barber", city: "Mumbai", state: "Maharashtra", area: "Bandra West", phone: "+91 83456 78901", rating: 4.8, reviewCount: 176, experience: 9, verified: true },

  { id: "p023", name: "TechFix Mobile & Laptop Repair", service: "Computer / Mobile Repair", city: "Ranchi", state: "Jharkhand", area: "Main Road", phone: "+91 82345 67890", rating: 4.5, reviewCount: 88, experience: 6, verified: true },
  { id: "p024", name: "GadgetCare Solutions", service: "Computer / Mobile Repair", city: "Pune", state: "Maharashtra", area: "Viman Nagar", phone: "+91 81234 56789", rating: 4.4, reviewCount: 54, experience: 5, verified: false },

  { id: "p025", name: "Ranchi Emergency Ambulance Service", service: "Ambulance / Emergency", city: "Ranchi", state: "Jharkhand", area: "Doranda", phone: "+91 80123 45678", rating: 4.9, reviewCount: 203, experience: 14, verified: true }
];

// Seed reviews, keyed by provider id. New reviews submitted through the
// site are appended on top of these (see addReview below).
const SEED_REVIEWS = {
  p001: [
    { author: "Amit K.", rating: 5, text: "Fixed a tricky leak under the sink in 20 minutes. Very professional.", date: "2026-05-02" },
    { author: "Priya S.", rating: 4, text: "Good work, arrived a little late but called ahead.", date: "2026-04-18" }
  ],
  p005: [
    { author: "Neha R.", rating: 5, text: "Rewired our whole kitchen safely and explained everything clearly.", date: "2026-05-10" }
  ],
  p008: [
    { author: "Karan M.", rating: 5, text: "Spotless every time. Have been using them monthly for a year.", date: "2026-03-29" }
  ],
  p021: [
    { author: "Suman D.", rating: 5, text: "Best haircut I've had in Ranchi. Booking again next month.", date: "2026-06-01" },
    { author: "Rahul P.", rating: 4, text: "Nice ambience, slightly pricier than expected.", date: "2026-05-15" }
  ]
};

const CityMateData = (function () {
  const KEYS = {
    providers: "citymate_userProviders",   // array, partners added via the form
    bookings:  "citymate_bookings",        // array, one entry per search/booking
    reviews:   "citymate_userReviews",     // object keyed by provider id -> array
    profile:   "citymate_profile",         // object: fullName, email, addresses[]
    geo:       "citymate_lastLocation"     // object: lat, lng, label
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error("CityMateData: failed to read", key, err);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("CityMateData: failed to write", key, err);
      return false;
    }
  }

  /* ---------------- Providers ---------------- */

  function getAllProviders() {
    const userAdded = readJSON(KEYS.providers, []);
    return SEED_PROVIDERS.concat(userAdded);
  }

  function addProvider(provider) {
    const list = readJSON(KEYS.providers, []);
    const withDefaults = Object.assign({
      id: "u" + Date.now(),
      rating: 0,
      reviewCount: 0,
      verified: false
    }, provider);
    list.push(withDefaults);
    writeJSON(KEYS.providers, list);
    return withDefaults;
  }

  // Loose matching: service must match exactly (it comes from a fixed
  // dropdown so this is safe); city matches case-insensitively so
  // "ranchi" and "Ranchi" both work.
  function findProviders({ service, city }) {
    const all = getAllProviders();
    return all.filter(function (p) {
      const serviceOk = !service || p.service === service;
      const cityOk = !city || p.city.toLowerCase() === String(city).toLowerCase();
      return serviceOk && cityOk;
    });
  }

  function getProviderById(providerId) {
    return getAllProviders().find(function (p) { return p.id === providerId; }) || null;
  }

  /* ---------------- Bookings / search history ---------------- */

  function getBookings() {
    return readJSON(KEYS.bookings, []);
  }

  function addBooking(booking) {
    const list = getBookings();
    const entry = Object.assign({ id: "b" + Date.now(), date: new Date().toISOString() }, booking);
    list.unshift(entry); // most recent first
    writeJSON(KEYS.bookings, list);
    return entry;
  }

  /* ---------------- Reviews ---------------- */

  function getReviews(providerId) {
    const seeded = SEED_REVIEWS[providerId] || [];
    const userAdded = readJSON(KEYS.reviews, {})[providerId] || [];
    return seeded.concat(userAdded);
  }

  function addReview(providerId, review) {
    const all = readJSON(KEYS.reviews, {});
    if (!all[providerId]) all[providerId] = [];
    const entry = Object.assign({ date: new Date().toISOString().slice(0, 10) }, review);
    all[providerId].push(entry);
    writeJSON(KEYS.reviews, all);

    // Keep the provider's aggregate rating roughly in sync if it's a
    // user-added provider (seed providers keep their fixed rating).
    const userProviders = readJSON(KEYS.providers, []);
    const match = userProviders.find(function (p) { return p.id === providerId; });
    if (match) {
      const allReviews = getReviews(providerId);
      const avg = allReviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / allReviews.length;
      match.rating = Math.round(avg * 10) / 10;
      match.reviewCount = allReviews.length;
      writeJSON(KEYS.providers, userProviders);
    }
    return entry;
  }

  /* ---------------- Profile ---------------- */

  function getProfile() {
    return readJSON(KEYS.profile, {
      fullName: localStorage.getItem("citymate_userFullName") || "",
      email: localStorage.getItem("citymate_userEmail") || "",
      phone: "",
      address: "",
      addresses: []
    });
  }

  function saveProfile(profile) {
    writeJSON(KEYS.profile, profile);
  }

  function addAddress(address) {
    const profile = getProfile();
    profile.addresses = profile.addresses || [];
    profile.addresses.push(address);
    saveProfile(profile);
    return profile;
  }

  /* ---------------- Geolocation (last known) ---------------- */

  function getLastLocation() {
    return readJSON(KEYS.geo, null);
  }

  function saveLastLocation(loc) {
    writeJSON(KEYS.geo, loc);
  }

  /* ---------------- Session ---------------- */

  // Called on logout. Clears the login flag plus anything that identifies
  // *who* is logged in (name/email/profile), so a stale name/avatar from
  // the previous session can never flash on screen for the next person to
  // use this device, and the guarded pages immediately deny access again.
  // Deliberately leaves booking history / reviews / partner listings
  // alone — those are this device's marketplace data, not session state,
  // and shouldn't disappear just because someone logged out.
  function clearSession() {
    localStorage.setItem("citymate_loggedIn", "false");
    localStorage.removeItem("citymate_userEmail");
    localStorage.removeItem("citymate_userFullName");
    localStorage.removeItem(KEYS.profile);
  }

  return {
    getAllProviders: getAllProviders,
    addProvider: addProvider,
    findProviders: findProviders,
    getProviderById: getProviderById,
    getBookings: getBookings,
    addBooking: addBooking,
    getReviews: getReviews,
    addReview: addReview,
    getProfile: getProfile,
    saveProfile: saveProfile,
    addAddress: addAddress,
    getLastLocation: getLastLocation,
    saveLastLocation: saveLastLocation,
    clearSession: clearSession
  };
})();

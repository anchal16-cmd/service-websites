/* =====================================================
   CITYMATE USER DASHBOARD — SCRIPT
   "Your First Friend in Every City"
   =====================================================
   Table of Contents:
   0. Auth Guard + Logout
   1. App Data
   2. DOM References
   3. Dynamic Greeting
   4. Location Dropdown
   5. Search Functionality
   6. Notification Badge
   7. Feature Card Interactions
   8. Popular Service Pills
   9. Bottom Navigation
   10. Button Ripple Effect
   11. Init
   ===================================================== */

import { requireAuth, wireLogout } from "./auth-helpers.js";

(function () {
    'use strict';

    /* =====================================================
       0. AUTH GUARD + LOGOUT
       ===================================================== */

    // currentUser is filled in once Firebase confirms who is logged in.
    // Starts with a safe fallback so the page still renders instantly.
    const currentUser = { name: 'there' };

    wireLogout(document.getElementById('logoutBtn'), 'index.html');

    requireAuth('users', 'user-login.html', (user, profile) => {
        currentUser.name = profile?.name || user.displayName || user.email?.split('@')[0] || 'there';
        setDynamicGreeting();
    });


    /* =====================================================
       1. APP DATA
       ===================================================== */

    // Searchable directory powering the search suggestions list
    const searchDirectory = [
        { label: 'Plumber', icon: 'fa-faucet-drip', category: 'Local Services' },
        { label: 'Electrician', icon: 'fa-bolt', category: 'Local Services' },
        { label: 'Carpenter', icon: 'fa-hammer', category: 'Local Services' },
        { label: 'Painter', icon: 'fa-paint-roller', category: 'Local Services' },
        { label: 'Maid Services', icon: 'fa-broom', category: 'Local Services' },
        { label: 'Grocery Stores', icon: 'fa-cart-shopping', category: 'Nearby Shops' },
        { label: 'Medical Store', icon: 'fa-pills', category: 'Nearby Shops' },
        { label: 'Ambulance', icon: 'fa-truck-medical', category: 'Emergency' },
        { label: 'Police Helpline', icon: 'fa-shield-halved', category: 'Emergency' },
        { label: 'Fire Brigade', icon: 'fa-fire-extinguisher', category: 'Emergency' },
        { label: 'Tourist Spots', icon: 'fa-map-location-dot', category: 'Explore Area' },
        { label: 'Hospitals', icon: 'fa-hospital', category: 'Explore Area' },
        { label: 'Schools', icon: 'fa-school', category: 'Explore Area' },
        { label: 'Restaurants', icon: 'fa-utensils', category: 'Food & Restaurants' },
        { label: 'Cafes', icon: 'fa-mug-saucer', category: 'Food & Restaurants' },
        { label: 'Auto Rickshaw', icon: 'fa-motorcycle', category: 'Transport' },
        { label: 'Cab Booking', icon: 'fa-car-side', category: 'Transport' },
        { label: 'Bus Routes', icon: 'fa-bus', category: 'Transport' },
    ];


    /* =====================================================
       2. DOM REFERENCES
       ===================================================== */

    const greetingMessageEl = document.getElementById('greetingMessage');
    const userNameEl = document.getElementById('userName');

    const notificationBtn = document.getElementById('notificationBtn');
    const notificationBadge = document.getElementById('notificationBadge');

    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');

    const featureCards = document.querySelectorAll('.feature-card');
    const servicePills = document.querySelectorAll('.service-pill');
    const viewAllBtn = document.getElementById('viewAllBtn');

    const navItems = document.querySelectorAll('.nav-item');


    /* =====================================================
       3. DYNAMIC GREETING
       ===================================================== */

    /**
     * Builds a greeting string based on the current hour of day.
     * Morning: 5am - 11:59am | Afternoon: 12pm - 4:59pm | Evening/Night: rest
     */
    function setDynamicGreeting() {
        const hour = new Date().getHours();
        let greeting;

        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }

        greetingMessageEl.textContent = greeting;
        userNameEl.textContent = currentUser.name;
    }


    /* =====================================================
       4. LOCATION DROPDOWN
       ===================================================== */

    /**
     * Wires the header's city/area search input to the OpenStreetMap
     * Nominatim API and renders clickable suggestions.
     */
    function initLocationDropdown() {
        const input = document.getElementById('location');
        const suggestions = document.getElementById('suggestions');

        if (!input || !suggestions) return;

        let timer;

        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(searchLocation, 400);
        });

        async function searchLocation() {
            const query = input.value.trim();

            if (query.length < 3) {
                suggestions.innerHTML = '';
                return;
            }

            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                suggestions.innerHTML = '';

                if (data.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = 'No matching places found';
                    suggestions.appendChild(li);
                    return;
                }

                data.forEach((place) => {
                    const li = document.createElement('li');
                    li.textContent = place.display_name;

                    li.onclick = () => {
                        input.value = place.display_name;
                        suggestions.innerHTML = '';
                    };

                    suggestions.appendChild(li);
                });
            } catch (err) {
                console.error('Location lookup failed:', err);
            }
        }

        // Close suggestions when clicking outside
        document.addEventListener('click', (event) => {
            if (!input.contains(event.target) && !suggestions.contains(event.target)) {
                suggestions.innerHTML = '';
            }
        });
    }


    /* =====================================================
       5. SEARCH FUNCTIONALITY
       ===================================================== */

    function renderSuggestions(items) {
        searchSuggestions.innerHTML = '';

        if (items.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'no-results';
            emptyItem.textContent = 'No matching services or places found';
            searchSuggestions.appendChild(emptyItem);
            searchSuggestions.classList.add('show');
            return;
        }

        items.forEach((item) => {
            const listItem = document.createElement('li');

            const icon = document.createElement('i');
            icon.className = `fa-solid ${item.icon}`;

            const text = document.createElement('span');
            text.textContent = `${item.label} — ${item.category}`;

            listItem.appendChild(icon);
            listItem.appendChild(text);

            listItem.addEventListener('click', () => {
                searchInput.value = item.label;
                closeSuggestions();
                searchInput.focus();

                // Jump straight to the relevant listing when it maps to
                // one of the Local Services categories.
                if (item.category === 'Local Services') {
                    window.location.href = `providers.html?service=${encodeURIComponent(item.label.replace(' Services', ''))}`;
                }
            });

            searchSuggestions.appendChild(listItem);
        });

        searchSuggestions.classList.add('show');
    }

    function closeSuggestions() {
        searchSuggestions.classList.remove('show');
    }

    function handleSearchInput() {
        const query = searchInput.value.trim().toLowerCase();

        searchClearBtn.classList.toggle('show', query.length > 0);

        if (query.length === 0) {
            closeSuggestions();
            return;
        }

        const results = searchDirectory.filter((item) =>
            item.label.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        renderSuggestions(results);
    }

    function initSearch() {
        searchInput.addEventListener('input', handleSearchInput);

        searchInput.addEventListener('focus', () => {
            searchBar.classList.add('focused');
            if (searchInput.value.trim().length > 0) {
                handleSearchInput();
            }
        });

        searchInput.addEventListener('blur', () => {
            searchBar.classList.remove('focused');
        });

        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchClearBtn.classList.remove('show');
            closeSuggestions();
            searchInput.focus();
        });

        // Close suggestions when clicking outside the search section
        document.addEventListener('click', (event) => {
            const searchSection = searchInput.closest('.search-section');
            if (searchSection && !searchSection.contains(event.target)) {
                closeSuggestions();
            }
        });

        // Allow Enter key to jump to the first matching suggestion
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const firstResult = searchSuggestions.querySelector('li:not(.no-results)');
                if (firstResult) {
                    firstResult.click();
                }
            }
            if (event.key === 'Escape') {
                closeSuggestions();
                searchInput.blur();
            }
        });
    }


    /* =====================================================
       6. NOTIFICATION BADGE
       ===================================================== */

    function initNotifications() {
        let unreadCount = parseInt(notificationBadge.textContent, 10) || 0;

        notificationBtn.addEventListener('click', () => {
            notificationBtn.classList.remove('ringing');
            void notificationBtn.offsetWidth;
            notificationBtn.classList.add('ringing');

            if (unreadCount > 0) {
                unreadCount = 0;
                notificationBadge.textContent = '0';
                notificationBadge.classList.add('hidden');
            }
        });
    }


    /* =====================================================
       7. FEATURE CARD INTERACTIONS
       ===================================================== */

    function initFeatureCards() {
        featureCards.forEach((card) => {
            card.addEventListener('click', (event) => {
                spawnRipple(card, event);
            });
        });
    }


    /* =====================================================
       8. POPULAR SERVICE PILLS
       ===================================================== */

    function initServicePills() {
        servicePills.forEach((pill) => {
            pill.addEventListener('click', (event) => {
                const icon = pill.querySelector('.service-pill-icon');
                spawnRipple(icon, event, true);

                const service = pill.dataset.service;
                if (service && service !== 'more') {
                    const label = service.charAt(0).toUpperCase() + service.slice(1);
                    setTimeout(() => {
                        window.location.href = `providers.html?service=${encodeURIComponent(label)}`;
                    }, 200);
                } else if (service === 'more') {
                    window.location.href = 'local-services.html';
                }
            });
        });

        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                viewAllBtn.classList.add('bounce');
                setTimeout(() => viewAllBtn.classList.remove('bounce'), 400);
                window.location.href = 'local-services.html';
            });
        }
    }


    /* =====================================================
       9. BOTTOM NAVIGATION
       ===================================================== */

    function setActiveNavItem(targetItem) {
        navItems.forEach((item) => item.classList.remove('active'));
        targetItem.classList.add('active');
        targetItem.classList.add('bounce');
        setTimeout(() => targetItem.classList.remove('bounce'), 400);
    }

    function initBottomNav() {
        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                setActiveNavItem(item);
            });
        });
    }


    /* =====================================================
       10. BUTTON RIPPLE EFFECT
       ===================================================== */

    /**
     * Creates a circular ripple at the click position inside the target
     * element. The target must have position: relative/absolute and
     * overflow: hidden (feature cards already do via CSS).
     */
    function spawnRipple(target, event, isCircular) {
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = isCircular ? Math.max(rect.width, rect.height) : Math.max(rect.width, rect.height) * 1.4;

        ripple.className = 'ripple';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${(event.clientX - rect.left) - size / 2}px`;
        ripple.style.top = `${(event.clientY - rect.top) - size / 2}px`;

        const previousPosition = getComputedStyle(target).position;
        if (previousPosition === 'static') {
            target.style.position = 'relative';
        }
        target.style.overflow = target.style.overflow || 'hidden';

        target.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }


    /* =====================================================
       11. INIT
       ===================================================== */

    function init() {
        setDynamicGreeting();
        initLocationDropdown();
        initSearch();
        initNotifications();
        initFeatureCards();
        initServicePills();
        initBottomNav();
    }

    document.addEventListener('DOMContentLoaded', init);
})();

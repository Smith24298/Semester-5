/* ============================================================
   Search PG — Student Page
   - Geolocation API: "Use My Location" -> lat/lng + current city
   - LocalStorage keys: properties, wishlist, recentSearches, theme
   - Reverse geocoding via BigDataCloud (fallback: Nominatim)
   - No inline JS / inline handlers — event listeners only
   ============================================================ */

/* ---------- LocalStorage keys ---------- */
const KEY_PROPERTIES = "properties";
const KEY_WISHLIST = "wishlist";        
const KEY_RECENT = "recentSearches";
const KEY_THEME = "theme";

/* ---------- App state ---------- */
let properties = [];        // all PGs from LocalStorage
let wishlist = [];          // saved PG ids
let recentSearches = [];    // last N search terms

const state = {
    userLocation: null,     // { lat, lng } from Geolocation API
    currentCity: null,      // reverse-geocoded city name
    resultList: [],         // currently displayed list
    view: "search",         // "search" | "wishlist"
    gender: "all",          // all | boys | girls | unisex
    nearby: false,          // true while showing nearby PGs
    searchTerm: ""
};

/* ---------- Cached DOM references ---------- */
const dom = {
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon"),
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    locateBtn: document.getElementById("locateBtn"),
    locateBtnText: document.getElementById("locateBtnText"),
    locationPanel: document.getElementById("locationPanel"),
    latValue: document.getElementById("latValue"),
    lngValue: document.getElementById("lngValue"),
    cityValue: document.getElementById("cityValue"),
    nearbyBtn: document.getElementById("nearbyBtn"),
    recentSection: document.getElementById("recentSection"),
    recentChips: document.getElementById("recentChips"),
    clearRecentBtn: document.getElementById("clearRecentBtn"),
    resultsTitle: document.getElementById("resultsTitle"),
    resultsSubtitle: document.getElementById("resultsSubtitle"),
    resultsGrid: document.getElementById("resultsGrid"),
    emptyState: document.getElementById("emptyState"),
    emptyTitle: document.getElementById("emptyTitle"),
    emptyText: document.getElementById("emptyText"),
    loadDemoBtn: document.getElementById("loadDemoBtn"),
    wishlistLink: document.getElementById("wishlistLink"),
    wishlistCount: document.getElementById("wishlistCount"),
    toastContainer: document.getElementById("toastContainer")
};

/* ============================================================
   LocalStorage helpers
   ============================================================ */

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        const value = JSON.parse(raw);
        return Array.isArray(value) ? value : fallback;
    } catch (err) {
        return fallback;
    }
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadProperties() {
    properties = readJSON(KEY_PROPERTIES, []);
    return properties;
}

function saveProperties() {
    writeJSON(KEY_PROPERTIES, properties);
}

function loadWishlist() {
    wishlist = readJSON(KEY_WISHLIST, []);
    return wishlist;
}

function saveWishlist() {
    writeJSON(KEY_WISHLIST, wishlist);
}

function loadRecentSearches() {
    recentSearches = readJSON(KEY_RECENT, []);
    return recentSearches;
}

function saveRecentSearches() {
    writeJSON(KEY_RECENT, recentSearches);
}

/* ============================================================
   Theme preference (LocalStorage: "theme")
   ============================================================ */

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    dom.themeIcon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
}

function initTheme() {
    const saved = localStorage.getItem(KEY_THEME) || "light";
    applyTheme(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(KEY_THEME, current);
    applyTheme(current);
    showToast(current === "dark" ? "Dark theme enabled" : "Light theme enabled", "info");
}

/* ============================================================
   Geolocation API
   ============================================================ */

/** Wrap getCurrentPosition in a Promise. */
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 60000
        });
    });
}

/** Reverse geocode lat/lng into a city name. */
async function reverseGeocode(lat, lng) {
    // Primary: BigDataCloud (CORS-friendly client endpoint, no key needed)
    try {
        const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        if (res.ok) {
            const data = await res.json();
            return data.city || data.locality || data.principalSubdivision || "Unknown";
        }
    } catch (err) { /* fall through */ }

    // Fallback: OpenStreetMap Nominatim
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            return a.city || a.town || a.village || a.state_district || a.county || "Unknown";
        }
    } catch (err) { /* fall through */ }

    return "Unknown";
}

/** Map Geolocation error codes to friendly messages. */
function geoErrorMessage(err) {
    switch (err && err.code) {
        case err.PERMISSION_DENIED:
            return "Location permission was denied. Please allow access and try again.";
        case err.POSITION_UNAVAILABLE:
            return "Your location is currently unavailable. Try again later.";
        case err.TIMEOUT:
            return "Timed out while fetching your location. Try again.";
        default:
            return "Unable to fetch your location.";
    }
}

function setLocating(active) {
    dom.locateBtn.disabled = active;
    dom.locateBtnText.textContent = active ? "Locating..." : "Use My Location";
}

/** Fetch the user's position, show lat/lng + city, then run callback. */
async function useMyLocation(callback) {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by this browser", "error");
        return;
    }

    setLocating(true);
    try {
        const pos = await getPosition();
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        state.userLocation = { lat, lng };
        state.nearby = false;

        dom.latValue.textContent = lat.toFixed(6);
        dom.lngValue.textContent = lng.toFixed(6);
        dom.cityValue.textContent = "Detecting...";
        dom.locationPanel.classList.remove("d-none");

        const city = await reverseGeocode(lat, lng);
        state.currentCity = city;
        dom.cityValue.textContent = city;
        showToast(`Location detected in ${city}`, "success");

        if (typeof callback === "function") callback();
    } catch (err) {
        showToast(geoErrorMessage(err), "error");
    } finally {
        setLocating(false);
    }
}

/* ============================================================
   Distance helpers (haversine)
   ============================================================ */

function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = d => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

function distanceLabel(km) {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

/** Distance from the user's location to a property, or null. */
function distanceToProperty(p) {
    if (!state.userLocation) return null;
    if (p.lat == null || p.lng == null) return null;
    return haversineKm(state.userLocation.lat, state.userLocation.lng, Number(p.lat), Number(p.lng));
}

/* ============================================================
   Search
   ============================================================ */

function handleSearch(term) {
    term = (term || "").trim();
    state.searchTerm = term;
    state.view = "search";
    state.nearby = false;
    dom.wishlistLink.classList.remove("active");

    if (!term) {
        state.resultList = [...properties];
        dom.resultsTitle.textContent = "Available PGs";
        dom.resultsSubtitle.textContent = "Browse verified properties near you";
    } else {
        const q = term.toLowerCase();
        state.resultList = properties.filter(p =>
            [p.propertyName, p.location, p.city, p.state, p.address, p.description]
                .some(v => (v || "").toLowerCase().includes(q))
        );
        dom.resultsTitle.textContent = `Results for "${term}"`;
        dom.resultsSubtitle.textContent = `${state.resultList.length} propert${state.resultList.length === 1 ? "y" : "ies"} found`;
        addRecentSearch(term);
    }

    renderAll();
}

function addRecentSearch(term) {
    recentSearches = recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase());
    recentSearches.unshift(term);
    recentSearches = recentSearches.slice(0, 8);
    saveRecentSearches();
    renderRecentChips();
}

function renderRecentChips() {
    dom.recentChips.innerHTML = "";
    dom.recentSection.classList.toggle("d-none", recentSearches.length === 0);
    recentSearches.forEach(term => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "recent-chip";
        chip.textContent = term;
        chip.addEventListener("click", () => {
            dom.searchInput.value = term;
            handleSearch(term);
        });
        dom.recentChips.appendChild(chip);
    });
}

function clearRecentSearches() {
    recentSearches = [];
    saveRecentSearches();
    renderRecentChips();
    showToast("Recent searches cleared", "info");
}

/* ============================================================
   Nearby PGs
   ============================================================ */

function showNearbyPgs() {
    if (!state.userLocation || !state.currentCity) {
        useMyLocation(findNearby);
        return;
    }
    findNearby();
}

function findNearby() {
    const city = (state.currentCity || "").toLowerCase();

    // Candidates: PGs with coordinates, or PGs in the detected city
    let list = properties.filter(p => {
        const hasCoords = p.lat != null && p.lng != null;
        const sameCity = Boolean(city) && (p.city || "").toLowerCase() === city;
        return hasCoords || sameCity;
    });

    // Sort by distance; properties without coords go last
    list.sort((a, b) => (distanceToProperty(a) ?? Infinity) - (distanceToProperty(b) ?? Infinity));

    state.resultList = list;
    state.view = "search";
    state.nearby = true;
    state.searchTerm = "";
    dom.searchInput.value = "";
    dom.wishlistLink.classList.remove("active");

    dom.resultsTitle.textContent = city ? `Nearby PGs in ${capitalize(city)}` : "Nearby PGs";
    dom.resultsSubtitle.textContent = `${list.length} propert${list.length === 1 ? "y" : "ies"} found around your location`;
    renderAll();
}

/* ============================================================
   Wishlist (LocalStorage: "wishlist")
   ============================================================ */

function renderWishlistCount() {
    dom.wishlistCount.textContent = wishlist.length;
    dom.wishlistCount.classList.toggle("d-none", wishlist.length === 0);
}

function toggleWishlist(id) {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
        showToast("Added to your wishlist", "success");
    } else {
        wishlist.splice(index, 1);
        showToast("Removed from your wishlist", "info");
    }
    saveWishlist();
    renderWishlistCount();
    updateAllHearts();
}

function updateAllHearts() {
    document.querySelectorAll("[data-wish-id]").forEach(btn => {
        const active = wishlist.includes(btn.dataset.wishId);
        btn.classList.toggle("active", active);
        btn.querySelector("i").className = active ? "bi bi-heart-fill" : "bi bi-heart";
    });
}

function toggleWishlistView() {
    if (state.view === "wishlist") {
        state.view = "search";
        state.resultList = [...properties];
        dom.resultsTitle.textContent = "Available PGs";
        dom.resultsSubtitle.textContent = "Browse verified properties near you";
        dom.wishlistLink.classList.remove("active");
    } else {
        state.view = "wishlist";
        dom.resultsTitle.textContent = "My Wishlist";
        dom.resultsSubtitle.textContent = `${wishlist.length} saved propert${wishlist.length === 1 ? "y" : "ies"}`;
        dom.wishlistLink.classList.add("active");
    }
    renderAll();
}

/* ============================================================
   Rendering
   ============================================================ */

function renderAll() {
    let list = [...state.resultList];

    if (state.view === "wishlist") {
        list = properties.filter(p => wishlist.includes(p.id));
    } else {
        // Only show properties that are marked as available for booking
        list = list.filter(p => (p.availability || "available") === "available");
    }

    if (state.gender !== "all") {
        list = list.filter(p => (p.gender || "") === state.gender);
    }

    if (list.length === 0) {
        dom.resultsGrid.innerHTML = "";
        dom.emptyState.classList.remove("d-none");
        if (state.view === "wishlist") {
            dom.emptyTitle.textContent = "Your Wishlist is Empty";
            dom.emptyText.textContent = "Tap the heart on any PG to save it here for later.";
            dom.loadDemoBtn.classList.add("d-none");
        } else {
            dom.loadDemoBtn.classList.remove("d-none");
            if (state.searchTerm) {
                dom.emptyTitle.textContent = "No PGs Found";
                dom.emptyText.textContent = "We couldn't find anything matching your search. Try another keyword.";
            } else {
                dom.emptyTitle.textContent = "No PGs Listed Yet";
                dom.emptyText.textContent = "Be the first to add a PG, or load sample data to explore the demo.";
            }
        }
        return;
    }

    dom.emptyState.classList.add("d-none");
    dom.resultsGrid.innerHTML = list.map(propertyCardHTML).join("");
    updateAllHearts();
}

function propertyCardHTML(p) {
    const img = (p.images && p.images.length) ? p.images[0] : (p.image || "");
    const imageBlock = img
        ? `<img src="${img}" alt="${escapeHTML(p.propertyName)}">`
        : `<div class="pg-image no-image"><i class="bi bi-house-door"></i></div>`;

    const dist = distanceToProperty(p);
    const distBadge = state.nearby && dist !== null
        ? `<span class="dist-badge"><i class="bi bi-signpost"></i>${distanceLabel(dist)} away</span>`
        : "";

    const isFav = wishlist.includes(p.id);

    return `
    <div class="col-md-6 col-lg-4">
        <div class="pg-card">
            <div class="pg-image">
                ${imageBlock}
                <button type="button" class="wishlist-btn ${isFav ? "active" : ""}" data-wish-id="${escapeHTML(p.id)}"
                        title="Save to wishlist" aria-label="Save to wishlist">
                    <i class="bi ${isFav ? "bi-heart-fill" : "bi-heart"}"></i>
                </button>
                ${distBadge}
            </div>
            <div class="pg-body">
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <h5 class="pg-name" title="${escapeHTML(p.propertyName)}">${escapeHTML(p.propertyName)}</h5>
                    <span class="gender-badge gender-${escapeHTML(p.gender || "unisex")}">${genderLabel(p.gender)}</span>
                </div>
                <p class="pg-location"><i class="bi bi-geo-alt"></i>${escapeHTML(p.location || "")}, ${escapeHTML(p.city || "")}</p>
                <div class="pg-meta">
                    <span><i class="bi bi-door-open"></i>${roomTypeLabel(p.roomType)}</span>
                    <span><i class="bi bi-boxes"></i>${Number(p.availableRooms) || 0} rooms left</span>
                </div>
                <div class="pg-footer">
                    <div class="pg-rent">₹${formatRent(p.monthlyRent)} <small>/month</small></div>
                    <span class="status-badge status-${escapeHTML(p.availability)}">${statusLabel(p.availability)}</span>
                </div>
            </div>
        </div>
    </div>`;
}

/* ============================================================
   Sample data (for demo)
   ============================================================ */

function seedSampleData() {
    const now = new Date().toISOString();
    const sample = [
        {
            id: "sample-1", propertyName: "Green Valley PG", propertyType: "pg", roomType: "double",
            gender: "boys", location: "Chandlodia, near Nirma University", city: "Ahmedabad",
            state: "Gujarat", pincode: "382481", lat: 23.0442, lng: 72.5360,
            monthlyRent: 8500, securityDeposit: 17000, availableRooms: 12,
            availability: "available", description: "Spacious double-sharing rooms, mess with home-style food and high-speed Wi-Fi.",
            facilities: ["wifi", "meals", "security", "housekeeping"], contactNumber: "9876501234",
            ownerEmail: "owner@greenvalley.in",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
            createdAt: now
        },
        {
            id: "sample-2", propertyName: "Sunrise Boys Hostel", propertyType: "hostel", roomType: "triple",
            gender: "boys", location: "Sarkhej, SG Highway", city: "Ahmedabad",
            state: "Gujarat", pincode: "382210", lat: 23.0355, lng: 72.5000,
            monthlyRent: 7000, securityDeposit: 14000, availableRooms: 8,
            availability: "available", description: "Budget hostel with gym access, cafeteria and 24x7 power backup.",
            facilities: ["wifi", "laundry", "powerBackup", "cctv"], contactNumber: "9822334455",
            ownerEmail: "info@sunrisehostel.in",
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
            images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
            createdAt: now
        },
        {
            id: "sample-3", propertyName: "Kamla Girls PG", propertyType: "pg", roomType: "single",
            gender: "girls", location: "Nirma University Road", city: "Ahmedabad",
            state: "Gujarat", pincode: "382481", lat: 23.0400, lng: 72.5300,
            monthlyRent: 9800, securityDeposit: 20000, availableRooms: 5,
            availability: "available", description: "Premium girls PG with AC rooms, study lounge and canteen on campus.",
            facilities: ["wifi", "ac", "meals", "security", "studyArea"], contactNumber: "9979876543",
            ownerEmail: "kamla@example.com",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
            images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
            createdAt: now
        },
        {
            id: "sample-4", propertyName: "Crystal Unisex PG", propertyType: "pg", roomType: "dormitory",
            gender: "unisex", location: "SG Highway, near Mahagujarat", city: "Ahmedabad",
            state: "Gujarat", pincode: "380054", lat: 23.0250, lng: 72.5200,
            monthlyRent: 6500, securityDeposit: 13000, availableRooms: 20,
            availability: "available", description: "Hygienic dormitory beds with lockers, common kitchen and TV lounge.",
            facilities: ["wifi", "laundry", "water", "cctv"], contactNumber: "9090909090",
            ownerEmail: "crystal@example.com",
            image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800",
            images: ["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800"],
            createdAt: now
        },
        {
            id: "sample-5", propertyName: "Shree Sai Residency", propertyType: "apartment", roomType: "double",
            gender: "boys", location: "Chandlodia, near EWS Hostel", city: "Ahmedabad",
            state: "Gujarat", pincode: "382481", lat: 23.0500, lng: 72.5400,
            monthlyRent: 8200, securityDeposit: 16000, availableRooms: 7,
            availability: "available", description: "Fully-furnished apartment-style PG with weekly housekeeping.",
            facilities: ["wifi", "housekeeping", "powerBackup", "security"], contactNumber: "9123456780",
            ownerEmail: "sai.residency@example.com",
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
            images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
            createdAt: now
        },
        {
            id: "sample-6", propertyName: "Lake View Hostel", propertyType: "hostel", roomType: "single",
            gender: "unisex", location: "Science City Road", city: "Ahmedabad",
            state: "Gujarat", pincode: "380060", lat: 23.0300, lng: 72.5100,
            monthlyRent: 10500, securityDeposit: 21000, availableRooms: 4,
            availability: "pending", description: "Premium hostel facing the lake with rooftop café and co-working space.",
            facilities: ["wifi", "gym", "meals", "ac", "studyArea"], contactNumber: "9234567890",
            ownerEmail: "lakeview@example.com",
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"],
            createdAt: now
        }
    ];

    // Merge with existing properties (do not wipe owner data)
    const existingIds = new Set(properties.map(p => p.id));
    sample.forEach(p => { if (!existingIds.has(p.id)) properties.push(p); });
    saveProperties();
    loadProperties();
    showToast("Sample PGs loaded successfully", "success");
}

/* ============================================================
   Toast messages
   ============================================================ */

function showToast(message, type = "success") {
    const iconMap = { success: "check-circle-fill", error: "x-circle-fill", info: "info-circle-fill" };
    const toastClass = type === "error" ? "toast-error"
        : type === "info" ? "toast-info"
        : "toast-success";

    const toast = document.createElement("div");
    toast.className = `toast show ${toastClass}`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="toast-body">
            <i class="bi bi-${iconMap[type] || iconMap.info}"></i>
            <span>${escapeHTML(message)}</span>
        </div>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => toast.remove(), 350);
    }, 3000);
}

/* ============================================================
   Small helpers
   ============================================================ */

function formatRent(value) {
    return (Number(value) || 0).toLocaleString("en-IN");
}

function genderLabel(gender) {
    return { boys: "Boys", girls: "Girls", unisex: "Unisex" }[gender] || "Unisex";
}

function statusLabel(status) {
    return { available: "Available", occupied: "Occupied", pending: "Pending" }[status] || "Available";
}

function roomTypeLabel(type) {
    return { single: "Single", double: "Double", triple: "Triple", dormitory: "Dormitory" }[type] || type || "Any";
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

function escapeHTML(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* ============================================================
   Event listeners
   ============================================================ */

// Search
dom.searchBtn.addEventListener("click", () => handleSearch(dom.searchInput.value));
dom.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch(dom.searchInput.value);
});

// Geolocation
dom.locateBtn.addEventListener("click", () => useMyLocation());
dom.nearbyBtn.addEventListener("click", showNearbyPgs);

// Recent searches
dom.clearRecentBtn.addEventListener("click", clearRecentSearches);

// Gender filter (event delegation)
document.getElementById("genderFilter").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-filter");
    if (!chip) return;
    state.gender = chip.dataset.gender;
    document.querySelectorAll(".chip-filter").forEach(c => c.classList.toggle("active", c === chip));
    renderAll();
});

// Wishlist heart toggles (event delegation)
dom.resultsGrid.addEventListener("click", (e) => {
    const heart = e.target.closest("[data-wish-id]");
    if (heart) toggleWishlist(heart.dataset.wishId);
});

// Wishlist nav link
dom.wishlistLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleWishlistView();
    document.querySelector(".results-section").scrollIntoView({ behavior: "smooth" });
});

// Theme toggle
dom.themeToggle.addEventListener("click", toggleTheme);

// Demo data
dom.loadDemoBtn.addEventListener("click", () => {
    seedSampleData();
    state.resultList = [...properties];
    state.view = "search";
    dom.resultsTitle.textContent = "Available PGs";
    dom.resultsSubtitle.textContent = "Browse verified properties near you";
    renderAll();
});

/* ============================================================
   Init
   ============================================================ */

initTheme();
loadProperties();
loadWishlist();
loadRecentSearches();

renderWishlistCount();
renderRecentChips();

// Show all PGs on first load
state.resultList = [...properties];
state.view = "search";
renderAll();

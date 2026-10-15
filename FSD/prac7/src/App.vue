<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Navbar from "./components/Navbar.vue";
import SearchBar from "./components/SearchBar.vue";
import PropertyCard from "./components/PropertyCard.vue";
import { facilityOptions, labels, sampleProperties } from "./data/properties";

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const properties = ref(read("properties", sampleProperties));
const wishlist = ref(read("wishlist", []));
const recentSearches = ref(read("recentSearches", []));
const dark = ref(localStorage.getItem("theme") === "dark");
const view = ref("search");
const query = ref("");
const genderFilter = ref("all");
const statusFilter = ref("all");
const sortOrder = ref("newest");
const notice = ref("");
const locating = ref(false);
const locationInfo = ref(null);
const editingId = ref(null);
const selectedProperty = ref(null);
const emptyForm = () => ({
  propertyName: "",
  propertyType: "pg",
  roomType: "single",
  gender: "unisex",
  location: "",
  city: "",
  state: "",
  pincode: "",
  address: "",
  monthlyRent: "",
  securityDeposit: "",
  availableRooms: 1,
  availability: "available",
  description: "",
  contactNumber: "",
  ownerEmail: "",
  image: "",
  facilities: [],
});
const form = ref(emptyForm());

const filteredProperties = computed(() => {
  let list =
    view.value === "wishlist"
      ? properties.value.filter((property) =>
          wishlist.value.includes(property.id),
        )
      : [...properties.value];
  const search = query.value.trim().toLowerCase();
  if (search)
    list = list.filter((property) =>
      [
        property.propertyName,
        property.location,
        property.city,
        property.state,
        property.roomType,
        property.monthlyRent,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      ),
    );
  if (genderFilter.value !== "all")
    list = list.filter((property) => property.gender === genderFilter.value);
  if (statusFilter.value !== "all")
    list = list.filter(
      (property) => property.availability === statusFilter.value,
    );
  return list.sort((a, b) =>
    sortOrder.value === "rent-low"
      ? Number(a.monthlyRent) - Number(b.monthlyRent)
      : sortOrder.value === "rent-high"
        ? Number(b.monthlyRent) - Number(a.monthlyRent)
        : sortOrder.value === "oldest"
          ? new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          : new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  );
});
const stats = computed(() => ({
  total: properties.value.length,
  available: properties.value.filter((p) => p.availability === "available")
    .length,
  occupied: properties.value.filter((p) => p.availability === "occupied")
    .length,
  pending: properties.value.filter((p) => p.availability === "pending").length,
}));
const pageTitle = computed(() =>
  view.value === "dashboard"
    ? "Owner Dashboard"
    : view.value === "add" || view.value === "edit"
      ? editingId.value
        ? "Edit Property"
        : "Add New Property"
      : view.value === "wishlist"
        ? "My Wishlist"
        : "Find Your Perfect PG",
);
watch(
  properties,
  (value) => localStorage.setItem("properties", JSON.stringify(value)),
  { deep: true },
);
watch(
  wishlist,
  (value) => localStorage.setItem("wishlist", JSON.stringify(value)),
  { deep: true },
);
watch(
  recentSearches,
  (value) => localStorage.setItem("recentSearches", JSON.stringify(value)),
  { deep: true },
);
watch(dark, (value) => {
  localStorage.setItem("theme", value ? "dark" : "light");
  document.documentElement.dataset.theme = value ? "dark" : "light";
});

function showNotice(message) {
  notice.value = message;
  window.setTimeout(() => {
    notice.value = "";
  }, 2800);
}
function navigate(destination) {
  view.value = destination;
  selectedProperty.value = null;
  if (destination === "add") {
    editingId.value = null;
    form.value = emptyForm();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function runSearch() {
  view.value = "search";
  const term = query.value.trim();
  if (term)
    recentSearches.value = [
      term,
      ...recentSearches.value.filter(
        (item) => item.toLowerCase() !== term.toLowerCase(),
      ),
    ].slice(0, 8);
}
function toggleFavorite(id) {
  wishlist.value = wishlist.value.includes(id)
    ? wishlist.value.filter((item) => item !== id)
    : [...wishlist.value, id];
  showNotice(
    wishlist.value.includes(id)
      ? "Added to your wishlist"
      : "Removed from your wishlist",
  );
}
function loadDemoData() {
  const ids = new Set(properties.value.map((property) => property.id));
  properties.value = [
    ...properties.value,
    ...sampleProperties.filter((property) => !ids.has(property.id)),
  ];
  showNotice("Sample PGs loaded successfully");
}
function deleteProperty(id) {
  const property = properties.value.find((item) => item.id === id);
  if (property && window.confirm(`Delete ${property.propertyName}?`)) {
    properties.value = properties.value.filter((item) => item.id !== id);
    wishlist.value = wishlist.value.filter((item) => item !== id);
    showNotice("Property deleted successfully");
  }
}
function editProperty(id) {
  const property = properties.value.find((item) => item.id === id);
  if (property) {
    editingId.value = id;
    form.value = {
      ...emptyForm(),
      ...property,
      facilities: [...(property.facilities || [])],
    };
    view.value = "edit";
  }
}
function submitProperty() {
  const required = [
    "propertyName",
    "location",
    "city",
    "monthlyRent",
    "availableRooms",
    "contactNumber",
    "ownerEmail",
  ];
  if (required.some((field) => !String(form.value[field] ?? "").trim()))
    return showNotice("Please fill in all required fields");
  if (!/^\d{10}$/.test(form.value.contactNumber))
    return showNotice("Enter a valid 10-digit contact number");
  if (editingId.value)
    properties.value = properties.value.map((property) =>
      property.id === editingId.value
        ? {
            ...property,
            ...form.value,
            monthlyRent: Number(form.value.monthlyRent),
          }
        : property,
    );
  else
    properties.value.push({
      ...form.value,
      id: `prop-${Date.now()}`,
      monthlyRent: Number(form.value.monthlyRent),
      createdAt: new Date().toISOString(),
    });
  showNotice(
    editingId.value
      ? "Property updated successfully"
      : "Property saved successfully",
  );
  navigate("dashboard");
}
function toggleFacility(id) {
  form.value.facilities = form.value.facilities.includes(id)
    ? form.value.facilities.filter((item) => item !== id)
    : [...form.value.facilities, id];
}
function useLocation() {
  if (!navigator.geolocation)
    return showNotice("Geolocation is not supported by this browser");
  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationInfo.value = {
        lat: position.coords.latitude.toFixed(5),
        lng: position.coords.longitude.toFixed(5),
      };
      locating.value = false;
      showNotice("Location detected");
    },
    () => {
      locating.value = false;
      showNotice("Unable to fetch your location");
    },
  );
}
onMounted(() => {
  document.documentElement.dataset.theme = dark.value ? "dark" : "light";
});
</script>

<template>
  <Navbar
    :view="view"
    :wishlist-count="wishlist.length"
    :dark="dark"
    @navigate="navigate"
    @toggle-theme="dark = !dark"
  />
  <main>
    <section
      v-if="view === 'search' || view === 'wishlist'"
      class="hero-section"
    >
      <div class="hero-copy">
        <p class="eyebrow">STUDENT LIVING, SIMPLIFIED</p>
        <h1>Find a place that feels like <em>home.</em></h1>
        <p>
          Search verified PGs and hostels near your campus, work, and everyday
          life.
        </p>
      </div>
      <SearchBar
        v-if="view === 'search'"
        v-model:query="query"
        :locating="locating"
        @search="runSearch"
        @locate="useLocation"
      />
      <div v-if="locationInfo" class="location-panel">
        <strong>Your location</strong
        ><span>{{ locationInfo.lat }}, {{ locationInfo.lng }}</span>
      </div>
      <div v-if="recentSearches.length && view === 'search'" class="recent-row">
        <span>Recent</span
        ><button
          v-for="term in recentSearches"
          :key="term"
          @click="
            query = term;
            runSearch();
          "
        >
          {{ term }}</button
        ><button class="clear-button" @click="recentSearches = []">
          Clear
        </button>
      </div>
    </section>
    <section
      v-if="view === 'search' || view === 'wishlist'"
      class="content-section"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">
            {{ view === "wishlist" ? "SAVED PLACES" : "EXPLORE LISTINGS" }}
          </p>
          <h2>{{ view === "wishlist" ? "Your wishlist" : "Available PGs" }}</h2>
          <p>
            {{ filteredProperties.length }} place{{
              filteredProperties.length === 1 ? "" : "s"
            }}
            to explore
          </p>
        </div>
        <div class="filter-row">
          <select v-model="genderFilter">
            <option value="all">All residents</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="unisex">Unisex</option></select
          ><select v-model="sortOrder">
            <option value="newest">Newest first</option>
            <option value="rent-low">Rent: low to high</option>
            <option value="rent-high">Rent: high to low</option>
          </select>
        </div>
      </div>
      <div
        v-if="filteredProperties.length"
        v-append-property="filteredProperties"
        class="property-grid"
      >
        <PropertyCard
          v-for="property in filteredProperties"
          :key="property.id"
          :property="property"
          :favorite="wishlist.includes(property.id)"
          @toggle-favorite="toggleFavorite"
          @view="selectedProperty = property"
        />
      </div>
      <div v-else class="empty-state">
        <span class="empty-mark">⌂</span>
        <h3>
          {{ view === "wishlist" ? "Your wishlist is empty" : "No PGs found" }}
        </h3>
        <p>Try a different keyword or load the sample listings.</p>
        <button
          v-if="view === 'search'"
          class="primary-button"
          @click="loadDemoData"
        >
          Load Sample PGs
        </button>
      </div>
    </section>
    <section
      v-if="view === 'dashboard'"
      class="content-section dashboard-section"
    >
      <div class="page-heading">
        <div>
          <p class="eyebrow">OWNER SPACE</p>
          <h1>Manage your properties</h1>
          <p>Keep your listings fresh and ready for their next resident.</p>
        </div>
        <button class="primary-button" @click="navigate('add')">
          ＋ Add property
        </button>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <strong>{{ stats.total }}</strong
          ><span>Total properties</span>
        </div>
        <div class="stat-card green">
          <strong>{{ stats.available }}</strong
          ><span>Available</span>
        </div>
        <div class="stat-card amber">
          <strong>{{ stats.occupied }}</strong
          ><span>Occupied</span>
        </div>
        <div class="stat-card blue">
          <strong>{{ stats.pending }}</strong
          ><span>Pending review</span>
        </div>
      </div>
      <div class="dashboard-toolbar">
        <input v-model="query" placeholder="Search your properties..." /><select
          v-model="statusFilter"
        >
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div
        v-if="filteredProperties.length"
        v-append-property="filteredProperties"
        class="property-grid owner-grid"
      >
        <PropertyCard
          v-for="property in filteredProperties"
          :key="property.id"
          :property="property"
          owner-mode
          @edit="editProperty"
          @delete="deleteProperty"
        />
      </div>
      <div v-else class="empty-state">
        <h3>No properties match</h3>
        <p>Try another filter or add your first listing.</p>
      </div>
    </section>
    <section
      v-if="view === 'add' || view === 'edit'"
      class="content-section form-section"
    >
      <div class="page-heading">
        <div>
          <p class="eyebrow">OWNER SPACE</p>
          <h1>{{ pageTitle }}</h1>
          <p>Share the details students need to choose their next home.</p>
        </div>
      </div>
      <form class="property-form" @submit.prevent="submitProperty">
        <div class="form-grid">
          <label
            >Property name *<input
              v-model="form.propertyName"
              required
              placeholder="e.g. Green Valley PG" /></label
          ><label
            >Property type<select v-model="form.propertyType">
              <option value="pg">PG</option>
              <option value="hostel">Hostel</option>
              <option value="apartment">Apartment</option>
            </select></label
          ><label
            >Room type<select v-model="form.roomType">
              <option value="single">Single Occupancy</option>
              <option value="double">Double Sharing</option>
              <option value="triple">Triple Sharing</option>
              <option value="dormitory">Dormitory</option>
            </select></label
          ><label
            >Gender preference<select v-model="form.gender">
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="unisex">Unisex</option>
            </select></label
          ><label
            >Area / locality *<input v-model="form.location" required /></label
          ><label>City *<input v-model="form.city" required /></label
          ><label>State<input v-model="form.state" /></label
          ><label>Pincode<input v-model="form.pincode" maxlength="6" /></label
          ><label
            >Monthly rent (₹) *<input
              v-model="form.monthlyRent"
              required
              type="number"
              min="0" /></label
          ><label
            >Security deposit (₹)<input
              v-model="form.securityDeposit"
              type="number"
              min="0" /></label
          ><label
            >Available rooms *<input
              v-model="form.availableRooms"
              required
              type="number"
              min="0" /></label
          ><label
            >Availability<select v-model="form.availability">
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="pending">Pending verification</option>
            </select></label
          ><label class="wide"
            >Complete address<textarea
              v-model="form.address"
              rows="2"
            ></textarea></label
          ><label class="wide"
            >Image URL<input
              v-model="form.image"
              type="url"
              placeholder="https://images.unsplash.com/..." /></label
          ><label class="wide"
            >Description<textarea
              v-model="form.description"
              rows="3"
            ></textarea>
          </label>
        </div>
        <div class="form-block">
          <h3>Facilities</h3>
          <div class="facility-list">
            <label
              v-for="[id, name] in facilityOptions"
              :key="id"
              class="facility-option"
              :class="{ selected: form.facilities.includes(id) }"
              ><input
                type="checkbox"
                :checked="form.facilities.includes(id)"
                @change="toggleFacility(id)"
              />{{ name }}</label
            >
          </div>
        </div>
        <div class="form-grid">
          <label
            >Contact number *<input
              v-model="form.contactNumber"
              required
              pattern="[0-9]{10}"
              maxlength="10" /></label
          ><label
            >Owner email *<input
              v-model="form.ownerEmail"
              required
              type="email"
          /></label>
        </div>
        <div class="form-actions">
          <button
            type="button"
            class="outline-button"
            @click="navigate('dashboard')"
          >
            Cancel</button
          ><button type="submit" class="primary-button">
            {{ editingId ? "Update property" : "Save property" }}
          </button>
        </div>
      </form>
    </section>
  </main>
  <div
    v-if="selectedProperty"
    class="modal-backdrop"
    @click.self="selectedProperty = null"
  >
    <article class="detail-modal">
      <button class="close-button" @click="selectedProperty = null">×</button
      ><img
        v-if="selectedProperty.image"
        :src="selectedProperty.image"
        :alt="selectedProperty.propertyName"
      />
      <p class="eyebrow">{{ labels.type[selectedProperty.propertyType] }}</p>
      <h2>{{ selectedProperty.propertyName }}</h2>
      <p class="location">
        ⌖ {{ selectedProperty.location }}, {{ selectedProperty.city }}
      </p>
      <p>{{ selectedProperty.description }}</p>
      <strong
        >₹{{ Number(selectedProperty.monthlyRent).toLocaleString("en-IN") }} /
        month</strong
      ><button class="primary-button" @click="selectedProperty = null">
        Close details
      </button>
    </article>
  </div>
  <div v-if="notice" class="notice" role="status">{{ notice }}</div>
  <footer>PG Finder · FSD Practical 7 · Built with Vue 3</footer>
</template>

/* ============================================================
   Owner Dashboard Script
   - Stores properties in LocalStorage under key "properties"
   - Search, filter, sort, pagination, delete & edit via delegation
   - No inline JS / inline handlers — event listeners only
   ============================================================ */

const STORAGE_KEY = "properties";
const PAGE_SIZE = 6;

/* ---------- App state ---------- */
let properties = []; // full list from LocalStorage
let currentFilter = "all"; // all | available | occupied | pending
let currentSort = "newest"; // newest | oldest | rent-low | rent-high
let currentSearch = ""; // search term
let currentPage = 1; // active page number
let deleteTargetId = null; // property id awaiting delete confirmation
const availabilityUpdatesInFlight = new Set();

/* ---------- Cached DOM references ---------- */
const dom = {
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  sidebarToggle: document.getElementById("sidebarToggle"),
  searchInput: document.getElementById("searchInput"),
  notificationBtn: document.getElementById("notificationBtn"),
  totalProperties: document.getElementById("totalProperties"),
  availableProperties: document.getElementById("availableProperties"),
  occupiedProperties: document.getElementById("occupiedProperties"),
  pendingProperties: document.getElementById("pendingProperties"),
  propertiesGrid: document.getElementById("propertiesGrid"),
  propertiesGridAlt: document.getElementById("propertiesGridAlt"),
  pagination: document.getElementById("pagination"),
  emptyState: document.getElementById("emptyState"),
  currentFilterLabel: document.getElementById("currentFilter"),
  currentSortLabel: document.getElementById("currentSort"),
  deleteModal: document.getElementById("deleteModal"),
  deletePropertyName: document.getElementById("deletePropertyName"),
  confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
  toastContainer: document.getElementById("toastContainer"),
};

/* ============================================================
   Storage helpers
   ============================================================ */

/** Load properties array from LocalStorage. */
function loadProperties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    properties = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(properties)) properties = [];
  } catch (err) {
    properties = [];
  }
  return properties;
}

/** Persist the properties array to LocalStorage. */
function saveProperties(list = properties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ============================================================
   Statistics
   ============================================================ */

/** Update the four stat cards on the dashboard. */
function renderStatistics() {
  const total = properties.length;
  const available = properties.filter(
    (p) => p.availability === "available",
  ).length;
  const occupied = properties.filter(
    (p) => p.availability === "occupied",
  ).length;
  const pending = properties.filter((p) => p.availability === "pending").length;

  dom.totalProperties.textContent = total;
  dom.availableProperties.textContent = available;
  dom.occupiedProperties.textContent = occupied;
  dom.pendingProperties.textContent = pending;
}

/* ============================================================
   Search / Filter / Sort / Paginate
   ============================================================ */

/** Read the search box and re-render the grid. */
function searchProperties() {
  currentSearch = dom.searchInput.value;
  currentPage = 1;
  renderProperties();
}

/** Apply an availability filter (all | available | occupied | pending). */
function filterProperties(filter) {
  currentFilter = filter;
  currentPage = 1;

  dom.currentFilterLabel.textContent = filterLabel(filter);
  document.querySelectorAll(".filter-option").forEach((el) => {
    el.classList.toggle("active", el.dataset.filter === filter);
  });
  renderProperties();
}

/** Apply a sort order (newest | oldest | rent-low | rent-high). */
function sortProperties(sort) {
  currentSort = sort;
  currentPage = 1;

  dom.currentSortLabel.textContent = sortLabel(sort);
  document.querySelectorAll(".sort-option").forEach((el) => {
    el.classList.toggle("active", el.dataset.sort === sort);
  });
  renderProperties();
}

/** Jump to a specific page and re-render. */
function paginateProperties(page) {
  currentPage = page;
  renderProperties();
}

/** Combine search + filter + sort into a final ordered list. */
function getFilteredSorted() {
  let list = [...properties];

  // Search by property name
  if (currentSearch.trim()) {
    const q = currentSearch.trim().toLowerCase();
    list = list.filter((p) => (p.propertyName || "").toLowerCase().includes(q));
  }

  // Filter by availability status
  if (currentFilter !== "all") {
    list = list.filter((p) => p.availability === currentFilter);
  }

  // Sort
  switch (currentSort) {
    case "oldest":
      list.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
      break;
    case "rent-low":
      list.sort(
        (a, b) => (Number(a.monthlyRent) || 0) - (Number(b.monthlyRent) || 0),
      );
      break;
    case "rent-high":
      list.sort(
        (a, b) => (Number(b.monthlyRent) || 0) - (Number(a.monthlyRent) || 0),
      );
      break;
    default: // newest
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
  }

  return list;
}

/* ============================================================
   Rendering
   ============================================================ */

/** Main render pipeline: stats, grid, empty state & pagination. */
function renderProperties() {
  const filtered = getFilteredSorted();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  renderStatistics();

  // Empty state (no results at all)
  if (filtered.length === 0) {
    renderAvailabilityBoard(dom.propertiesGrid, []);
    dom.emptyState.classList.remove("d-none");
    dom.pagination.innerHTML = "";
    renderAltGrid([]);
    return;
  }

  dom.emptyState.classList.add("d-none");

  // Slice current page
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  renderAvailabilityBoard(dom.propertiesGrid, pageItems);
  renderAltGrid(filtered);
  renderPagination(totalPages);
}

/** Render the alternative "All Properties" grid. */
function renderAltGrid(items) {
  if (!dom.propertiesGridAlt) return;
  renderAvailabilityBoard(dom.propertiesGridAlt, items);
}

/** Render cards into the two availability drop zones. */
function renderAvailabilityBoard(board, items) {
  if (!board) return;

  board.querySelectorAll("[data-zone-grid]").forEach((grid) => {
    const targetAvailability = grid.dataset.zoneGrid;
    const zoneItems = items.filter((property) =>
      targetAvailability === "available"
        ? property.availability === "available"
        : property.availability !== "available",
    );
    grid.innerHTML = zoneItems.length
      ? zoneItems.map(propertyCardHTML).join("")
      : `<div class="col-12 zone-empty">Drop properties here</div>`;

    const zone = grid.closest("[data-availability]");
    const count = zone && zone.querySelector(".availability-zone-count");
    if (count) count.textContent = zoneItems.length;
  });
}

/** Build pagination controls. */
function renderPagination(totalPages) {
  if (totalPages <= 1) {
    dom.pagination.innerHTML = "";
    return;
  }

  let html = "";

  // Previous button
  html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
            <i class="bi bi-chevron-left"></i>
        </a></li>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? "active" : ""}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
  }

  // Next button
  html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
            <i class="bi bi-chevron-right"></i>
        </a></li>`;

  dom.pagination.innerHTML = html;
}

/** HTML template for a single property card. */
function propertyCardHTML(p) {
  const hasImage = Boolean(p.image);
  const imageBlock = hasImage
    ? `<img src="${p.image}" alt="${escapeHTML(p.propertyName)}">`
    : `<div class="property-image no-image"><i class="bi bi-house-door"></i></div>`;

  return `
    <div class="col-md-6 col-lg-4">
        <div class="property-card" draggable="true" data-property-id="${escapeHTML(p.id)}" tabindex="0">
            <div class="property-image">
                ${imageBlock}
                <span class="status-badge status-${escapeHTML(p.availability)}">${statusLabel(p.availability)}</span>
                <span class="property-type-badge">${escapeHTML(propertyTypeLabel(p.propertyType))}</span>
            </div>
            <div class="property-body">
                <h5 class="property-name" title="${escapeHTML(p.propertyName)}">${escapeHTML(p.propertyName)}</h5>
                <p class="property-location">
                    <i class="bi bi-geo-alt"></i>${escapeHTML(p.location || "")}, ${escapeHTML(p.city || "")}
                </p>
                <div class="property-meta">
                    <span><i class="bi bi-people"></i>${escapeHTML(p.gender || "")}</span>
                    <span><i class="bi bi-door-open"></i>${escapeHTML(roomTypeLabel(p.roomType))}</span>
                    <span><i class="bi bi-boxes"></i>${Number(p.availableRooms) || 0} rooms</span>
                </div>
                <div class="property-footer">
                    <div class="property-rent">₹${formatRent(p.monthlyRent)} <small>/month</small></div>
                    <div class="property-actions">
                        <button type="button" class="btn-action btn-edit" data-id="${p.id}" title="Edit Property">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn-action btn-delete" data-id="${p.id}" title="Delete Property">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

/** Return the stored status represented by an availability drop zone. */
function availabilityForZone(zone) {
  return zone.dataset.availability === "available" ? "available" : "occupied";
}

/** Persist a property availability change and refresh both dashboard views. */
function updatePropertyAvailability(id, targetAvailability) {
  if (!id) {
    console.error(
      "Cannot update availability: the dragged property has no id.",
    );
    showToast("This property could not be identified", "error");
    return;
  }

  const property = properties.find((item) => String(item.id) === String(id));
  if (!property) {
    console.error("Cannot update availability: property not found", id);
    showToast("Property not found", "error");
    return;
  }

  const nextAvailability =
    targetAvailability === "available" ? "available" : "occupied";
  const alreadyInTargetZone =
    targetAvailability === "available"
      ? property.availability === "available"
      : property.availability !== "available";
  if (alreadyInTargetZone || availabilityUpdatesInFlight.has(id)) return;

  availabilityUpdatesInFlight.add(id);
  const previousProperties = properties;
  const nextProperties = properties.map((item) =>
    String(item.id) === String(id)
      ? { ...item, availability: nextAvailability }
      : item,
  );

  try {
    saveProperties(nextProperties);
    properties = nextProperties;
    renderProperties();
    showToast(
      `${property.propertyName} is now ${nextAvailability === "available" ? "available" : "not available"}`,
      "success",
    );
  } catch (err) {
    properties = previousProperties;
    console.error("Availability update failed", err);
    showToast("Could not update property availability", "error");
  } finally {
    availabilityUpdatesInFlight.delete(id);
  }
}

/* ============================================================
   Delete / Edit
   ============================================================ */

/** Show the delete confirmation modal for a property. */
function showConfirmation(id, name) {
  deleteTargetId = id;
  dom.deletePropertyName.textContent = name;
  const modal = bootstrap.Modal.getOrCreateInstance(dom.deleteModal);
  modal.show();
}

/** Remove a property, persist and re-render. */
function deleteProperty(id) {
  properties = properties.filter((p) => p.id !== id);
  saveProperties();
  renderProperties();

  const modal = bootstrap.Modal.getInstance(dom.deleteModal);
  if (modal) modal.hide();

  showToast("Property deleted successfully", "info");
  deleteTargetId = null;
}

/** Navigate to the edit page for a property. */
function editProperty(id) {
  window.location.href = `add-property.html?id=${encodeURIComponent(id)}`;
}

/* ============================================================
   Sidebar / Navigation
   ============================================================ */

/** Open / close the sidebar (mobile). */
function toggleSidebar() {
  dom.sidebar.classList.toggle("open");
  dom.sidebarOverlay.classList.toggle("show");
}

/** Close the sidebar (mobile). */
function closeSidebar() {
  dom.sidebar.classList.remove("open");
  dom.sidebarOverlay.classList.remove("show");
}

/** Switch between the dashboard and properties pages. */
function switchPage(pageName) {
  const dashboard = document.getElementById("dashboardPage");
  const propertiesPage = document.getElementById("propertiesPage");

  if (dashboard) dashboard.classList.toggle("active", pageName === "dashboard");
  if (propertiesPage)
    propertiesPage.classList.toggle("active", pageName === "properties");

  document
    .querySelectorAll(".sidebar-nav .nav-link[data-page]")
    .forEach((link) => {
      link.classList.toggle("active", link.dataset.page === pageName);
    });

  closeSidebar();
}

/* ============================================================
   Toast messages
   ============================================================ */

/** Show a small toast notification. type: success | error | info. */
function showToast(message, type = "success") {
  const iconMap = {
    success: "check-circle-fill",
    error: "x-circle-fill",
    info: "info-circle-fill",
  };
  const toastClass =
    type === "error"
      ? "toast-error"
      : type === "info"
        ? "toast-info"
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

function statusLabel(status) {
  return (
    { available: "Available", occupied: "Occupied", pending: "Pending" }[
      status
    ] || "Unknown"
  );
}

function propertyTypeLabel(type) {
  return (
    { pg: "PG", hostel: "Hostel", apartment: "Apartment" }[type] ||
    type ||
    "Property"
  );
}

function roomTypeLabel(type) {
  return (
    {
      single: "Single",
      double: "Double",
      triple: "Triple",
      dormitory: "Dormitory",
    }[type] ||
    type ||
    "Any"
  );
}

function filterLabel(filter) {
  return (
    {
      all: "All",
      available: "Available",
      occupied: "Occupied",
      pending: "Pending",
    }[filter] || "All"
  );
}

function sortLabel(sort) {
  return (
    {
      newest: "Newest",
      oldest: "Oldest",
      "rent-low": "Rent: Low to High",
      "rent-high": "Rent: High to Low",
    }[sort] || "Newest"
  );
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

// Search box
dom.searchInput.addEventListener("input", searchProperties);

// Filter / sort dropdowns (event delegation)
dom.currentFilterLabel
  .closest(".dropdown")
  .parentElement.addEventListener("click", (e) => {
    const filterOpt = e.target.closest(".filter-option");
    if (filterOpt) {
      e.preventDefault();
      filterProperties(filterOpt.dataset.filter);
      return;
    }
    const sortOpt = e.target.closest(".sort-option");
    if (sortOpt) {
      e.preventDefault();
      sortProperties(sortOpt.dataset.sort);
    }
  });

// Pagination (event delegation)
dom.pagination.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-page]");
  if (!link) return;
  e.preventDefault();
  if (link.parentElement.classList.contains("disabled")) return;
  paginateProperties(parseInt(link.dataset.page, 10));
});

// Edit / delete buttons on the properties grid (event delegation)
dom.propertiesGrid.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  if (editBtn) {
    e.preventDefault();
    editProperty(editBtn.dataset.id);
    return;
  }
  const deleteBtn = e.target.closest(".btn-delete");
  if (deleteBtn) {
    e.preventDefault();
    const property = properties.find((p) => p.id === deleteBtn.dataset.id);
    showConfirmation(
      deleteBtn.dataset.id,
      property ? property.propertyName : "this property",
    );
  }
});

// Availability drag and drop (event delegation keeps handlers attached after re-rendering)
function handleDragStart(e) {
  const card = e.target.closest(".property-card[data-property-id]");
  if (!card) return;

  const id = card.dataset.propertyId;
  if (!id) {
    console.error("Cannot start property drag: the card has no property id.");
    return;
  }

  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  card.classList.add("is-dragging");
}

function handleDragEnd(e) {
  const card = e.target.closest(".property-card[data-property-id]");
  if (card) card.classList.remove("is-dragging");
  document
    .querySelectorAll(".availability-zone.drag-over")
    .forEach((zone) => zone.classList.remove("drag-over"));
}

function handleZoneDragOver(e) {
  const zone = e.target.closest(".availability-zone[data-availability]");
  if (!zone) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  zone.classList.add("drag-over");
}

function handleZoneDragLeave(e) {
  const zone = e.target.closest(".availability-zone[data-availability]");
  if (!zone || (e.relatedTarget && zone.contains(e.relatedTarget))) return;
  zone.classList.remove("drag-over");
}

function handleZoneDrop(e) {
  const zone = e.target.closest(".availability-zone[data-availability]");
  if (!zone) return;
  e.preventDefault();
  zone.classList.remove("drag-over");
  const id = e.dataTransfer.getData("text/plain");
  updatePropertyAvailability(id, availabilityForZone(zone));
}

document.addEventListener("dragstart", handleDragStart);
document.addEventListener("dragend", handleDragEnd);
document.addEventListener("dragover", handleZoneDragOver);
document.addEventListener("dragleave", handleZoneDragLeave);
document.addEventListener("drop", handleZoneDrop);

// Delete confirmation button
dom.confirmDeleteBtn.addEventListener("click", () => {
  if (deleteTargetId) deleteProperty(deleteTargetId);
});

// Sidebar toggle + overlay
dom.sidebarToggle.addEventListener("click", toggleSidebar);
dom.sidebarOverlay.addEventListener("click", closeSidebar);

// Sidebar page navigation
document
  .querySelectorAll(".sidebar-nav .nav-link[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchPage(link.dataset.page);
    });
  });

// Notification bell
dom.notificationBtn.addEventListener("click", () => {
  showToast("You have 3 new notifications", "info");
});

/* ============================================================
   Init
   ============================================================ */
loadProperties();

if (window.location.hash === "#properties") {
  switchPage("properties");
}

renderProperties();

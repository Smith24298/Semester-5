/* ============================================================
   Manage Availability Page Script
   - Uses HTML5 Drag and Drop API
   - Stores properties in LocalStorage (key "properties")
   - Updates availability field on drop
   ============================================================ */

const STORAGE_KEY = "properties";

let properties = [];

/* DOM references */
const lists = {
    available: document.getElementById("listAvailable"),
    notAvailable: document.getElementById("listNotAvailable")
};
const countEls = {
    available: document.getElementById("countAvailable"),
    notAvailable: document.getElementById("countNotAvailable")
};
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const toastContainer = document.getElementById("toastContainer");

/* ---- Storage helpers ---- */
function loadProperties() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        properties = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(properties)) properties = [];
    } catch (e) { properties = []; }
    return properties;
}
function saveProperties() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

/* ---- Rendering ---- */
function renderAll() {
    loadProperties();
    // clear lists
    lists.available.innerHTML = "";
    lists.notAvailable.innerHTML = "";

    if (properties.length === 0) {
        emptyState.classList.remove("d-none");
        updateCounts();
        return;
    }
    emptyState.classList.add("d-none");

    properties.forEach(p => {
        const status = p.availability === "available" ? "available" : "not-available";
        lists[status].appendChild(createCard(p));
    });
    updateCounts();
}

function updateCounts() {
    const avail = properties.filter(p => p.availability === "available").length;
    const notAvail = properties.filter(p => p.availability !== "available").length;
    countEls.available.textContent = avail;
    countEls.notAvailable.textContent = notAvail;
}

/* Create a small property card element */
function createCard(p) {
    const div = document.createElement("div");
    div.className = "property-card-sm";
    div.draggable = true;
    div.dataset.id = p.id;

    // drag events
    div.addEventListener("dragstart", onDragStart);
    div.addEventListener("dragend", onDragEnd);

    const hasImg = Boolean(p.image);
    const imgHtml = hasImg
        ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.propertyName)}">`
        : `<div class="no-image"><i class="bi bi-house-door"></i></div>`;

    const statusLabel = p.availability === "available" ? "Available" : "Not Available";
    const statusClass = p.availability === "available" ? "status-available" : "status-not-available";

    div.innerHTML = `
        ${imgHtml}
        <div class="property-info">
            <div class="property-name">${escapeHTML(p.propertyName)}</div>
            <p class="property-location"><i class="bi bi-geo-alt"></i>${escapeHTML(p.location || "")}, ${escapeHTML(p.city || "")}</p>
            <div class="property-meta-sm">
                <span><i class="bi bi-people"></i>${escapeHTML(p.gender || "")}</span>
                <span><i class="bi bi-door-open"></i>${escapeHTML(roomLabel(p.roomType))}</span>
                <span><i class="bi bi-boxes"></i>${Number(p.availableRooms) || 0} rooms</span>
            </div>
        </div>
        <span class="status-badge-sm ${statusClass}">${statusLabel}</span>
    `;
    return div;
}

/* ---- Drag & Drop handlers ---- */

function onDragStart(e) {
    const card = e.target.closest(".property-card-sm");
    if (!card) return;
    const id = card.dataset.id;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    card.classList.add("dragging");
}
function onDragEnd(e) {
    const card = e.target.closest(".property-card-sm");
    if (card) card.classList.remove("dragging");
    // remove drag-over highlight from both zones
    document.querySelectorAll(".kanban-body").forEach(el => el.classList.remove("drag-over"));
}

/* Allow drop */
function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const body = e.currentTarget;
    body.classList.add("drag-over");
}
function dragLeave(e) {
    const body = e.currentTarget;
    // only remove when leaving the element entirely
    if (!body.contains(e.relatedTarget)) body.classList.remove("drag-over");
}

/* Handle drop */
function drop(e) {
    e.preventDefault();
    const body = e.currentTarget;
    body.classList.remove("drag-over");

    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    const prop = properties.find(p => p.id === id);
    if (!prop) return;

    const targetStatus = body.id === "listAvailable" ? "available" : "not-available";
    const newAvail = targetStatus === "available" ? "available" : "occupied"; // treat not-available as occupied
    if (prop.availability === newAvail) return; // dropped in same column – no change

    prop.availability = newAvail;
    saveProperties();
    renderAll();
    showToast(`Updated ${prop.propertyName} → ${newAvail === "available" ? "Available" : "Not Available"}`, "success");
}

/* Attach dragleave to each kanban body */
document.getElementById("listAvailable").addEventListener("dragleave", dragLeave);
document.getElementById("listNotAvailable").addEventListener("dragleave", dragLeave);

/* ---- UI helpers ---- */
function escapeHTML(str) {
    return String(str ?? "")
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, """)
        .replace(/'/g, "'");
}
function roomLabel(type) {
    return { single: "Single", double: "Double", triple: "Triple", dormitory: "Dormitory" }[type] || type || "Any";
}

/* Toast */
function showToast(message, type = "success") {
    const icons = { success: "check-circle-fill", error: "x-circle-fill", info: "info-circle-fill" };
    const cls = type === "error" ? "toast-error" : type === "info" ? "toast-info" : "toast-success";
    const toast = document.createElement("div");
    toast.className = `toast show ${cls}`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `<div class="toast-body"><i class="bi bi-${icons[type] || icons.info}"></i><span>${escapeHTML(message)}</span></div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ---- Event listeners ---- */
refreshBtn.addEventListener("click", () => {
    renderAll();
    showToast("Refreshed from storage", "info");
});

/* Initial render */
renderAll();
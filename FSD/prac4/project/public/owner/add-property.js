const STORAGE_KEY = "properties";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/* ---------- App state ---------- */
let editingId = null;      // property id when editing, null when adding
let editingProperty = null; // the loaded property being edited
let images = [];           // array of base64 strings of uploaded images
let dragDepth = 0;         // counter to handle nested dragenter/dragleave

/* ---------- Available facilities ---------- */
const FACILITIES = [
    { id: "wifi", label: "Wi-Fi", icon: "bi-wifi" },
    { id: "meals", label: "Meals", icon: "bi-cup-hot" },
    { id: "parking", label: "Parking", icon: "bi-car-front" },
    { id: "laundry", label: "Laundry", icon: "bi-droplet" },
    { id: "housekeeping", label: "Housekeeping", icon: "bi-brush" },
    { id: "powerBackup", label: "Power Backup", icon: "bi-lightning-charge" },
    { id: "ac", label: "AC", icon: "bi-snow" },
    { id: "water", label: "Water Supply", icon: "bi-droplet-fill" },
    { id: "security", label: "Security", icon: "bi-shield-check" },
    { id: "cctv", label: "CCTV", icon: "bi-cctv" },
    { id: "gym", label: "Gym", icon: "bi-dumbbell" },
    { id: "studyArea", label: "Study Area", icon: "bi-book" }
];

/* ---------- Cached DOM references ---------- */
const dom = {
    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebarOverlay"),
    sidebarToggle: document.getElementById("sidebarToggle"),

    form: document.getElementById("propertyForm"),
    formTitle: document.getElementById("formTitle"),
    formSubtitle: document.getElementById("formSubtitle"),
    pageTitle: document.getElementById("pageTitle"),
    pageSubtitle: document.getElementById("pageSubtitle"),
    submitBtnText: document.getElementById("submitBtnText"),

    propertyName: document.getElementById("propertyName"),
    propertyType: document.getElementById("propertyType"),
    roomType: document.getElementById("roomType"),
    gender: document.getElementById("gender"),
    location: document.getElementById("location"),
    city: document.getElementById("city"),
    state: document.getElementById("state"),
    pincode: document.getElementById("pincode"),
    address: document.getElementById("address"),
    mapLink: document.getElementById("mapLink"),
    lat: document.getElementById("lat"),
    lng: document.getElementById("lng"),
    setLocationBtn: document.getElementById("setLocationBtn"),
    monthlyRent: document.getElementById("monthlyRent"),
    securityDeposit: document.getElementById("securityDeposit"),
    availableRooms: document.getElementById("availableRooms"),
    availability: document.getElementById("availability"),
    description: document.getElementById("description"),
    contactNumber: document.getElementById("contactNumber"),
    ownerEmail: document.getElementById("ownerEmail"),

    facilitiesGrid: document.getElementById("facilitiesGrid"),

    imageUploadArea: document.getElementById("imageUploadArea"),
    propertyImages: document.getElementById("propertyImages"),
    uploadPlaceholder: document.getElementById("uploadPlaceholder"),
    galleryPreview: document.getElementById("galleryPreview"),
    browseBtn: document.getElementById("browseBtn"),
    imageError: document.getElementById("imageError"),

    toastContainer: document.getElementById("toastContainer")
};

/* ============================================================
   Storage helpers
   ============================================================ */

/** Load the properties array from LocalStorage. */
function loadProperties() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
    } catch (err) {
        return [];
    }
}

/** Persist the properties array to LocalStorage. */
function saveProperties(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ============================================================
   ID + property lookup
   ============================================================ */

/** Generate a unique id for a new property. */
function generateUniqueId() {
    return "prop-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

/** Find a property by id in LocalStorage. */
function getPropertyById(id) {
    return loadProperties().find(p => p.id === id) || null;
}

/* ============================================================
   Image upload / preview (Drag & Drop)
   ============================================================ */

/** Convert a File to a Base64 data URL via FileReader. */
function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

/** Validate a single image file. Returns a message or null. */
function validateImageFile(file) {
    if (!file.type.startsWith("image/")) {
        return "Only image files are allowed (JPG, PNG, etc.)";
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return "Each image must be 5MB or smaller";
    }
    return null;
}

/** Read the dropped / selected files into Base64 and add them to the list. */
async function addImageFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const accepted = [];
    for (const file of files) {
        const error = validateImageFile(file);
        if (error) {
            showToast(`"${file.name}": ${error}`, "error");
            continue;
        }
        try {
            const dataUrl = await readAsDataURL(file);
            accepted.push(dataUrl);
        } catch (err) {
            showToast(`Could not read "${file.name}"`, "error");
        }
    }

    if (accepted.length) {
        images = images.concat(accepted);
        renderGallery();
        clearImageError();
        showToast(`${accepted.length} image${accepted.length > 1 ? "s" : ""} added`, "success");
    }

    dom.propertyImages.value = "";
}

/** Render the gallery of uploaded images with instant previews. */
function renderGallery() {
    const hasImages = images.length > 0;
    dom.uploadPlaceholder.classList.toggle("d-none", hasImages);
    dom.galleryPreview.classList.toggle("d-none", !hasImages);
    dom.imageUploadArea.classList.toggle("has-image", hasImages);

    if (!hasImages) {
        dom.galleryPreview.innerHTML = "";
        return;
    }

    dom.galleryPreview.innerHTML = images.map((src, index) => `
        <div class="gallery-thumb ${index === 0 ? "is-cover" : ""}">
            <img src="${src}" alt="Uploaded property image ${index + 1}">
            ${index === 0 ? '<span class="cover-badge">Cover</span>' : ""}
            <button type="button" class="remove-image" data-index="${index}" aria-label="Remove image">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `).join("");
}

/** Remove the image at the given index. */
function removeImageAt(index) {
    images.splice(index, 1);
    renderGallery();
    clearImageError();
}

/** Remove all uploaded images. */
function clearImages() {
    images = [];
    dom.propertyImages.value = "";
    renderGallery();
    clearImageError();
}

/** Hide the image validation error. */
function clearImageError() {
    dom.imageError.style.display = "none";
    dom.imageUploadArea.classList.remove("is-invalid");
}

/** Show the image validation error. */
function showImageError() {
    dom.imageError.style.display = "block";
    dom.imageUploadArea.classList.add("is-invalid");
}

/* ============================================================
   Geolocation (fill property coordinates)
   ============================================================ */

/** Fetch the user's position and fill the latitude/longitude fields. */
function setPropertyLocation() {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by this browser", "error");
        return;
    }

    dom.setLocationBtn.disabled = true;
    dom.setLocationBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Locating...';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            dom.lat.value = lat.toFixed(6);
            dom.lng.value = lng.toFixed(6);
            showToast(`Coordinates set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, "success");
        },
        (err) => {
            const message = err && err.code === err.PERMISSION_DENIED
                ? "Location permission was denied. Please allow access and try again."
                : "Unable to fetch your location. Enter the coordinates manually.";
            showToast(message, "error");
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );

    setTimeout(() => {
        dom.setLocationBtn.disabled = false;
        dom.setLocationBtn.innerHTML = '<i class="bi bi-geo-alt-fill me-1"></i>Use My Location';
    }, 2000);
}

/* ============================================================
   Facilities rendering
   ============================================================ */

/** Render the facility checkboxes into the grid. */
function renderFacilities(selected = []) {
    const checked = new Set(selected);
    dom.facilitiesGrid.innerHTML = FACILITIES.map(f => `
        <label class="facility-item">
            <input type="checkbox" class="form-check-input facility-checkbox"
                   value="${f.id}" ${checked.has(f.id) ? "checked" : ""}>
            <span class="facility-icon"><i class="bi ${f.icon}"></i></span>
            <span class="facility-label">${f.label}</span>
        </label>
    `).join("");
}

/** Collect the ids of all checked facilities. */
function getSelectedFacilities() {
    return Array.from(dom.facilitiesGrid.querySelectorAll(".facility-checkbox:checked"))
        .map(cb => cb.value);
}

/* ============================================================
   Form population (edit mode)
   ============================================================ */

/** Fill the form fields with an existing property's data. */
function populateForm(property) {
    dom.propertyName.value = property.propertyName || "";
    dom.propertyType.value = property.propertyType || "";
    dom.roomType.value = property.roomType || "";
    dom.gender.value = property.gender || "";
    dom.location.value = property.location || "";
    dom.city.value = property.city || "";
    dom.state.value = property.state || "";
    dom.pincode.value = property.pincode || "";
    dom.address.value = property.address || "";
    dom.mapLink.value = property.mapLink || "";
    dom.lat.value = property.lat != null ? property.lat : "";
    dom.lng.value = property.lng != null ? property.lng : "";
    dom.monthlyRent.value = property.monthlyRent || "";
    dom.securityDeposit.value = property.securityDeposit || "";
    dom.availableRooms.value = property.availableRooms || "";
    dom.availability.value = property.availability || "available";
    dom.description.value = property.description || "";
    dom.contactNumber.value = property.contactNumber || "";
    dom.ownerEmail.value = property.ownerEmail || "";

    renderFacilities(property.facilities || []);

    // Restore the stored Base64 images
    images = Array.isArray(property.images) && property.images.length
        ? property.images.slice()
        : (property.image ? [property.image] : []);
    renderGallery();
    if (images.length) clearImageError();
}

/* ============================================================
   Validation
   ============================================================ */

/** Validate required fields and the image. Returns true when valid. */
function validateForm() {
    dom.form.classList.add("was-validated");

    // Check HTML5 constraints on all required fields
    const fieldsValid = dom.form.checkValidity();

    // Check image is present (hidden input is not user-visible)
    const imageValid = images.length > 0;
    if (imageValid) {
        clearImageError();
    } else {
        showImageError();
    }

    return fieldsValid && imageValid;
}

/* ============================================================
   Save / Update
   ============================================================ */

/** Read all form values into a plain object. */
function getFormData() {
    return {
        propertyName: dom.propertyName.value.trim(),
        propertyType: dom.propertyType.value,
        roomType: dom.roomType.value,
        gender: dom.gender.value,
        location: dom.location.value.trim(),
        city: dom.city.value.trim(),
        state: dom.state.value.trim(),
        pincode: dom.pincode.value.trim(),
        address: dom.address.value.trim(),
        mapLink: dom.mapLink.value.trim(),
        lat: dom.lat.value ? Number(dom.lat.value) : null,
        lng: dom.lng.value ? Number(dom.lng.value) : null,
        monthlyRent: Number(dom.monthlyRent.value) || 0,
        securityDeposit: Number(dom.securityDeposit.value) || 0,
        availableRooms: Number(dom.availableRooms.value) || 0,
        availability: dom.availability.value,
        description: dom.description.value.trim(),
        contactNumber: dom.contactNumber.value.trim(),
        ownerEmail: dom.ownerEmail.value.trim(),
        facilities: getSelectedFacilities(),
        images: images.slice(),
        image: images.length ? images[0] : null
    };
}

/** Save a brand-new property and redirect to the dashboard. */
function saveProperty() {
    const property = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        ...getFormData()
    };

    const list = loadProperties();
    list.push(property);
    saveProperties(list);

    showToast("Property saved successfully", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
}

/** Update the property being edited and redirect to the dashboard. */
function updateProperty() {
    const list = loadProperties();
    const index = list.findIndex(p => p.id === editingId);
    if (index === -1) {
        showToast("Property not found", "error");
        return;
    }

    list[index] = {
        ...list[index],
        ...getFormData()
    };
    saveProperties(list);

    showToast("Property updated successfully", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
}

/* ============================================================
   Progress indicator
   ============================================================ */

/** Highlight the current form section in the progress steps. */
function updateProgress() {
    const sections = document.querySelectorAll(".form-section");
    let activeStep = 1;

    sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) activeStep = i + 1;
    });

    document.querySelectorAll(".progress-step").forEach(step => {
        step.classList.toggle("active", Number(step.dataset.step) <= activeStep);
    });
}

/* ============================================================
   Toast messages
   ============================================================ */

/** Show a small toast notification. type: success | error | info. */
function showToast(message, type = "success") {
    const iconMap = {
        success: "check-circle-fill",
        error: "x-circle-fill",
        info: "info-circle-fill"
    };
    const toastClass = type === "error" ? "toast-error"
        : type === "info" ? "toast-info"
        : "toast-success";

    const toast = document.createElement("div");
    toast.className = `toast show ${toastClass}`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="toast-body">
            <i class="bi bi-${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
        </div>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => toast.remove(), 350);
    }, 3000);
}

/* ============================================================
   Sidebar
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

/* ============================================================
   Event listeners
   ============================================================ */

// Image upload: click the hidden file input when the dropzone is clicked
dom.imageUploadArea.addEventListener("click", (e) => {
    if (e.target.closest(".remove-image")) return;
    dom.propertyImages.click();
});

// Browse button inside the dropzone
dom.browseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dom.propertyImages.click();
});

// File input change -> add + preview
dom.propertyImages.addEventListener("change", (e) => {
    addImageFiles(e.target.files);
});

// Drag & drop support
dom.imageUploadArea.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragDepth += 1;
    dom.imageUploadArea.classList.add("dragover");
});
dom.imageUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    dom.imageUploadArea.classList.add("dragover");
});
dom.imageUploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dom.imageUploadArea.classList.remove("dragover");
});
dom.imageUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDepth = 0;
    dom.imageUploadArea.classList.remove("dragover");
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) addImageFiles(files);
});

// Remove image (event delegation on the gallery)
dom.galleryPreview.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-image");
    if (btn) {
        e.stopPropagation();
        removeImageAt(parseInt(btn.dataset.index, 10));
    }
});

// Geolocation: fill coordinates for the property
dom.setLocationBtn.addEventListener("click", setPropertyLocation);

// Form submit
dom.form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) {
        showToast("Please fill in all required fields", "error");
        return;
    }

    if (editingId) {
        updateProperty();
    } else {
        saveProperty();
    }
});

// Progress indicator while scrolling
window.addEventListener("scroll", updateProgress);

// Sidebar toggle + overlay
dom.sidebarToggle.addEventListener("click", toggleSidebar);
dom.sidebarOverlay.addEventListener("click", closeSidebar);

/* ============================================================
   Init
   ============================================================ */

renderFacilities();

// Detect edit mode from the URL (?id=<propertyId>)
const urlParams = new URLSearchParams(window.location.search);
editingId = urlParams.get("id");

if (editingId) {
    editingProperty = getPropertyById(editingId);
    if (editingProperty) {
        populateForm(editingProperty);

        dom.formTitle.textContent = "Edit Property";
        dom.formSubtitle.textContent = "Update the details of your property";
        dom.pageTitle.textContent = "Edit Property";
        dom.pageSubtitle.textContent = "Update your property listing";
        dom.submitBtnText.textContent = "Update Property";
    } else {
        // Property id not found -> fall back to add mode
        editingId = null;
        showToast("Property not found. Please try again.", "error");
    }
}

// Start with the first progress step active
updateProgress();

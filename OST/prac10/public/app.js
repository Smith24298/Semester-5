const grid = document.querySelector("#pgGrid");
const emptyState = document.querySelector("#emptyState");
const toast = document.querySelector("#toast");
let homes = [];
let ownerProperties = [];
let editingPropertyId = null;
const ownerIdKey = "nestly-owner-id";

function getOwnerId() {
  let ownerId = localStorage.getItem(ownerIdKey);
  if (!ownerId) {
    ownerId = crypto.randomUUID();
    localStorage.setItem(ownerIdKey, ownerId);
  }
  return ownerId;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Something went wrong.");
  return body;
}

async function fetchOwnerProperties() {
  ownerProperties = await apiRequest(`/api/owners/${getOwnerId()}/pgs`);
  return ownerProperties;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function cardTemplate(pg) {
  const propertyId = pg.id || pg._id;
  return `<article class="pg-card" draggable="true" data-id="${propertyId}">
    <div class="relative"><img class="pg-photo" src="${pg.image}" alt="${pg.name} interior"><span class="absolute top-3 left-3 tag">${pg.type}</span>${pg.verified ? '<span class="absolute top-3 right-3 verified">✓ Verified</span>' : ""}</div>
    <div class="pg-body"><div class="flex justify-between gap-2"><h3 class="pg-title">${pg.name}</h3><span class="font-bold text-sm">★ ${pg.rating || "New"}</span></div><p class="text-xs text-ink/55 mt-2">${pg.area} · ${pg.distance || "New listing"}</p><div class="flex gap-1 flex-wrap mt-4">${(pg.amenities || []).map((amenity) => `<span class="tag">${amenity}</span>`).join("")}</div><div class="flex items-end justify-between mt-5"><p class="font-bold">₹${pg.rent.toLocaleString("en-IN")}<span class="text-xs text-ink/50 font-normal"> / month</span></p><button class="text-coral font-bold text-sm details-btn" data-id="${propertyId}" data-name="${pg.name}">View ↗</button></div></div></article>`;
}

function bindDragAndDrop() {
  document.querySelectorAll(".pg-card").forEach((card) => {
    card.addEventListener("dragstart", () => card.classList.add("dragging"));
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      showToast("Added to your shortlist.");
    });
  });
  document
    .querySelectorAll(".details-btn")
    .forEach((button) =>
      button.addEventListener("click", () =>
        openPropertyDetails(button.dataset.id),
      ),
    );
}

async function loadHomes() {
  const params = new URLSearchParams();
  const area = document.querySelector("#areaFilter").value;
  const maxRent = document.querySelector("#rentFilter").value;
  const type = document.querySelector("#typeFilter").value;
  const gender = document.querySelector("#genderFilter").value;
  if (area) params.set("area", area);
  if (maxRent) params.set("maxRent", maxRent);
  if (type) params.set("type", type);
  if (gender) params.set("gender", gender);
  try {
    const response = await fetch(`/api/pgs?${params}`);
    homes = await response.json();
  } catch {
    homes = [];
  }
  grid.innerHTML = homes.map(cardTemplate).join("");
  emptyState.classList.toggle("hidden", homes.length > 0);
  bindDragAndDrop();
}

document
  .querySelector("#filtersBtn")
  .addEventListener("click", () =>
    document.querySelector("#filters").classList.toggle("hidden"),
  );
["areaFilter", "rentFilter", "typeFilter", "genderFilter"].forEach((id) =>
  document.querySelector(`#${id}`).addEventListener("input", loadHomes),
);
document
  .querySelector("#ownerBtn")
  .addEventListener("click", openOwnerDashboard);
document
  .querySelector("#headerOwnerBtn")
  .addEventListener("click", openOwnerDashboard);
document.querySelector("#closeOwnerBtn").addEventListener("click", () => {
  document.querySelector("#ownerDashboard").classList.add("hidden");
  document.querySelector("#owner").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#newPropertyBtn").addEventListener("click", () => {
  editingPropertyId = null;
  document.querySelector("#propertyForm h3").textContent = "Add a PG";
  document.querySelector("#propertyForm").reset();
  document.querySelector("#propertyCity").value = "Bengaluru";
  document.querySelector("#propertyForm").classList.remove("hidden");
  document.querySelector("#propertyName").focus();
});
document
  .querySelector("#cancelPropertyBtn")
  .addEventListener("click", () =>
    document.querySelector("#propertyForm").classList.add("hidden"),
  );
document
  .querySelector("#ownerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest(`/api/owners/${getOwnerId()}`, {
        method: "PUT",
        body: JSON.stringify({
          name: document.querySelector("#ownerName").value,
          phone: document.querySelector("#ownerPhone").value,
          email: document.querySelector("#ownerEmail").value,
          bio: document.querySelector("#ownerBio").value,
        }),
      });
      showToast("Owner profile saved on the server.");
    } catch (error) {
      showToast(error.message);
    }
  });
document
  .querySelector("#propertyForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const property = {
      ownerId: getOwnerId(),
      name: document.querySelector("#propertyName").value,
      area: document.querySelector("#propertyArea").value,
      city: document.querySelector("#propertyCity").value,
      rent: Number(document.querySelector("#propertyRent").value),
      rooms: Number(document.querySelector("#propertyRooms").value),
      type: document.querySelector("#propertyType").value,
      gender: document.querySelector("#propertyGender").value,
      rating: 0,
      distance: "Owner listing",
      verified: false,
      amenities: document
        .querySelector("#propertyAmenities")
        .value.split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: document.querySelector("#propertyDescription").value,
      image:
        document.querySelector("#propertyImage").value ||
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
      owner: {
        name: document.querySelector("#ownerName").value || "Property owner",
        phone: document.querySelector("#ownerPhone").value || "",
      },
    };
    try {
      await apiRequest(
        editingPropertyId ? `/api/pgs/${editingPropertyId}` : "/api/pgs",
        {
          method: editingPropertyId ? "PATCH" : "POST",
          body: JSON.stringify(property),
        },
      );
      editingPropertyId = null;
      event.target.reset();
      document.querySelector("#propertyCity").value = "Bengaluru";
      document.querySelector("#propertyForm").classList.add("hidden");
      await renderOwnerProperties();
      await loadHomes();
      showToast("Property published on the server.");
    } catch (error) {
      showToast(error.message);
    }
  });
document
  .querySelector("#closePropertyBtn")
  .addEventListener("click", closePropertyDetails);
document.querySelector("#propertyModal").addEventListener("click", (event) => {
  if (event.target.id === "propertyModal") closePropertyDetails();
});
document
  .querySelector("#menuBtn")
  .addEventListener("click", () =>
    showToast("Use Find a PG or For owners to explore Nestly."),
  );
loadHomes();
renderOwnerProperties();

function openOwnerDashboard() {
  document.querySelector("#ownerDashboard").classList.remove("hidden");
  apiRequest(`/api/owners/${getOwnerId()}`)
    .then((profile) => {
      ["name", "phone", "email", "bio"].forEach((key) => {
        document.querySelector(
          `#owner${key[0].toUpperCase()}${key.slice(1)}`,
        ).value = profile[key] || "";
      });
    })
    .catch((error) => showToast(error.message));
  renderOwnerProperties();
  document
    .querySelector("#ownerDashboard")
    .scrollIntoView({ behavior: "smooth" });
}

async function renderOwnerProperties() {
  try {
    const properties = await fetchOwnerProperties();
    document.querySelector("#ownerProperties").innerHTML = properties
      .map(
        (property) =>
          `<article class="owner-property"><img src="${property.image}" alt="${property.name}"><div class="min-w-0"><h4>${property.name}</h4><p>${property.area} · ₹${property.rent.toLocaleString("en-IN")} / month</p><button class="property-link" data-id="${property.id || property._id}">View details ↗</button><button class="property-edit" data-id="${property.id || property._id}">Edit</button></div><button class="delete-property" data-id="${property.id || property._id}" aria-label="Remove ${property.name}">×</button></article>`,
      )
      .join("");
    document
      .querySelector("#ownerEmpty")
      .classList.toggle("hidden", properties.length > 0);
  } catch (error) {
    document.querySelector("#ownerProperties").innerHTML =
      `<div class="empty-owner">${error.message}</div>`;
    return;
  }
  document
    .querySelectorAll(".property-link")
    .forEach((button) =>
      button.addEventListener("click", () =>
        openPropertyDetails(button.dataset.id),
      ),
    );
  document
    .querySelectorAll(".property-edit")
    .forEach((button) =>
      button.addEventListener("click", () => editProperty(button.dataset.id)),
    );
  document.querySelectorAll(".delete-property").forEach((button) =>
    button.addEventListener("click", async () => {
      try {
        await apiRequest(`/api/pgs/${button.dataset.id}`, { method: "DELETE" });
        await renderOwnerProperties();
        await loadHomes();
        showToast("Property removed from the server.");
      } catch (error) {
        showToast(error.message);
      }
    }),
  );
}

function editProperty(id) {
  const property = ownerProperties.find(
    (item) => String(item.id || item._id) === String(id),
  );
  if (!property) return;
  editingPropertyId = id;
  document.querySelector("#propertyForm h3").textContent = "Edit property";
  [
    "name",
    "area",
    "city",
    "rent",
    "rooms",
    "type",
    "gender",
    "image",
    "description",
  ].forEach((key) => {
    document.querySelector(
      `#property${key[0].toUpperCase()}${key.slice(1)}`,
    ).value = property[key] || "";
  });
  document.querySelector("#propertyAmenities").value = (
    property.amenities || []
  ).join(", ");
  document.querySelector("#propertyForm").classList.remove("hidden");
  document
    .querySelector("#propertyForm")
    .scrollIntoView({ behavior: "smooth" });
}

function openPropertyDetails(id) {
  apiRequest(`/api/pgs/${id}`)
    .then((property) => {
      document.querySelector("#modalPropertyImage").src = property.image;
      document.querySelector("#modalPropertyImage").alt = property.name;
      document.querySelector("#modalPropertyType").textContent = property.type;
      document.querySelector("#modalPropertyName").textContent = property.name;
      document.querySelector("#modalPropertyLocation").textContent =
        `${property.area}, ${property.city || "Bengaluru"} · ${property.rooms} room${property.rooms === 1 ? "" : "s"}`;
      document.querySelector("#modalPropertyDescription").textContent =
        property.description;
      document.querySelector("#modalPropertyAmenities").innerHTML = (
        property.amenities || []
      )
        .map((amenity) => `<span class="tag">${amenity}</span>`)
        .join("");
      document.querySelector("#modalPropertyRent").textContent =
        `₹${property.rent.toLocaleString("en-IN")} / month`;
      document.querySelector("#modalPropertyOwner").textContent =
        `Owner: ${property.owner?.name || "Nestly verified owner"}`;
      document.querySelector("#propertyModal").classList.remove("hidden");
    })
    .catch((error) => showToast(error.message));
}

function closePropertyDetails() {
  document.querySelector("#propertyModal").classList.add("hidden");
}

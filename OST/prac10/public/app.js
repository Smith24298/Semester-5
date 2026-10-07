const grid = document.querySelector("#pgGrid");
const emptyState = document.querySelector("#emptyState");
const toast = document.querySelector("#toast");
let homes = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function cardTemplate(pg) {
  return `<article class="pg-card" draggable="true" data-id="${pg.id}">
    <div class="relative"><img class="pg-photo" src="${pg.image}" alt="${pg.name} interior"><span class="absolute top-3 left-3 tag">${pg.type}</span>${pg.verified ? '<span class="absolute top-3 right-3 verified">✓ Verified</span>' : ""}</div>
    <div class="pg-body"><div class="flex justify-between gap-2"><h3 class="pg-title">${pg.name}</h3><span class="font-bold text-sm">★ ${pg.rating}</span></div><p class="text-xs text-ink/55 mt-2">${pg.area} · ${pg.distance}</p><div class="flex gap-1 flex-wrap mt-4">${pg.amenities.map((amenity) => `<span class="tag">${amenity}</span>`).join("")}</div><div class="flex items-end justify-between mt-5"><p class="font-bold">₹${pg.rent.toLocaleString("en-IN")}<span class="text-xs text-ink/50 font-normal"> / month</span></p><button class="text-coral font-bold text-sm details-btn" data-name="${pg.name}">View ↗</button></div></div></article>`;
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
        showToast(`Opening ${button.dataset.name} details...`),
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
  .addEventListener("click", () =>
    showToast("Owner dashboard is ready for your next listing."),
  );
document
  .querySelector("#menuBtn")
  .addEventListener("click", () =>
    showToast("Use Find a PG or For owners to explore Nestly."),
  );
loadHomes();

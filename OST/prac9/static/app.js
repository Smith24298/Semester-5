const state = { todos: [], filter: "all", draggingId: null };
const statusLabels = {
  backlog: "Backlog",
  progress: "In progress",
  done: "Done",
};
const board = document.querySelector("#board");
const dialog = document.querySelector("#task-dialog");
const form = document.querySelector("#task-form");
const toast = document.querySelector("#toast");

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat(
  "en",
  { month: "long", day: "numeric", year: "numeric" },
).format(new Date());

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok)
    throw new Error((await response.json()).detail || "Something went wrong");
  return response.status === 204 ? null : response.json();
}

async function loadTodos() {
  try {
    state.todos = await request("/api/todos");
    document.querySelector("#connection-label").textContent = "MySQL connected";
    render();
  } catch (error) {
    document.querySelector("#connection-label").textContent =
      "Database unavailable";
    showToast(error.message);
  }
}

function render() {
  const counts = { all: state.todos.length, backlog: 0, progress: 0, done: 0 };
  state.todos.forEach((todo) => counts[todo.status]++);
  Object.entries(counts).forEach(([key, value]) => {
    document.querySelector(`#count-${key}`).textContent = value;
  });
  ["backlog", "progress", "done"].forEach((status) => {
    document.querySelector(`#column-count-${status}`).textContent =
      counts[status];
    const zone = document.querySelector(`[data-drop-status="${status}"]`);
    zone.innerHTML = "";
    state.todos
      .filter(
        (todo) =>
          todo.status === status &&
          (state.filter === "all" || state.filter === status),
      )
      .forEach((todo) => zone.appendChild(createCard(todo)));
  });
  document.querySelector("#empty-state").hidden = state.todos.length > 0;
}

function createCard(todo) {
  const card = document.createElement("article");
  card.className = `todo-card ${todo.status === "done" ? "is-done" : ""}`;
  card.draggable = true;
  card.dataset.todoId = todo.id;
  card.innerHTML = `<div class="card-top"><span class="drag-handle" title="Drag to move">⠿</span><button class="delete-button" aria-label="Delete ${escapeHtml(todo.title)}" title="Delete task">×</button></div><h3>${escapeHtml(todo.title)}</h3>${todo.description ? `<p>${escapeHtml(todo.description)}</p>` : ""}<footer><span>${statusLabels[todo.status]}</span><time>${formatDate(todo.updated_at)}</time></footer>`;
  card.addEventListener("dragstart", () => {
    state.draggingId = todo.id;
    card.classList.add("is-dragging");
  });
  card.addEventListener("dragend", () => {
    state.draggingId = null;
    card.classList.remove("is-dragging");
    document
      .querySelectorAll(".drop-zone")
      .forEach((zone) => zone.classList.remove("is-over"));
  });
  card
    .querySelector(".delete-button")
    .addEventListener("click", () => deleteTodo(todo.id));
  return card;
}

function escapeHtml(value) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );
}
function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2600);
}

async function moveTodo(id, status) {
  const todo = state.todos.find((item) => item.id === id);
  if (!todo || todo.status === status) return;
  try {
    const updated = await request(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    state.todos = state.todos.map((item) => (item.id === id ? updated : item));
    render();
    showToast(`Moved to ${statusLabels[status]}`);
  } catch (error) {
    showToast(error.message);
  }
}

async function deleteTodo(id) {
  try {
    await request(`/api/todos/${id}`, { method: "DELETE" });
    state.todos = state.todos.filter((todo) => todo.id !== id);
    render();
    showToast("Task deleted");
  } catch (error) {
    showToast(error.message);
  }
}

document.querySelectorAll(".drop-zone").forEach((zone) => {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("is-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-over");
    moveTodo(state.draggingId, zone.dataset.dropStatus);
  });
});

document.querySelectorAll(".filter-tab").forEach((button) =>
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document
      .querySelectorAll(".filter-tab")
      .forEach((tab) => tab.classList.toggle("active", tab === button));
    render();
  }),
);
document.querySelector("#refresh-todos").addEventListener("click", loadTodos);
document.querySelector("#open-create").addEventListener("click", () => {
  form.reset();
  dialog.showModal();
  document.querySelector("#task-title").focus();
});
document
  .querySelectorAll("#close-dialog, #cancel-dialog")
  .forEach((button) => button.addEventListener("click", () => dialog.close()));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.querySelector("#task-title").value.trim();
  const description = document.querySelector("#task-description").value.trim();
  if (!title) return;
  try {
    const todo = await request("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
    state.todos.unshift(todo);
    dialog.close();
    render();
    showToast("Task created");
  } catch (error) {
    showToast(error.message);
  }
});

loadTodos();

const notesInput = document.getElementById("notes");
const noteList = document.getElementById("note-list");
const searchInput = document.getElementById("search");
const authModal = document.getElementById("auth-modal");
const mainApp = document.querySelector(".main");
const archiveList = document.getElementById("archive-list");
const trashList = document.getElementById("trash-list");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let archive = JSON.parse(localStorage.getItem("archive")) || [];
let trash = JSON.parse(localStorage.getItem("trash")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
document.querySelector(".fa-plus").addEventListener("click", addNote);

function showSection(section) {
  const sections = ["notes", "archive", "trash"];
  sections.forEach((s) => {
    const sectionElement = document.getElementById(`${s}-list`);
    if (sectionElement) {
      sectionElement.style.display = s === section ? "block" : "none";
    }
  });

  document.getElementById("note-input").style.display =
    section === "notes" ? "flex" : "none";

  if (section === "notes") renderNotes();
  if (section === "archive") renderArchive();
  if (section === "trash") renderTrash();
}
function addNote() {
  const noteContent = notesInput.value.trim();

  if (noteContent) {
    notes.push({ content: noteContent });
    localStorage.setItem("notes", JSON.stringify(notes));
    notesInput.value = "";
    renderNotes();
  }
}
function renderNotes() {
  noteList.innerHTML = "";
  if (notes.length === 0) {
    noteList.innerHTML = "<p>No notes available</p>";
  } else {
    notes.forEach((note, index) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note");
      noteElement.innerHTML = `
        <div class="note-content">
          <p>${note.content}</p>
        </div>
        <div class="note-actions">
          <span class="fas fa-edit edit-note" data-index="${index}"></span>
          <span class="fas fa-trash-alt save-to-trash" data-index="${index}"></span>
          <span class="fas fa-box archive-note" data-index="${index}"></span>
        </div>
      `;
      noteList.appendChild(noteElement);
    });

    document
      .querySelectorAll(".save-to-trash")
      .forEach((button) => button.addEventListener("click", deleteNote));
    document
      .querySelectorAll(".archive-note")
      .forEach((button) => button.addEventListener("click", archiveNote));
    document
      .querySelectorAll(".edit-note")
      .forEach((button) => button.addEventListener("click", editNote));
  }
}

function renderArchive() {
  archiveList.innerHTML = "";
  if (archive.length === 0) {
    archiveList.innerHTML = "<p>Archive is empty</p>";
  } else {
    archive.forEach((note, index) => {
      const archiveElement = document.createElement("div");
      archiveElement.classList.add("archive-item");
      archiveElement.innerHTML = `
        <div class="note-content">
          <p>${note.content}</p>
        </div>
        <div class="note-actions">
          <span class="fas fa-undo restore-note" data-index="${index}"></span>
        </div>
      `;
      archiveList.appendChild(archiveElement);
    });

    document
      .querySelectorAll(".restore-note")
      .forEach((button) =>
        button.addEventListener("click", restoreNoteFromArchive)
      );
  }
}

function renderTrash() {
  trashList.innerHTML = "";
  if (trash.length === 0) {
    trashList.innerHTML = "<p>Trash is empty</p>";
  } else {
    trash.forEach((note, index) => {
      const trashElement = document.createElement("div");
      trashElement.classList.add("trash-item");
      trashElement.innerHTML = `
        <div class="note-content">
          <p>${note.content}</p>
        </div>
        <div class="note-actions">
          <span class="fas fa-undo restore-note" data-index="${index}"></span>
          <span class="fas fa-times delete-forever" data-index="${index}"></span>
        </div>
      `;
      trashList.appendChild(trashElement);
    });

    document
      .querySelectorAll(".restore-note")
      .forEach((button) =>
        button.addEventListener("click", restoreNoteFromTrash)
      );
    document
      .querySelectorAll(".delete-forever")
      .forEach((button) => button.addEventListener("click", deleteForever));
  }
}

function editNote(e) {
  const index = e.target.getAttribute("data-index");
  const noteContent = document.querySelectorAll(".note-content")[index];

  noteContent.setAttribute("contenteditable", "true");
  noteContent.focus();

  noteContent.addEventListener("blur", () => saveEdit(index), { once: true });
  noteContent.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEdit(index);
    }
  });
}

function saveEdit(index) {
  const noteContent = document.querySelectorAll(".note-content")[index];
  const updatedContent = noteContent.innerText.trim();

  if (updatedContent !== notes[index].content) {
    notes[index].content = updatedContent;
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }

  noteContent.removeAttribute("contenteditable");
}

function deleteNote(e) {
  const index = e.target.getAttribute("data-index");
  const note = notes.splice(index, 1)[0];
  trash.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("trash", JSON.stringify(trash));
  renderNotes();
  alert("Note moved to trash!");
}

function archiveNote(e) {
  const index = e.target.getAttribute("data-index");
  const note = notes.splice(index, 1)[0];
  archive.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("archive", JSON.stringify(archive));
  renderNotes();
  alert("Note archived!");
}

function restoreNoteFromArchive(e) {
  const index = e.target.getAttribute("data-index");
  const note = archive.splice(index, 1)[0];
  notes.push(note);
  localStorage.setItem("archive", JSON.stringify(archive));
  localStorage.setItem("notes", JSON.stringify(notes));
  renderArchive();
  renderNotes();
  alert("Note restored to Notes!");
}

function restoreNoteFromTrash(e) {
  const index = e.target.getAttribute("data-index");
  const note = trash.splice(index, 1)[0];
  notes.push(note);
  localStorage.setItem("trash", JSON.stringify(trash));
  localStorage.setItem("notes", JSON.stringify(notes));
  renderTrash();
  renderNotes();
  alert("Note restored to Notes!");
}

function deleteForever(e) {
  const index = e.target.getAttribute("data-index");
  trash.splice(index, 1);
  localStorage.setItem("trash", JSON.stringify(trash));
  renderTrash();
  alert("Note permanently deleted!");
}

window.onload = () => {
  showSection("notes");
};
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

function openAuthModal() {
  authModal.style.display = "flex";
}

function closeAuthModal() {
  authModal.style.display = "none";
}

function showSignupForm() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("signup-section").style.display = "block";
}

function showLoginForm() {
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("signup-section").style.display = "none";
}

loginButton.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    alert("Login successful!");
    closeAuthModal();
  } else {
    alert("Invalid credentials. Please try again.");
  }
});

signupButton.addEventListener("click", () => {
  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();
  if (!username || !password) {
    alert("Both fields are required.");
    return;
  }
  if (users.some((u) => u.username === username)) {
    alert("Username already taken.");
    return;
  }
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful. Please log in.");
  showLoginForm();
});

document.querySelector(".fa-plus").addEventListener("click", addNote);
window.onload = () => showSection("notes");
const style = document.createElement("style");
style.innerHTML = `
  .sidebar button.selected {
    background-color: #ffffe0;
  }
`;
document.head.appendChild(style);

const sidebarButtons = document.querySelectorAll(".sidebar button");

sidebarButtons.forEach((button) => {
  button.addEventListener("click", function () {
    sidebarButtons.forEach((btn) => btn.classList.remove("selected"));
    this.classList.add("selected");
  });
});

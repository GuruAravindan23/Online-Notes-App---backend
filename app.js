const form = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");

const API_URL = "http://localhost:5000/notes"; // use deployed backend URL when ready

// Load all notes
async function loadNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();
  notesList.innerHTML = "";

  if (notes.length === 0) return;

  // Find the newest note by createdAt
  const newestNoteId = notes.reduce((latest, note) => {
    return new Date(note.createdAt) > new Date(latest.createdAt) ? note : latest;
  }, notes[0])._id;

  notes.forEach(note => {
    const li = document.createElement("li");

    // Highlight newest note
    if (note._id === newestNoteId) {
      li.style.backgroundColor = "#d1ffd6"; // light green for newest
    }

    const span = document.createElement("span");
    span.innerHTML = `<strong>${note.title}</strong>: ${note.content} <br> <small>${new Date(note.createdAt).toLocaleString()}</small>`;
    li.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      await fetch(`${API_URL}/${note._id}`, { method: "DELETE" });
      loadNotes();
    };

    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// Add new note
form.addEventListener("submit", async e => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  form.reset();
  loadNotes();
});

// Initial load
loadNotes();

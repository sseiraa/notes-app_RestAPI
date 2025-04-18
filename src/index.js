import "./style/style.css";
import "./components/AppHeader.js";
import "./components/SearchNote.js";
import "./components/NoteItem.js";
import "./components/NoteGrid.js";
import "./components/Archive.js";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from "./data/notesService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const noteTitle = document.getElementById("note-title");
  const noteBody = document.getElementById("note-body");
  const addNoteBtn = document.getElementById("add-note-btn");
  const noteGrid = document.querySelector("note-grid");

  let allNotes = [];

  // Memuat catatan dari API
  async function loadNotes() {
    try {
      const response = await fetchNotes();
      allNotes = response.data || response;
      console.log("All Notes:", allNotes);
      noteGrid.data = getFilteredNotes();
    } catch (error) {
      console.error("Gagal memuat catatan:", error);
      alert("Gagal memuat catatan. Silakan coba lagi.");
    }
  }

  // Mendapatkan catatan berdasarkan view saat ini
  function getFilteredNotes() {
    const view = noteGrid.view || "active";
    const filteredNotes = view === "archived"
      ? allNotes.filter((n) => n.archived)
      : allNotes.filter((n) => !n.archived);
    console.log("Filtered Notes:", filteredNotes);
    return filteredNotes;
  }

  // Validasi form
  const validateForm = () => {
    addNoteBtn.disabled = !noteTitle.value.trim() || !noteBody.value.trim();
  };

  noteTitle.addEventListener("input", validateForm);
  noteBody.addEventListener("input", validateForm);

  // Menambah catatan
  addNoteBtn.addEventListener("click", async () => {
    const title = noteTitle.value.trim();
    const body = noteBody.value.trim();
    if (!title || !body) return;

    try {
      const response = await createNote({ title, body });
      allNotes.push(response.data);
      noteGrid.data = getFilteredNotes();
      noteTitle.value = "";
      noteBody.value = "";
      validateForm();
    } catch (error) {
      console.error("Gagal membuat catatan:", error);
      alert("Gagal membuat catatan. Silakan coba lagi.");
    }
  });

  // Fungsi untuk arsipkan catatan
  async function archiveSelectedNote(noteId) {
    try {
      await archiveNote(noteId);
      allNotes = allNotes.map(note =>
        note.id === noteId ? { ...note, archived: true } : note
      );
      noteGrid.data = getFilteredNotes();
    } catch (error) {
      console.error("Gagal mengarsipkan catatan:", error);
      alert("Gagal mengarsipkan catatan. Silakan coba lagi.");
    }
  }

  // Fungsi untuk mengembalikan catatan dari arsip
  async function unarchiveSelectedNote(noteId) {
    try {
      await unarchiveNote(noteId);
      allNotes = allNotes.map(note =>
        note.id === noteId ? { ...note, archived: false } : note
      );
      noteGrid.data = getFilteredNotes();
    } catch (error) {
      console.error("Gagal mengembalikan catatan:", error);
      alert("Gagal mengembalikan catatan. Silakan coba lagi.");
    }
  }

  // Event listener untuk archive/unarchive note
  noteGrid.addEventListener("archive-note", (event) => {
    const noteId = event.detail.noteId;
    archiveSelectedNote(noteId);
  });

  noteGrid.addEventListener("unarchive-note", (event) => {
    const noteId = event.detail.noteId;
    unarchiveSelectedNote(noteId);
  });

  // Mengubah tampilan ke arsip
  document.getElementById("show-archived").addEventListener("click", () => {
    noteGrid.view = "archived";
    noteGrid.data = getFilteredNotes();
    console.log("Tombol Archived diklik, view set ke Archived");
  });

  // Mengubah tampilan ke aktif
  document.getElementById("show-active").addEventListener("click", () => {
    noteGrid.view = "active";
    noteGrid.data = getFilteredNotes();
    console.log("Tombol Active diklik, view set ke Active");
  });

  // Event listener saat catatan berubah
  document.addEventListener("note-changed", loadNotes);

  // Set view default ke "active"
  noteGrid.view = "active";
  loadNotes();
});

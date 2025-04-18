import { getNotes } from "../data/notesService.js";

let notes = []; // Variabel untuk menyimpan catatan

// Fungsi untuk mengambil catatan dan menyimpannya dalam variabel notes
async function fetchNotes() {
  try {
    const fetchedNotes = await getNotes(); // Ambil catatan dari server
    if (Array.isArray(fetchedNotes)) {
      notes = fetchedNotes; // Pastikan notes adalah array
    } else {
      console.error("Data yang diterima bukan array:", fetchedNotes);
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

// Fungsi untuk menampilkan catatan arsip
function displayArchivedNotes() {
  if (!Array.isArray(notes)) {
    console.error("notes bukan array:", notes);
    return; // Keluar dari fungsi jika notes bukan array
  }

  const archivedNotes = notes.filter(note => note.archived);
  const notesContainer = document.getElementById("notes-container");
  
  // Kosongkan kontainer sebelum menambahkan catatan baru
  notesContainer.innerHTML = '';

  archivedNotes.forEach(note => {
    const noteElement = document.createElement("div");
    noteElement.textContent = note.content;
    notesContainer.appendChild(noteElement);
  });
}

// Event listener untuk tombol "Archived Notes"
document.getElementById("show-archived").addEventListener("click", displayArchivedNotes);

// Ambil catatan saat halaman dimuat
fetchNotes();
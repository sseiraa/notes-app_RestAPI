import { apiBaseUrl, getHeaders } from "./apiConfig.js"; // Impor konfigurasi terbaru

// Fungsi untuk mengambil daftar catatan
export async function fetchNotes() {
  const res = await fetch(`${apiBaseUrl}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorMessage = await res.text(); // Ambil pesan kesalahan dari respons
    throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  return res.json();
}

// Fungsi untuk membuat catatan baru
export async function createNote(note) {
  const res = await fetch(`${apiBaseUrl}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to create note: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  return res.json();
}

// Fungsi untuk memperbarui catatan
export async function updateNote(id, updatedNote) {
  const res = await fetch(`${apiBaseUrl}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updatedNote),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to update note: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  return res.json();
}

// Fungsi untuk menghapus catatan
export async function deleteNote(id) {
  const res = await fetch(`${apiBaseUrl}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to delete note: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  return res.json(); // Pastikan server mengembalikan respon yang diharapkan
}


// Fungsi untuk mengarsipkan catatan
export async function archiveNote(id) {
  const res = await fetch(`${apiBaseUrl}/${id}/archive`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to archive note: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  return res.json(); // Pastikan server mengembalikan respon yang diharapkan
}


 
// Fungsi untuk mengembalikan catatan dari arsip
export async function unarchiveNote(id) {
  const res = await fetch(`${apiBaseUrl}/${id}/unarchive`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to unarchive note: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  return res.json(); 
}

export async function getNotes() {
  const res = await fetch(`${apiBaseUrl}/notes/archived`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText} - ${errorMessage}`);
  }

  const data = await res.json(); // Mengambil data dari respons
  console.log("Data yang diterima:", data); // Tambahkan log ini
  return Array.isArray(data) ? data : []; // Pastikan mengembalikan array
}
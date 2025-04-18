// File: apiConfig.js

const API_BASE_URL = "https://notes-api.dicoding.dev/v2/notes";

// Ambil token terbaru setiap kali fungsi ini dipanggil
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Fungsi yang mengembalikan headers terbaru
export function getHeaders() {
  return {
    "Content-Type": "application/json",
    ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
  };
}

// Ekspor juga baseUrl sebagai konstanta
export const apiBaseUrl = API_BASE_URL;

// Ekspor tambahan endpoint
export const endpoints = {
  notes: `${API_BASE_URL}`,
  archived: `${API_BASE_URL}/archived`,
  detail: (id) => `${API_BASE_URL}/${id}`,
  addArchive: (id) => `${API_BASE_URL}/${id}/archive`,
  addUnArchive: (id) => `${API_BASE_URL}/${id}/unarchive`,
  delete: (id) => `${API_BASE_URL}/${id}`,
};

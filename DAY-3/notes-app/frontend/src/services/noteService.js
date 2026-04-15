import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/notes";

export async function getNotes() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createNote(payload) {
  const response = await axios.post(API_URL, payload);
  return response.data;
}

export async function updateNote(id, payload) {
  const response = await axios.put(`${API_URL}/${id}`, payload);
  return response.data;
}

export async function deleteNote(id) {
  await axios.delete(`${API_URL}/${id}`);
}

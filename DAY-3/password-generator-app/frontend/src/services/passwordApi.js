import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004/api/password";

export async function generatePassword(payload) {
  const response = await axios.post(`${API_URL}/generate`, payload);
  return response.data;
}

export async function getHistory() {
  const response = await axios.get(`${API_URL}/history`);
  return response.data;
}

export async function clearHistory() {
  await axios.delete(`${API_URL}/history`);
}

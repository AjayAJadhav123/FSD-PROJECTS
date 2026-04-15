import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/auth";

export async function signup(payload) {
  const response = await axios.post(`${API_URL}/signup`, payload);
  return response.data;
}

export async function login(payload) {
  const response = await axios.post(`${API_URL}/login`, payload);
  return response.data;
}

export async function fetchCurrentUser(token) {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export async function login(credentials) {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", credentials.username);
      // Guardar el userId si el backend lo devuelve
      if (res.data?.userId) {
        localStorage.setItem("userId", res.data.userId);
      }
    }
    return res;
  } catch (err) {
    throw err;
  }
}

export async function register(data) {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res;
  } catch (err) {
    throw err;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
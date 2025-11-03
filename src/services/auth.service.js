import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export async function login(credentials) {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username); // Del response, no de credentials
      localStorage.setItem("userId", res.data.userId);
      if (res.data?.accountNumber) {
        localStorage.setItem("accountNumber", res.data.accountNumber);
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
  localStorage.removeItem("accountNumber");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function getAccountNumber() {
  return localStorage.getItem("accountNumber");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
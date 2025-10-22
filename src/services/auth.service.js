// src/services/auth.service.js
// Servicio centralizado para autenticación (login / register / logout)

import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:4000/api/auth";

/**
 * Inicia sesión del usuario
 * @param {{ username: string, password: string }} credentials
 */
export async function login(credentials) {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    // guardar token en localStorage (modo demo)
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", credentials.username);
    }
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * Registra un nuevo usuario
 * @param {{ username: string, password: string }} data
 */
export async function register(data) {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * Cierra sesión eliminando los datos locales
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

/**
 * Obtiene el token actual del usuario autenticado
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Devuelve true si hay sesión activa
 */
export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

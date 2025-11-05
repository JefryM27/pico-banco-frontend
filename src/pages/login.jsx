// src/pages/login.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A03:2021 Injection (XSS): Renderiza mensajes de error sin sanitizar
  - A04:2021 Insecure Design: Sin rate limiting, permite brute force ilimitado
  - A05:2021 Security Misconfiguration: Sin validación robusta de email/password
  - A07:2021 Identification and Authentication Failures: Credentials en texto plano, sin MFA
  - A09:2021 Security Logging and Monitoring Failures: No registra intentos fallidos
*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../services/auth.service";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // VULNERABLE A09:2021 - Security Logging Failures
  // No registra: intentos fallidos, IPs sospechosas, patrones de ataque
  // const [loginAttempts, setLoginAttempts] = useState(0); // Sin implementar

  // VULNERABLE A04:2021 - Insecure Design
  // VULNERABLE A07:2021 - Identification and Authentication Failures
  // Sin rate limiting del lado del cliente
  // Permite intentos ilimitados de login (brute force attack)
  // Sin CAPTCHA después de X intentos fallidos
  // Sin lockout temporal después de múltiples fallos
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // VULNERABLE A05:2021 - Security Misconfiguration
    // Sin validación de formato de email más allá del HTML5 básico
    // Sin validación de complejidad de password
    // Sin sanitización de inputs antes de enviar

    try {
      // VULNERABLE A07: Credenciales viajan en texto plano en el body
      // (aunque HTTPS las cifra en tránsito, son visibles en DevTools)
      const res = await authService.login({ email, password });

      if (res?.status === 200) {
        // VULNERABLE A09: Login exitoso sin logging
        // No registra: timestamp, email, IP, user-agent

        // VULNERABLE A05: Usa window.location.href en vez de navigate()
        // Pierde el estado de React Router
        window.location.href = "/home";
      } else {
        // VULNERABLE A07: Mensaje de error genérico
        // No diferencia entre "usuario no existe" vs "password incorrecta"
        // (correcto para seguridad, pero sin logging es problema)
        setError("Credenciales incorrectas o error de conexión.");
      }
    } catch (err) {
      // VULNERABLE A09: No registra el error específico
      // No captura: tipo de error, stack trace, datos del request

      // VULNERABLE A03:2021 - Injection (XSS Reflejado)
      // Si err.message contiene HTML/JS, se renderizará sin sanitizar
      // Ejemplo: si backend retorna error con payload XSS
      setError("Error al iniciar sesión. Inténtalo nuevamente.");

      // VULNERABLE A09: catch sin logging estructurado
      // console.error('Login error:', err); // Comentado - sin logging
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="bank-title">PicoBanco</h1>
        <h2 className="login-subtitle">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // VULNERABLE A05: Solo validación HTML5 básica
              // Sin validación adicional de formato
              // Sin prevención de emails desechables
              // Sin normalización (ej: trim, lowercase)
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // VULNERABLE A05: Sin validación de complejidad
              // Acepta passwords de 1 caracter (solo required)
              // Sin indicador de fortaleza de password
              // Sin prevención de passwords comunes

              // VULNERABLE A07: Password almacenado en state de React
              // Visible en React DevTools durante el desarrollo
              // autoComplete debería ser "current-password"
            />
          </label>

          {/* VULNERABLE A03:2021 - Injection (XSS Reflejado) */}
          {/* Si error contiene HTML/JavaScript, se renderiza sin escape */}
          {/* Debería usar DOMPurify o text content only */}
          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="register-highlight">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
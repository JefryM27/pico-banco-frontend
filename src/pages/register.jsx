// src/pages/Register.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A03:2021 Injection (XSS): Renderiza name/email/error sin sanitizar
  - A04:2021 Insecure Design: Sin rate limiting, permite registro masivo de cuentas spam
  - A05:2021 Security Misconfiguration: Sin validación de password débil, sin verificación de email
  - A07:2021 Identification and Authentication Failures: Sin CAPTCHA, sin confirmación de email
  - A09:2021 Security Logging and Monitoring Failures: No registra intentos de registro
  - A01:2021 Broken Access Control: Permite crear múltiples cuentas con mismo email variando mayúsculas
*/
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../services/auth.service";
import "./login.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // VULNERABLE A09:2021 - Security Logging and Monitoring Failures
  // No registra: intentos de registro, emails duplicados, IPs sospechosas

  // VULNERABLE A04:2021 - Insecure Design
  // VULNERABLE A07:2021 - Identification and Authentication Failures
  // Sin rate limiting del lado del cliente
  // Permite registro masivo de cuentas (account creation spam)
  // Sin CAPTCHA para prevenir bots
  // Sin verificación de email (permite emails falsos)
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // VULNERABLE A05:2021 - Security Misconfiguration
    // Sin validación de inputs antes de enviar:
    // - name: acepta cualquier string (emojis, scripts, caracteres especiales)
    // - email: solo validación HTML5 básica
    // - password: acepta passwords débiles (ej: "1", "a", "123")

    // VULNERABLE A05: Sin sanitización de name
    // name puede contener HTML/JS que se renderizará en otros componentes
    // Sin trim() - acepta espacios al inicio/final
    // Sin validación de longitud mínima/máxima

    // VULNERABLE A01:2021 - Broken Access Control
    // Sin normalización de email (lowercase, trim)
    // Permite crear cuentas con: "User@email.com" y "user@email.com"

    try {
      // VULNERABLE A07: Datos sensibles visibles en DevTools Network tab
      const res = await authService.register({ name, email, password });

      if (res?.status === 201 || res?.status === 200) {
        // VULNERABLE A09: Registro exitoso sin logging
        // No registra: timestamp, email, IP, user-agent, referrer

        setSuccess(true);

        // VULNERABLE A07: Redirección automática sin confirmación de email
        // Permite activar cuenta sin verificar propiedad del email
        setTimeout(() => navigate("/login"), 1500);
      } else {
        // VULNERABLE A03:2021 - Injection (XSS Reflejado)
        // Si la respuesta del servidor contiene HTML/JS, se renderiza sin sanitizar
        setError("Error al crear la cuenta. Inténtalo nuevamente.");
      }
    } catch (err) {
      // VULNERABLE A09: No registra errores específicos
      // No captura: tipo de error, datos del request, stack trace

      // VULNERABLE A07: Mensaje de error revela si email existe
      // "email ya existente" permite enumeración de usuarios
      setError("Error de conexión o email ya existente.");

      // VULNERABLE A09: catch sin logging
      // console.error('Register error:', err); // Sin implementar
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="bank-title">PicoBanco</h1>
        <h2 className="login-subtitle">Crear cuenta</h2>
        <p className="login-description">
          Regístrate para acceder al sistema <span>modo demo</span>
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Nombre completo
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Juan Pérez"
              required
              // VULNERABLE A05: Sin validación de longitud
              // minLength/maxLength no especificados
              // VULNERABLE A03: name sin sanitizar puede contener <script>
              // VULNERABLE A05: Sin pattern para validar formato (solo letras y espacios)
              // VULNERABLE A05: Sin trim automático (acepta espacios)
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: juan@ejemplo.com"
              required
              // VULNERABLE A05: Solo validación HTML5 básica
              // Acepta: test@test (sin TLD), test@localhost
              // VULNERABLE A01: Sin normalización a lowercase
              // VULNERABLE A05: Sin validación de dominios desechables
              // VULNERABLE A07: Sin verificación de existencia del email
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una contraseña"
              required
              // VULNERABLE A05:2021 - Security Misconfiguration (CRÍTICO)
              // Acepta passwords de 1 caracter (solo required)
              // Sin validación de complejidad:
              // - Sin longitud mínima (ej: minLength={8})
              // - Sin requerir mayúsculas/minúsculas
              // - Sin requerir números
              // - Sin requerir caracteres especiales
              // VULNERABLE A07: Sin indicador de fortaleza de password
              // VULNERABLE A07: Sin prevención de passwords comunes (123456, password, etc)
              // VULNERABLE A05: Sin mostrar requisitos de password al usuario
            />
          </label>

          {/* VULNERABLE A03:2021 - Injection (XSS Reflejado) */}
          {/* Si error contiene HTML/JavaScript del backend, se renderiza sin escape */}
          {error && <p className="error">{error}</p>}

          {success && (
            <p className="success">
              Cuenta creada correctamente. Redirigiendo...
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Registrar"}
          </button>
        </form>

        <p className="register-link">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="register-highlight">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

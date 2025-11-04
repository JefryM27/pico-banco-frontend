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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await authService.register({ name, email, password });
      if (res?.status === 201 || res?.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("Error al crear la cuenta. Inténtalo nuevamente.");
      }
    } catch (err) {
      setError("Error de conexión o email ya existente.");
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
            />
          </label>

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

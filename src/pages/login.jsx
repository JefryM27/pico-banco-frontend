import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../services/auth.service";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res?.status === 200) {
        navigate("/home");
      } else {
        setError("Credenciales incorrectas o error de conexión.");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo nuevamente.");
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
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: tu@email.com"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="tu contraseña"
              required
            />
          </label>

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

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../services/auth.service";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("🔵 Formulario enviado");
    setError(null);
    setLoading(true);

    try {
      console.log("🔵 Intentando login con:", { username, password });
      const res = await authService.login({ username, password });
      console.log("🔵 Respuesta completa:", res);
      console.log("🔵 res.data:", res.data);
      console.log("🔵 res.status:", res.status);
      
      if (res?.status === 200) {
        console.log("✅ Login exitoso");
        console.log("📦 LocalStorage token:", localStorage.getItem("token"));
        console.log("📦 LocalStorage username:", localStorage.getItem("username"));
        console.log("📦 LocalStorage userId:", localStorage.getItem("userId"));
        console.log("🚀 Intentando navegar a /home...");
        navigate("/home");
        console.log("✅ Navigate ejecutado");
      } else {
        console.log("❌ Status diferente de 200:", res?.status);
        setError("Credenciales incorrectas o error de conexión.");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Error al iniciar sesión. Inténtalo nuevamente.");
    } finally {
      console.log("🏁 Finally ejecutado");
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
            Usuario
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ej: juan"
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
// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">PicoBanco</h1>
        <ul className="navbar-links">
          <li>
            <Link to="/home">Inicio</Link>
          </li>
          <li>
            <Link to="/users">Usuarios</Link>
          </li>
          <li>
            <Link to="/transactions">Transacciones</Link>
          </li>
          <li>
            <Link to="/create">Nueva Transacción</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="btn-outline">Cuenta</button>
        <button className="btn-primary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

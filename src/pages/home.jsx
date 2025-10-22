import React from "react";
import Header from "../components/header.jsx"; // ✅ Importamos el header reutilizable
import { Link } from "react-router-dom";
import "./../index.css";

export default function Home() {
  return (
    <div className="dashboard-container">
      {/* ✅ Header reutilizable en toda la app */}
      <Header />

      {/* Contenido principal */}
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Panel de Administración</h2>
            <p className="dashboard-subtitle">
              Bienvenido al sistema bancario interno de PicoBanco.
            </p>
          </div>
        </header>

        {/* Tarjetas resumen */}
        <div className="dashboard-stats">
          <StatCard
            title="Usuarios"
            value="12"
            subtitle="Cuentas activas"
            color="yellow"
          />
          <StatCard
            title="Transacciones"
            value="248"
            subtitle="Operaciones registradas"
            color="green"
          />
          <StatCard
            title="Sistema"
            value="Operativo"
            subtitle="Actualizado al día"
            color="red"
          />
        </div>

        {/* Cuerpo principal */}
        <div className="dashboard-grid">
          <div className="card">
            <h3 className="card-title">Accesos rápidos</h3>
            <ul className="card-links">
              <MenuLink to="/users" label="Gestión de usuarios" />
              <MenuLink to="/transactions" label="Ver transacciones" />
              <MenuLink to="/create" label="Registrar nueva transacción" />
            </ul>
          </div>

          <div className="card large">
            <h3 className="card-title">Actividad reciente</h3>
            <MiniChart />
            <div className="info-grid">
              <InfoBox title="Transacciones hoy" value="53" />
              <InfoBox title="Nuevos usuarios" value="4" />
              <InfoBox title="Alertas" value="Sin novedades" />
            </div>
          </div>
        </div>

        <footer className="dashboard-footer">
          <p>© 2025 PicoBanco — Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

/* Subcomponentes */
function StatCard({ title, value, subtitle, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

function MenuLink({ to, label }) {
  return (
    <li>
      <Link to={to} className="menu-link">
        {label}
      </Link>
    </li>
  );
}

function MiniChart() {
  return (
    <div className="chart">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="chart-svg"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,30 L10,24 L20,18 L30,22 L40,14 L50,10 L60,16 L70,8 L80,12 L90,6 L100,10"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.6"
        />
        <polygon
          points="0,30 10,24 20,18 30,22 40,14 50,10 60,16 70,8 80,12 90,6 100,10 100,40 0,40"
          fill="url(#chartGradient)"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="info-box">
      <div className="info-title">{title}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}

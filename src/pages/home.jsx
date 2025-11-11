// src/pages/home.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A01:2021 Broken Access Control (IDOR): Permite acceso a cuentas ajenas manipulando localStorage
  - A02:2021 Cryptographic Failures: username y userId en localStorage sin cifrar
  - A07:2021 Identification and Authentication Failures: Confía en datos de localStorage manipulables
  - A08:2021 Software and Data Integrity Failures: Sin validación de datos del backend
  - A09:2021 Security Logging Failures: console.error expuesto, sin logging de accesos
*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";
import {
  getUserIdFromToken,
  detectIDOR,
  showIDORFlag,
} from "../utils/flagDetector.js";

export default function Home() {
  // VULNERABLE A02:2021 - Cryptographic Failures
  // VULNERABLE A07:2021 - Identification and Authentication Failures
  // username obtenido de localStorage sin cifrar
  // Puede ser manipulado desde consola del navegador
  // localStorage.setItem('username', '<script>alert("XSS")</script>')
  const username = localStorage.getItem("username") || "Usuario";
  const localUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    balance: 0,
    totalTransactions: 0,
    sentToday: 0,
    receivedToday: 0,
    pendingCount: 0,
  });
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idorFlag, setIdorFlag] = useState(null); // 🚩 NUEVO

  // 🚩 DETECTAR IDOR AL CARGAR
  useEffect(() => {
    const realUserId = getUserIdFromToken(token);
    if (detectIDOR(realUserId, localUserId)) {
      setIdorFlag(showIDORFlag(realUserId, localUserId, username));
    } else {
      setIdorFlag(null);
    }
  }, [token, localUserId, username]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // VULNERABLE A09:2021 - Security Logging Failures
  // No registra: acceso al dashboard, timestamp, userId, IP
  async function loadDashboardData() {
    setLoading(true);
    try {
      // VULNERABLE A02: userId de localStorage sin cifrar
      // VULNERABLE A07: Confía en localStorage para identificar usuario
      const userId = localStorage.getItem("userId");

      if (userId) {
        // VULNERABLE A08:2021 - Software and Data Integrity Failures
        // No valida que balanceRes tenga la estructura esperada
        // No verifica firma o checksum de los datos recibidos
        const balanceRes = await txService.getMyBalance();
        const txRes = await txService.getByUser(userId);
        const transactions = txRes.data || [];

        // VULNERABLE A08: No valida que transactions sea un array válido
        // No verifica que cada transacción tenga los campos requeridos
        const today = new Date().toISOString().split("T")[0];
        const sentToday = transactions.filter(
          (t) =>
            t.sender_user_id === parseInt(userId) &&
            t.created_at.startsWith(today)
        ).length;

        const receivedToday = transactions.filter(
          (t) =>
            t.receiver_user_id === parseInt(userId) &&
            t.created_at.startsWith(today)
        ).length;

        // VULNERABLE A02: Balance sensible almacenado en state sin cifrar
        // Visible en React DevTools
        setStats({
          balance: balanceRes.data?.balance || 0,
          totalTransactions: transactions.length,
          sentToday,
          receivedToday,
          pendingCount: 0,
        });

        // VULNERABLE A02: Almacena transacciones completas con datos sensibles
        setRecentTx(transactions.slice(0, 5));
      }
    } catch (err) {
      // VULNERABLE A09: console.error visible en producción
      // Expone detalles del error en consola del navegador
      console.error("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-6 animate-fadeIn">
        <header className="mb-10">
          {/* VULNERABLE A03:2021 - Injection (XSS Potencial) */}
          {/* Si username contiene HTML/JS, se renderiza sin sanitizar */}
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Bienvenido, {username}
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona tus transacciones desde tu panel personal.
          </p>
        </header>

        {/* 🚩 MOSTRAR FLAG IDOR SI EXISTE */}
        {idorFlag && (
          <div
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
              border: "2px solid #fca5a5",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px",
              boxShadow: "0 8px 30px rgba(220, 38, 38, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "36px" }}>🚩</span>
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {idorFlag.message}
              </h3>
            </div>
            <div
              style={{
                color: "#fecaca",
                fontSize: "14px",
                marginLeft: "48px",
              }}
            >
              <p style={{ margin: "6px 0" }}>
                <strong>Vulnerabilidad:</strong> {idorFlag.vulnerability}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Descripción:</strong> {idorFlag.description}
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Severidad:</strong> {idorFlag.severity}
              </p>
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "12px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                <p style={{ margin: "4px 0" }}>
                  <strong>🔓 Tu User ID real:</strong>{" "}
                  {idorFlag.details.realUserId}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>🎭 User ID suplantado:</strong>{" "}
                  {idorFlag.details.spoofedUserId}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>👤 Usuario víctima:</strong>{" "}
                  {idorFlag.details.username}
                </p>
                <p style={{ margin: "8px 0 0 0", color: "#fef3c7" }}>
                  <strong>⚠️ Impacto:</strong> {idorFlag.details.impact}
                </p>
              </div>
              <p
                style={{
                  margin: "12px 0 0 0",
                  fontSize: "13px",
                  color: "#fef3c7",
                  background: "rgba(254, 243, 199, 0.1)",
                  padding: "8px",
                  borderRadius: "6px",
                }}
              >
                💡 <strong>Cómo se explotó:</strong> Se manipuló
                localStorage.setItem('userId', '{idorFlag.details.spoofedUserId}
                ') para acceder a esta cuenta sin autorización
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* VULNERABLE A02:2021 - Cryptographic Failures */}
            {/* Expone información financiera sensible sin cifrar */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {/* VULNERABLE A02: Balance visible en texto plano en el DOM */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 rounded-xl p-5 shadow-md flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <h3 className="text-xs font-semibold uppercase">Saldo</h3>
                  <p className="text-3xl font-bold mt-1">
                    ${stats.balance.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs mt-2">Balance actual</p>
              </div>

              {/* VULNERABLE A02: Número total de transacciones expuesto */}
              <div className="bg-gradient-to-r from-green-400 to-emerald-300 text-gray-900 rounded-xl p-5 shadow-md flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <h3 className="text-xs font-semibold uppercase">
                    Transacciones
                  </h3>
                  <p className="text-3xl font-bold mt-1">
                    {stats.totalTransactions}
                  </p>
                </div>
                <p className="text-xs mt-2">Total realizadas</p>
              </div>

              {/* VULNERABLE A02: Movimientos del día expuestos */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-gray-900 rounded-xl p-5 shadow-md flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <h3 className="text-xs font-semibold uppercase">Hoy</h3>
                  <p className="text-3xl font-bold mt-1">
                    {stats.sentToday + stats.receivedToday}
                  </p>
                </div>
                <p className="text-xs mt-2">Movimientos del día</p>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 shadow-md">
                <h3 className="font-semibold text-blue-300 mb-4">
                  Accesos rápidos
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/create"
                      className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                    >
                      <span className="text-2xl">💸</span>
                      <div>
                        <p className="font-medium">Nueva transacción</p>
                        <p className="text-xs text-gray-400">Enviar dinero</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/transactions"
                      className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                    >
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-medium">Mis transacciones</p>
                        <p className="text-xs text-gray-400">Ver historial</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/savings"
                      className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                    >
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="font-medium">Ahorros</p>
                        <p className="text-xs text-gray-400">Mis sobres</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pay-services"
                      className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                    >
                      <span className="text-2xl">💳</span>
                      <div>
                        <p className="font-medium">Pagar servicios</p>
                        <p className="text-xs text-gray-400">
                          Luz, agua, internet
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                    >
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="font-medium">Mi perfil</p>
                        <p className="text-xs text-gray-400">Configuración</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-2 bg-white/5 rounded-xl p-5 border border-white/10 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-blue-300">
                    Transacciones recientes
                  </h3>
                  <Link
                    to="/transactions"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Ver todas →
                  </Link>
                </div>

                {recentTx.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-4xl mb-2">📭</p>
                    <p>No tienes transacciones aún</p>
                    <Link
                      to="/create"
                      className="text-blue-400 text-sm mt-2 inline-block"
                    >
                      Crear tu primera transacción
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTx.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                      >
                        <div className="flex items-center gap-3">
                          {/* VULNERABLE A07: userId de localStorage usado múltiples veces */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.sender_user_id ===
                              parseInt(localStorage.getItem("userId"))
                                ? "bg-red-500/20 text-red-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {tx.sender_user_id ===
                            parseInt(localStorage.getItem("userId"))
                              ? "↑"
                              : "↓"}
                          </div>
                          <div>
                            {/* VULNERABLE A02: Nombres de otros usuarios expuestos */}
                            <p className="font-medium text-sm">
                              {tx.sender_user_id ===
                              parseInt(localStorage.getItem("userId"))
                                ? `Enviado a ${tx.receiver}`
                                : `Recibido de ${tx.sender}`}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(tx.created_at).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* VULNERABLE A02: Montos exactos visibles en DOM */}
                          <p
                            className={`font-bold ${
                              tx.sender_user_id ===
                              parseInt(localStorage.getItem("userId"))
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {tx.sender_user_id ===
                            parseInt(localStorage.getItem("userId"))
                              ? "-"
                              : "+"}
                            ${parseFloat(tx.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* VULNERABLE A02: Estadísticas del día expuestas */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
                  <InfoBox
                    title="Enviadas hoy"
                    value={stats.sentToday}
                    color="red"
                  />
                  <InfoBox
                    title="Recibidas hoy"
                    value={stats.receivedToday}
                    color="green"
                  />
                  <InfoBox
                    title="Pendientes"
                    value={stats.pendingCount}
                    color="blue"
                  />
                </div>
              </div>
            </section>
          </>
        )}

        <footer className="text-center text-sm text-gray-500 mt-12 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

function InfoBox({ title, value, color = "blue" }) {
  const colorClasses = {
    red: "text-red-400",
    green: "text-green-400",
    blue: "text-blue-400",
  };

  return (
    <div className="p-4 bg-gray-900/40 border border-gray-700 rounded-lg text-center">
      <div className="text-xs text-gray-400">{title}</div>
      <div className={`text-xl font-semibold mt-1 ${colorClasses[color]}`}>
        {value}
      </div>
    </div>
  );
}

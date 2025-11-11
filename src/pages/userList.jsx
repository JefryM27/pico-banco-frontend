// src/pages/userList.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A01:2021 Broken Access Control: Sin validación de roles para CRUD de usuarios
  - A02:2021 Cryptographic Failures: Expone passwords hasheados en la UI
  - A05:2021 Security Misconfiguration: Sin paginación, carga todos los usuarios
  - A09:2021 Security Logging Failures: No registra accesos a datos sensibles
*/
import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as userService from "../services/user.service";
import "../index.css";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFlag, setShowFlag] = useState(false);

  async function load(q = "") {
    setErr(null);
    setLoading(true);
    try {
      const res = await userService.getAllUsers({ params: { q } });
      const userData = res.data || [];
      setUsers(userData);

      // 🚩 DETECTAR SI HAY PASSWORDS EXPUESTOS
      const hasPasswords = userData.some((user) => user.password);
      setShowFlag(hasPasswords);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("¿Eliminar usuario? Esta acción no se puede deshacer."))
      return;
    setErr(null);
    try {
      if (userService.deleteUser) {
        await userService.deleteUser(id);
      } else {
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/users/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
      }
      load(query);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || String(e));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Gestión de usuarios
          </h2>
          <p className="text-gray-400 text-sm">
            Lista de usuarios registrados en el sistema.
          </p>
        </header>

        {/* 🚩 FLAG DE SENSITIVE DATA EXPOSURE */}
        {showFlag && (
          <div
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              border: "2px solid #fcd34d",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 8px 30px rgba(245, 158, 11, 0.4)",
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
                ¡VULNERABILIDAD EXPLOTADA! Cryptographic Failures
              </h3>
            </div>
            <div
              style={{
                color: "#fef3c7",
                fontSize: "14px",
                marginLeft: "48px",
              }}
            >
              <p style={{ margin: "6px 0" }}>
                <strong>Vulnerabilidad:</strong> Cryptographic Failures -
                Sensitive Data Exposure (A02:2021)
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Descripción:</strong> Las contraseñas hasheadas con MD5
                están expuestas en la interfaz de usuario. MD5 es un algoritmo
                criptográficamente roto que facilita ataques de rainbow tables y
                fuerza bruta offline.
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Severidad:</strong> CRITICAL
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
                  <strong>⚠️ Impacto:</strong> Un atacante puede:
                </p>
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  <li>Copiar los hashes MD5 expuestos</li>
                  <li>
                    Usar herramientas como CrackStation.net para descifrarlos en
                    segundos
                  </li>
                  <li>
                    Realizar ataques de fuerza bruta offline sin límite de
                    intentos
                  </li>
                  <li>
                    Descubrir contraseñas débiles comunes (admin123, password,
                    123456)
                  </li>
                  <li>
                    Acceder a cuentas de otros usuarios con las contraseñas
                    crackeadas
                  </li>
                </ul>
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
                💡 <strong>Buena práctica:</strong> Usar bcrypt, Argon2 o scrypt
                con salt único por usuario. Nunca exponer hashes en la UI.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-md mb-6">
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar usuario..."
                className="w-64 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                onClick={() => load(query)}
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
              <button
                className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                onClick={() => {
                  setQuery("");
                  load();
                }}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>

            <div className="text-sm text-gray-400">
              {users.length} usuario{users.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl shadow-md overflow-hidden">
          {err && (
            <div className="p-4 bg-red-900/20 border-b border-red-800">
              <pre className="text-red-400 text-sm m-0">{String(err)}</pre>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-gray-400 font-medium p-4">
                    ID
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">
                    Nombre
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">
                    Email
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">
                    Rol
                  </th>
                  <th className="text-left text-xs font-medium p-4">
                    <span className="text-amber-400">⚠️ Contraseña (MD5)</span>
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 text-sm">{u.id}</td>
                      <td className="p-4 text-sm font-medium">{u.name}</td>
                      <td className="p-4 text-sm text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      {/* VULNERABLE A02:2021 - Cryptographic Failures */}
                      {/* Expone passwords hasheados con MD5 en la UI */}
                      <td className="p-4">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1 font-mono text-xs text-amber-400 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {u.password || "—"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-3 py-1 rounded text-sm transition"
                            onClick={() =>
                              (window.location.href = `/users/${u.id}`)
                            }
                          >
                            Ver
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition"
                            onClick={() => handleDelete(u.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

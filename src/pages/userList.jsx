// src/pages/userList.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as userService from "../services/user.service";
import "../index.css";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(q = "") {
    setErr(null);
    setLoading(true);
    try {
      const res = await userService.getAllUsers({ params: { q } });
      setUsers(res.data || []);
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
    if (!confirm("¿Eliminar usuario? Esta acción no se puede deshacer.")) return;
    setErr(null);
    try {
      // intenta usar el servicio; si no existe, lanzará error visible en consola
      if (userService.deleteUser) {
        await userService.deleteUser(id);
      } else {
        // fallback a fetch si el servicio no implementa deleteUser
        await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/users/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
      }
      // recargar lista
      load(query);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || String(e));
    }
  }

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Gestión de usuarios</h2>
            <p className="dashboard-subtitle">Lista de usuarios registrados en el sistema.</p>
          </div>
        </header>

        <div className="card" style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar usuario..."
                className="input"
                style={{ minWidth: 220 }}
              />
              <button className="btn-primary" onClick={() => load(query)} disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  setQuery("");
                  load();
                }}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>

            <div style={{ color: "#9ca3af", fontSize: 13 }}>
              {users.length} usuario{users.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="card">
          {err && (
            <div style={{ marginBottom: 12 }}>
              <pre style={{ color: "#ffb4b4", margin: 0 }}>{String(err)}</pre>
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#9ca3af", fontSize: 13 }}>
                  <th style={{ padding: "12px 16px" }}>ID</th>
                  <th style={{ padding: "12px 16px" }}>Usuario</th>
                  <th style={{ padding: "12px 16px" }}>Correo</th>
                  <th style={{ padding: "12px 16px" }}>Contraseña</th>
                  <th style={{ padding: "12px 16px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 20, color: "#cbd5e1" }}>
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>{u.id}</td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>{u.username}</td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>{u.email || "—"}</td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace" }}>
                        {u.password}
                      </td>
                      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                        <button className="btn-outline" onClick={() => (window.location.href = `/users/${u.id}`)} style={{ marginRight: 8 }}>
                          Ver
                        </button>
                        <button className="btn-primary" onClick={() => handleDelete(u.id)} style={{ background: "#ef4444", border: "none" }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="dashboard-footer" style={{ marginTop: 20 }}>
          <p>© 2025 PicoBanco — Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

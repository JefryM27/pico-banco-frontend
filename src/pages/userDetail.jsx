// src/pages/userDetail.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A01:2021 Broken Access Control: Cualquier usuario puede ver detalles de otros
  - A02:2021 Cryptographic Failures: Muestra hash MD5 del password
  - A09:2021 Security Logging Failures: No registra accesos a información sensible
*/
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import * as userService from "../services/user.service";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  // VULNERABLE A01:2021 - Broken Access Control
  // No verifica si el usuario tiene permisos para ver este perfil
  async function loadUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUserById(id);
      setUser(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
        <Header />
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg mb-4">
              {error || "Usuario no encontrado"}
            </p>
            <button
              onClick={() => navigate("/users")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/users")}
            className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2 text-sm"
          >
            ← Volver a usuarios
          </button>
        </div>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Detalles del Usuario
          </h2>
          <p className="text-gray-400 text-sm">
            Información completa del usuario #{user.id}
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-md">
          <div className="space-y-6">
            {/* ID */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                ID de Usuario
              </label>
              <div className="text-lg font-semibold">{user.id}</div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Nombre Completo
              </label>
              <div className="text-lg">{user.name}</div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="text-lg text-blue-400">{user.email}</div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Rol
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {user.role || "user"}
              </span>
            </div>

            {/* Número de cuenta */}
            {user.account_number && (
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Número de Cuenta
                </label>
                <div className="text-lg font-mono bg-gray-800 px-4 py-2 rounded border border-gray-700 inline-block">
                  {user.account_number}
                </div>
              </div>
            )}

            {/* VULNERABLE A02:2021 - Cryptographic Failures */}
            {/* Muestra el hash MD5 de la contraseña */}
            {user.password && (
              <div>
                <label className="block text-xs text-amber-400 mb-2 uppercase tracking-wide">
                  ⚠️ Contraseña (Hash MD5) - VULNERABLE
                </label>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="font-mono text-sm text-amber-400 break-all">
                    {user.password}
                  </div>
                  <p className="text-xs text-amber-300/70 mt-2">
                    Este hash MD5 puede ser crackeado usando herramientas como
                    CrackStation.net
                  </p>
                </div>
              </div>
            )}

            {/* Fecha de creación */}
            {user.created_at && (
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Fecha de Registro
                </label>
                <div className="text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate(`/users/${user.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition"
            >
              Editar Usuario
            </button>
            <button
              onClick={() => navigate("/users")}
              className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-lg transition"
            >
              Volver
            </button>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

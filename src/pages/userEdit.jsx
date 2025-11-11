// src/pages/userEdit.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A01:2021 Broken Access Control: Cualquier usuario puede editar otros usuarios y cambiar número de cuenta
  - A02:2021 Cryptographic Failures: Password hasheado con MD5 débil
  - A05:2021 Security Misconfiguration: Sin validación de password fuerte, permite cambiar número de cuenta
  - A09:2021 Security Logging Failures: No registra modificaciones
*/
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import * as userService from "../services/user.service";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    account_number: "", // ✅ NUEVO
  });

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {
    setLoading(true);
    try {
      const res = await userService.getUserById(id);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        password: "",
        role: res.data.role || "user",
        account_number: res.data.account_number || "", // ✅ CARGAR NÚMERO DE CUENTA
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // VULNERABLE A01:2021 - Broken Access Control
  // No verifica si el usuario tiene permisos para editar
  // VULNERABLE A09:2021 - Security Logging Failures
  // No registra quién modificó qué datos
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      // VULNERABLE A05: No valida complejidad de password
      // VULNERABLE A02: Password será hasheado con MD5 en el backend
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        account_number: formData.account_number, // ✅ ENVIAR NÚMERO DE CUENTA
      };

      // Solo enviar password si se modificó
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      await userService.updateUser(id, payload);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/users/${id}`);
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al actualizar usuario");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2 text-sm"
          >
            ← Volver a detalles
          </button>
        </div>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Editar Usuario
          </h2>
          <p className="text-gray-400 text-sm">
            Modifica la información del usuario #{id}
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-md">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">
                ✅ Usuario actualizado correctamente. Redirigiendo...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100"
              />
            </div>

            {/* ✅ NUEVO: Número de Cuenta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Número de Cuenta
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="CR1234567890123456"
                maxLength={18}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 font-mono"
              />
              <p className="text-xs text-amber-400 mt-2">
                ⚠️ VULNERABLE: Permite cambiar el número de cuenta manualmente
                (posible fraude)
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para no cambiar"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100"
              />
              <p className="text-xs text-amber-400 mt-2">
                ⚠️ VULNERABLE: La contraseña será hasheada con MD5 (inseguro)
              </p>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="text-xs text-amber-400 mt-2">
                ⚠️ VULNERABLE: Cualquier usuario puede cambiar roles (escalación
                de privilegios)
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/users/${id}`)}
                className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Header from "../components/header.jsx";
import api from "../hooks/useApi.js";

export default function Profile() {
  const [accountNumber, setAccountNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accountNum = localStorage.getItem("accountNumber");

      setAccountNumber(accountNum || "");

      if (userId) {
        const res = await api.get(`/users/${userId}`);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
        });
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const userId = localStorage.getItem("userId");
      await api.put(`/users/${userId}`, {
        name: formData.name,
        email: formData.email,
      });
      localStorage.setItem("username", formData.name);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Error al actualizar",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      setLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      await api.put(`/users/${userId}/password`, {
        password: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Contraseña actualizada" });
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Error al cambiar contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Mi Perfil</h2>
          <p className="text-gray-400 text-sm">Información de tu cuenta.</p>
        </header>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/50 text-green-400"
                : "bg-red-500/10 border border-red-500/50 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-md mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre Completo
              </label>
              <p className="text-lg text-white font-semibold">
                {formData.name || "Cargando..."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Correo Electrónico
              </label>
              <p className="text-lg text-white">
                {formData.email || "Cargando..."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Número de Cuenta
              </label>
              <p className="text-lg text-white font-mono font-semibold">
                {accountNumber || "No disponible"}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={updateProfile}
          className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-md mb-6"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-6">
            Editar Información Personal
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-400">Seguridad</h3>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-semibold transition"
            >
              {showPasswordForm ? "Cancelar" : "Cambiar Contraseña"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={changePassword} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Repite la contraseña"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-lg font-semibold transition"
              >
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
            </form>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

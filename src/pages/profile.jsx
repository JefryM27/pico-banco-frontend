import React, { useState } from "react";
import Header from "../components/header.jsx";

export default function Profile() {
  const [username] = useState(localStorage.getItem("username") || "Usuario");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Mi Perfil</h2>
          <p className="text-gray-400 text-sm">Información de tu cuenta.</p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Usuario
              </label>
              <p className="text-lg text-white">{username}</p>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}
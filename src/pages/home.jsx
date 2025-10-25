import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuario";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-6 animate-fadeIn">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Bienvenido, {username}
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona tus transacciones desde tu panel personal.
          </p>
        </header>

        {/* Tarjetas de resumen */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase">Saldo</h3>
              <p className="text-3xl font-bold mt-1">$0.00</p>
            </div>
            <p className="text-xs mt-2">Balance actual</p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-emerald-300 text-gray-900 rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase">Transacciones</h3>
              <p className="text-3xl font-bold mt-1">0</p>
            </div>
            <p className="text-xs mt-2">Operaciones realizadas</p>
          </div>

          <div className="bg-gradient-to-r from-blue-400 to-blue-300 text-gray-900 rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase">Estado</h3>
              <p className="text-3xl font-bold mt-1">Activo</p>
            </div>
            <p className="text-xs mt-2">Cuenta verificada</p>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 shadow-md">
            <h3 className="font-semibold text-blue-300 mb-4">
              Accesos rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/create"
                  className="block bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                >
                  💸 Nueva transacción
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  className="block bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                >
                  📊 Mis transacciones
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block bg-gray-800/50 hover:bg-gray-700 p-3 rounded-md transition border border-gray-700"
                >
                  👤 Mi perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Actividad reciente */}
          <div className="lg:col-span-2 bg-white/5 rounded-xl p-5 border border-white/10 shadow-md">
            <h3 className="font-semibold text-blue-300 mb-4">
              Actividad reciente
            </h3>
            <MiniChart />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <InfoBox title="Enviadas hoy" value="0" />
              <InfoBox title="Recibidas hoy" value="0" />
              <InfoBox title="Pendientes" value="0" />
            </div>
          </div>
        </section>

        <footer className="text-center text-sm text-gray-500 mt-12 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

/* ==== SUBCOMPONENTES ==== */
function MiniChart() {
  return (
    <div className="w-full h-40">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
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
    <div className="p-4 bg-gray-900/40 border border-gray-700 rounded-lg text-center">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="text-lg font-semibold text-gray-100 mt-1">{value}</div>
    </div>
  );
}
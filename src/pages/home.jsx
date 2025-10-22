import React from "react";
import { Link } from "react-router-dom";

/*
  Dashboard limpio y atractivo usando Tailwind.
  - tarjetas resumen
  - accesos rápidos a funcionalidades vulnerables (demo)
  - gráfico simple (SVG) para darle aspecto profesional sin librerías
*/

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">PicoBanco</h1>
            <p className="text-sm text-gray-500">Panel de administración — Demo de vulnerabilidades para la clase</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-md bg-white border text-sm">Cuenta</button>
            <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Cerrar sesión</button>
          </div>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Usuarios" value="12" subtitle="Incluye contraseñas (demo)" color="from-yellow-400 to-yellow-300" />
          <StatCard title="Transacciones" value="248" subtitle="Incluye descripciones (XSS posible)" color="from-green-400 to-green-300" />
          <StatCard title="Sistema" value="Vulnerable" subtitle="Modo: por defecto vulnerable" color="from-red-400 to-red-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: quick menu */}
          <div className="col-span-1 bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-3">Accesos rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/users" className="block p-2 rounded hover:bg-gray-50">Ver usuarios (exposición de contraseñas)</Link></li>
              <li><Link to="/transactions" className="block p-2 rounded hover:bg-gray-50">Ver transacciones (XSS)</Link></li>
              <li><Link to="/create" className="block p-2 rounded hover:bg-gray-50">Crear transacción (senderId editable)</Link></li>
              <li><Link to="/demo" className="block p-2 rounded hover:bg-gray-50">Security Demo (payloads)</Link></li>
            </ul>
          </div>

          {/* Center: gráfico */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-3">Actividad reciente</h3>
            <MiniChart />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoBox title="SQLi" value="Pruebas activas" />
              <InfoBox title="XSS" value="Payloads listos" />
              <InfoBox title="IDOR" value="Acceso abierto" />
            </div>
          </div>
        </div>

        {/* Footer / notes */}
        <div className="mt-6 text-sm text-gray-500">
          <p><strong>Nota:</strong> este dashboard está diseñado para fines educativos: el backend deliberadamente contiene vulnerabilidades OWASP para prácticas de explotación y mitigación. No utilices estas configuraciones en producción.</p>
        </div>
      </div>
    </div>
  );
}

/* Subcomponentes */
function StatCard({ title, value, subtitle, color = "from-indigo-400 to-indigo-300" }) {
  return (
    <div className={`rounded-xl p-4 shadow-md bg-gradient-to-r ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-700">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <div className="text-sm text-gray-700">{subtitle}</div>
      </div>
    </div>
  );
}

function MiniChart() {
  // SVG line chart (estético)
  return (
    <div className="w-full h-40">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M0,30 L10,24 L20,18 L30,22 L40,14 L50,10 L60,16 L70,8 L80,12 L90,6 L100,10" fill="none" stroke="#6366f1" strokeWidth="1.6" />
        <polygon points="0,30 10,24 20,18 30,22 40,14 50,10 60,16 70,8 80,12 90,6 100,10 100,40 0,40" fill="url(#g)" opacity="0.9" />
      </svg>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="p-3 border rounded-md">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="text-lg font-semibold text-gray-800">{value}</div>
    </div>
  );
}

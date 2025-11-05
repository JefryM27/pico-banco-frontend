// src/pages/servicePaymentsHistory.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as servicePaymentService from "../services/servicePayment.service";

const SERVICE_ICONS = {
  Electricidad: "⚡",
  Agua: "💧",
  Internet: "🌐",
  Teléfono: "📱",
  Gas: "🔥",
  "Cable TV": "📺",
};

const SERVICE_COLORS = {
  Electricidad: "from-yellow-400 to-orange-400",
  Agua: "from-blue-400 to-cyan-400",
  Internet: "from-purple-400 to-pink-400",
  Teléfono: "from-green-400 to-emerald-400",
  Gas: "from-red-400 to-orange-400",
  "Cable TV": "from-indigo-400 to-blue-400",
};

export default function ServicePaymentsHistory() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, selectedService, searchTerm, sortBy]);

  async function loadPayments() {
    setLoading(true);
    setError(null);
    try {
      const res = await servicePaymentService.getMyPayments();
      setPayments(res.data || []);
    } catch (err) {
      setError("Error al cargar pagos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let result = [...payments];

    // Filtrar por servicio
    if (selectedService !== "all") {
      result = result.filter((p) => p.service_name === selectedService);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.service_name.toLowerCase().includes(term) ||
          p.service_provider.toLowerCase().includes(term) ||
          p.account_number.toLowerCase().includes(term) ||
          p.reference?.toLowerCase().includes(term)
      );
    }

    // Ordenar
    if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "amount-desc") {
      result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (sortBy === "amount-asc") {
      result.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    }

    setFilteredPayments(result);
  }

  function clearFilters() {
    setSelectedService("all");
    setSearchTerm("");
    setSortBy("date-desc");
  }

  // Obtener servicios únicos
  const uniqueServices = [...new Set(payments.map((p) => p.service_name))];

  // Estadísticas
  const stats = {
    total: filteredPayments.length,
    totalAmount: filteredPayments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    ),
    thisMonth: filteredPayments.filter((p) => {
      const date = new Date(p.created_at);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Historial de Pagos de Servicios
          </h2>
          <p className="text-gray-400 text-sm">
            Consulta todos los pagos de servicios que has realizado.
          </p>
        </header>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Total de Pagos" value={stats.total} color="blue" />
          <StatCard
            title="Monto Total"
            value={`$${stats.totalAmount.toFixed(2)}`}
            color="green"
          />
          <StatCard title="Este Mes" value={stats.thisMonth} color="purple" />
        </div>

        {/* Filtros */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Buscar</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Servicio, cuenta, referencia..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            {/* Filtro por servicio */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Servicio
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <option value="all">Todos</option>
                {uniqueServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <option value="date-desc">Más reciente</option>
                <option value="date-asc">Más antiguo</option>
                <option value="amount-desc">Mayor monto</option>
                <option value="amount-asc">Menor monto</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Limpiar filtros
            </button>
            <div className="text-sm text-gray-400">
              Mostrando {filteredPayments.length} de {payments.length} pagos
            </div>
          </div>
        </div>

        {/* Lista de pagos */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Cargando pagos...</p>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg border border-red-800">
              {error}
            </div>
          )}

          {!loading && !error && filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">💳</p>
              <p className="text-gray-400 mb-2">No se encontraron pagos</p>
              <p className="text-sm text-gray-500">
                {payments.length === 0
                  ? "Aún no has realizado pagos de servicios"
                  : "Intenta ajustar los filtros"}
              </p>
            </div>
          )}

          {!loading && filteredPayments.length > 0 && (
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className={`${colors[color]} rounded-xl p-5`}>
      <p className="text-xs opacity-80 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function PaymentCard({ payment }) {
  const icon = SERVICE_ICONS[payment.service_name] || "💳";
  const color =
    SERVICE_COLORS[payment.service_name] || "from-gray-400 to-gray-500";
  const date = new Date(payment.created_at);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          {/* Icono */}
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-2xl flex-shrink-0`}
          >
            {icon}
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-lg">{payment.service_name}</p>
                <p className="text-xs text-gray-400">
                  {payment.service_provider}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <span className="text-gray-400">Cuenta:</span>
                <p className="font-medium">{payment.account_number}</p>
              </div>
              {payment.reference && (
                <div>
                  <span className="text-gray-400">Referencia:</span>
                  <p className="font-medium">{payment.reference}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400">
              {date.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {payment.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                {payment.description}
              </p>
            )}
          </div>
        </div>

        {/* Monto */}
        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-red-400">
            -${parseFloat(payment.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">ID: {payment.id}</p>
        </div>
      </div>
    </div>
  );
}

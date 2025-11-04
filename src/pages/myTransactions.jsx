import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";

export default function MyTransactions() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTx, setFilteredTx] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allTransactions, searchTerm, filterType, filterDate, sortBy]);

  async function loadTransactions() {
    setLoading(true);
    setError(null);
    try {
      if (!userId) {
        setError("No se pudo identificar el usuario");
        return;
      }

      const res = await txService.getByUser(userId);
      const myTransactions = (res.data || []).filter(
        (tx) => tx.sender_user_id === userId || tx.receiver_user_id === userId
      );
      setAllTransactions(myTransactions);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar transacciones");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let result = [...allTransactions];

    if (filterType === "sent") {
      result = result.filter((tx) => tx.sender_user_id === userId);
    } else if (filterType === "received") {
      result = result.filter((tx) => tx.receiver_user_id === userId);
    }

    const now = new Date();
    if (filterDate === "today") {
      result = result.filter((tx) => {
        const txDate = new Date(tx.created_at);
        return txDate.toDateString() === now.toDateString();
      });
    } else if (filterDate === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((tx) => new Date(tx.created_at) >= weekAgo);
    } else if (filterDate === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter((tx) => new Date(tx.created_at) >= monthAgo);
    } else if (filterDate === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      result = result.filter((tx) => new Date(tx.created_at) >= yearAgo);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description?.toLowerCase().includes(term) ||
          tx.sender?.toLowerCase().includes(term) ||
          tx.receiver?.toLowerCase().includes(term) ||
          tx.amount.toString().includes(term)
      );
    }

    if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "amount-desc") {
      result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (sortBy === "amount-asc") {
      result.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    }

    setFilteredTx(result);
  }

  function clearFilters() {
    setSearchTerm("");
    setFilterType("all");
    setFilterDate("all");
    setSortBy("date-desc");
  }

  const stats = {
    total: filteredTx.length,
    sent: filteredTx.filter((tx) => tx.sender_user_id === userId).length,
    received: filteredTx.filter((tx) => tx.receiver_user_id === userId).length,
    totalAmount: filteredTx.reduce((sum, tx) => {
      if (tx.sender_user_id === userId) return sum - parseFloat(tx.amount);
      return sum + parseFloat(tx.amount);
    }, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Mis Transacciones
          </h2>
          <p className="text-gray-400 text-sm">
            Historial completo de tus transacciones realizadas.
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Buscar</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Descripción, usuario, monto..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <option value="all">Todas</option>
                <option value="sent">Enviadas</option>
                <option value="received">Recibidas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Período
              </label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <option value="all">Todo el tiempo</option>
                <option value="today">Hoy</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
            </div>

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
                <option value="date-asc">Más antigua</option>
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
              Mostrando {filteredTx.length} de {allTransactions.length}{" "}
              transacciones
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total"
            value={stats.total}
            color="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            title="Enviadas"
            value={stats.sent}
            color="bg-red-500/20 text-red-400"
          />
          <StatCard
            title="Recibidas"
            value={stats.received}
            color="bg-green-500/20 text-green-400"
          />
          <StatCard
            title="Balance"
            value={`$${stats.totalAmount.toFixed(2)}`}
            color={
              stats.totalAmount >= 0
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Cargando transacciones...</p>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg border border-red-800">
              {error}
            </div>
          )}

          {!loading && !error && filteredTx.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400 mb-2">
                No se encontraron transacciones
              </p>
              <p className="text-sm text-gray-500">
                Intenta ajustar los filtros
              </p>
            </div>
          )}

          {!loading && filteredTx.length > 0 && (
            <div className="space-y-3">
              {filteredTx.map((tx) => (
                <TransactionCard key={tx.id} tx={tx} userId={userId} />
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
  return (
    <div className={`${color} rounded-lg p-4 text-center`}>
      <p className="text-xs opacity-80 mb-1">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function TransactionCard({ tx, userId }) {
  const isSent = tx.sender_user_id === userId;
  const otherUser = isSent ? tx.receiver : tx.sender;
  const date = new Date(tx.created_at);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
              isSent
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {isSent ? "↑" : "↓"}
          </div>

          <div className="flex-1">
            <p className="font-medium">
              {isSent ? `Enviado a ${otherUser}` : `Recibido de ${otherUser}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {date.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {tx.description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {tx.description}
              </p>
            )}
          </div>
        </div>

        <div className="text-right ml-4">
          <p
            className={`text-xl font-bold ${isSent ? "text-red-400" : "text-green-400"}`}
          >
            {isSent ? "-" : "+"}${parseFloat(tx.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">ID: {tx.id}</p>
        </div>
      </div>
    </div>
  );
}

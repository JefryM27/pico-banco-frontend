// src/pages/savings.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as savingsService from "../services/savings.service";
import { Link } from "react-router-dom";

export default function Savings() {
  const [envelopes, setEnvelopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEnvelope, setNewEnvelope] = useState({
    name: "",
    description: "",
    goalAmount: "",
  });

  useEffect(() => {
    loadEnvelopes();
  }, []);

  async function loadEnvelopes() {
    setLoading(true);
    try {
      const res = await savingsService.getMyEnvelopes();
      setEnvelopes(res.data || []);
    } catch (err) {
      console.error("Error cargando sobres:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await savingsService.createEnvelope({
        name: newEnvelope.name,
        description: newEnvelope.description,
        goalAmount: newEnvelope.goalAmount
          ? parseFloat(newEnvelope.goalAmount)
          : null,
      });
      setShowModal(false);
      setNewEnvelope({ name: "", description: "", goalAmount: "" });
      loadEnvelopes();
    } catch (err) {
      alert(
        "Error al crear sobre: " + (err.response?.data?.error || err.message)
      );
    }
  }

  const totalSaved = envelopes.reduce(
    (sum, env) => sum + parseFloat(env.balance || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-6">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-400 mb-2">
              Mis Ahorros
            </h2>
            <p className="text-gray-400 text-sm">
              Administra tus sobres de ahorro
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            + Crear Sobre
          </button>
        </header>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Ahorrado"
            value={`$${totalSaved.toFixed(2)}`}
            color="green"
          />
          <StatCard
            title="Sobres Activos"
            value={envelopes.length}
            color="blue"
          />
          <StatCard
            title="Meta Promedio"
            value={`$${(envelopes.reduce((sum, e) => sum + parseFloat(e.goal_amount || 0), 0) / (envelopes.length || 1)).toFixed(2)}`}
            color="yellow"
          />
        </div>

        {/* Lista de sobres */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : envelopes.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <p className="text-4xl mb-4">💰</p>
            <p className="text-gray-400 mb-4">No tienes sobres de ahorro aún</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              Crear tu primer sobre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {envelopes.map((envelope) => (
              <EnvelopeCard
                key={envelope.id}
                envelope={envelope}
                onUpdate={loadEnvelopes}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Crear Sobre */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-blue-500/50 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Crear Nuevo Sobre
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nombre del Sobre *
                </label>
                <input
                  type="text"
                  value={newEnvelope.name}
                  onChange={(e) =>
                    setNewEnvelope({ ...newEnvelope, name: e.target.value })
                  }
                  placeholder="Ej: Vacaciones"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newEnvelope.description}
                  onChange={(e) =>
                    setNewEnvelope({
                      ...newEnvelope,
                      description: e.target.value,
                    })
                  }
                  placeholder="Para qué es este ahorro..."
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Meta (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newEnvelope.goalAmount}
                  onChange={(e) =>
                    setNewEnvelope({
                      ...newEnvelope,
                      goalAmount: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-600 text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold transition"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className={`${colors[color]} rounded-xl p-5`}>
      <p className="text-xs opacity-80 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function EnvelopeCard({ envelope, onUpdate }) {
  const progress = envelope.goal_amount
    ? (parseFloat(envelope.balance) / parseFloat(envelope.goal_amount)) * 100
    : 0;

  return (
    <Link
      to={`/savings/${envelope.id}`}
      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition block no-underline"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white">{envelope.name}</h3>
        <span className="text-2xl">💰</span>
      </div>
      {envelope.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {envelope.description}
        </p>
      )}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Balance</span>
          <span className="text-green-400 font-bold">
            ${parseFloat(envelope.balance).toFixed(2)}
          </span>
        </div>
        {envelope.goal_amount && (
          <>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progress.toFixed(0)}% de meta</span>
              <span>${parseFloat(envelope.goal_amount).toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

// src/pages/savingsDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import * as savingsService from "../services/savings.service";

export default function SavingsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [envelope, setEnvelope] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    goalAmount: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const [envelopeRes, movementsRes] = await Promise.all([
        savingsService.getEnvelope(id),
        savingsService.getMovements(id),
      ]);
      setEnvelope(envelopeRes.data);
      setMovements(movementsRes.data || []);
      setEditData({
        name: envelopeRes.data.name,
        description: envelopeRes.data.description || "",
        goalAmount: envelopeRes.data.goal_amount || "",
      });
    } catch (err) {
      console.error("Error cargando datos:", err);
      alert("Error al cargar el sobre");
      navigate("/savings");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit(e) {
    e.preventDefault();
    try {
      await savingsService.deposit({
        envelopeId: id,
        amount: parseFloat(amount),
        description: description,
      });
      setShowDepositModal(false);
      setAmount("");
      setDescription("");
      loadData();
    } catch (err) {
      alert(
        "Error al depositar: " + (err.response?.data?.error || err.message)
      );
    }
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    try {
      await savingsService.withdraw({
        envelopeId: id,
        amount: parseFloat(amount),
        description: description,
      });
      setShowWithdrawModal(false);
      setAmount("");
      setDescription("");
      loadData();
    } catch (err) {
      alert("Error al retirar: " + (err.response?.data?.error || err.message));
    }
  }

  async function handleWithdrawAll() {
    if (
      !confirm(
        `¿Retirar todo el dinero ($${parseFloat(envelope.balance).toFixed(2)}) del sobre?`
      )
    )
      return;
    try {
      await savingsService.withdraw({
        envelopeId: id,
        amount: parseFloat(envelope.balance),
        description: "Retiro total",
      });
      loadData();
    } catch (err) {
      alert("Error al retirar: " + (err.response?.data?.error || err.message));
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    try {
      await savingsService.updateEnvelope(id, {
        name: editData.name,
        description: editData.description,
        goalAmount: editData.goalAmount
          ? parseFloat(editData.goalAmount)
          : null,
      });
      setShowEditModal(false);
      loadData();
    } catch (err) {
      alert(
        "Error al actualizar: " + (err.response?.data?.error || err.message)
      );
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "¿Eliminar este sobre? El dinero será devuelto a tu cuenta principal."
      )
    )
      return;
    try {
      await savingsService.deleteEnvelope(id);
      navigate("/savings");
    } catch (err) {
      alert("Error al eliminar: " + (err.response?.data?.error || err.message));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
        <Header />
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!envelope) return null;

  const progress = envelope.goal_amount
    ? (parseFloat(envelope.balance) / parseFloat(envelope.goal_amount)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-5xl mx-auto px-8 py-6">
        <button
          onClick={() => navigate("/savings")}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2"
        >
          ← Volver a Ahorros
        </button>

        {/* Cabecera del sobre */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {envelope.name}
              </h2>
              {envelope.description && (
                <p className="text-gray-400">{envelope.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                ✏️ Editar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>

          {/* Balance y Meta */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Balance Actual</span>
              {envelope.goal_amount && (
                <span className="text-sm text-gray-400">
                  Meta: ${parseFloat(envelope.goal_amount).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-4xl font-bold text-green-400 mb-4">
              ${parseFloat(envelope.balance).toFixed(2)}
            </p>
            {envelope.goal_amount && (
              <>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{progress.toFixed(1)}% completado</span>
                  <span>
                    Faltan: $
                    {Math.max(
                      0,
                      parseFloat(envelope.goal_amount) -
                        parseFloat(envelope.balance)
                    ).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
              💰 Depositar
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
              💵 Retirar
            </button>
            <button
              onClick={handleWithdrawAll}
              disabled={parseFloat(envelope.balance) === 0}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🏦 Retirar Todo
            </button>
          </div>
        </div>

        {/* Historial de Movimientos */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-400 mb-4">
            Historial de Movimientos
          </h3>

          {movements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p>No hay movimientos aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <MovementCard key={movement.id} movement={movement} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Depositar */}
      {showDepositModal && (
        <Modal
          title="Depositar Dinero"
          onClose={() => setShowDepositModal(false)}
        >
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Monto a depositar *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional..."
                rows="3"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 border border-gray-600 text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold transition"
              >
                Depositar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Retirar */}
      {showWithdrawModal && (
        <Modal
          title="Retirar Dinero"
          onClose={() => setShowWithdrawModal(false)}
        >
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Monto a retirar *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                max={parseFloat(envelope.balance)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Disponible: ${parseFloat(envelope.balance).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional..."
                rows="3"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 border border-gray-600 text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg px-4 py-2 font-semibold transition"
              >
                Retirar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Editar */}
      {showEditModal && (
        <Modal title="Editar Sobre" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Descripción
              </label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Meta</label>
              <input
                type="number"
                step="0.01"
                value={editData.goalAmount}
                onChange={(e) =>
                  setEditData({ ...editData, goalAmount: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 border border-gray-600 text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-blue-500/50 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-400">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MovementCard({ movement }) {
  const isDeposit = movement.type === "deposit";
  const date = new Date(movement.created_at);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDeposit
              ? "bg-green-500/20 text-green-400"
              : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {isDeposit ? "+" : "-"}
        </div>
        <div>
          <p className="font-medium">{isDeposit ? "Depósito" : "Retiro"}</p>
          <p className="text-xs text-gray-400">
            {date.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {movement.description && (
            <p className="text-sm text-gray-500 mt-1">{movement.description}</p>
          )}
        </div>
      </div>
      <p
        className={`text-lg font-bold ${isDeposit ? "text-green-400" : "text-orange-400"}`}
      >
        {isDeposit ? "+" : "-"}${parseFloat(movement.amount).toFixed(2)}
      </p>
    </div>
  );
}

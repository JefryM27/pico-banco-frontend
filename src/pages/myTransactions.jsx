import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service.js";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadTransactions() {
    setLoading(true);
    setError(null);
    try {
      // Obtener userId del localStorage o del token
      const userId = localStorage.getItem("userId"); // Asegúrate de guardar esto al login
      
      if (!userId) {
        setError("No se pudo identificar el usuario");
        return;
      }

      const res = await txService.getByUser(userId);
      setTransactions(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar transacciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Mis Transacciones
          </h2>
          <p className="text-gray-400 text-sm">
            Historial de tus transacciones realizadas.
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          {loading && (
            <p className="text-center text-gray-400">Cargando transacciones...</p>
          )}
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg border border-red-800">
              {error}
            </div>
          )}

          {!loading && !error && transactions.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No tienes transacciones registradas.
            </p>
          )}

          {!loading && transactions.length > 0 && (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-400">
                        {tx.sender === localStorage.getItem("username") ? (
                          <span className="text-red-400">Enviado a: {tx.receiver}</span>
                        ) : (
                          <span className="text-green-400">Recibido de: {tx.sender}</span>
                        )}
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        ${tx.amount}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {tx.description && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-sm text-gray-300">{tx.description}</p>
                    </div>
                  )}
                </div>
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
import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";
import TransactionCard from "../components/transactionCard.jsx";
import "../index.css";

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadTransactions() {
    setLoading(true);
    setError(null);
    try {
      const res = await txService.getAll();
      setTxs(res.data || []);
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
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Transacciones</h2>
            <p className="dashboard-subtitle">
              Consulta el historial de transacciones registradas.
            </p>
          </div>
        </header>

        <div className="card">
          {loading && <p>Cargando transacciones...</p>}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {!loading && !error && txs.length === 0 && (
            <p>No se encontraron transacciones.</p>
          )}

          {!loading && txs.length > 0 && (
            <div className="transaction-list">
              {txs.map((t) => (
                <TransactionCard key={t.id} transaction={t} />
              ))}
            </div>
          )}
        </div>

        <footer className="dashboard-footer">
          <p>© 2025 PicoBanco — Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

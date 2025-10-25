import React, { useState } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";

function stripScriptTags(html = "") {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

function escapeHtml(html = "") {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function CreateTransaction() {
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorFields, setErrorFields] = useState({});

  function validate() {
    const errors = {};
    if (!senderId?.trim()) errors.senderId = "Sender ID requerido";
    if (!receiverId?.trim()) errors.receiverId = "Receiver ID requerido";
    if (!amount?.toString().trim()) errors.amount = "Monto requerido";
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      errors.amount = "El monto debe ser un número positivo";
    return errors;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const errors = validate();
    setErrorFields(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await txService.create({
        senderId: senderId.trim(),
        receiverId: receiverId.trim(),
        amount: Number(amount),
        description: description,
      });
      setMsg({ type: "success", text: "Transacción creada correctamente." });
      setSenderId("");
      setReceiverId("");
      setAmount("");
      setDescription("");
      setErrorFields({});
    } catch (err) {
      const detail = err?.response?.data?.message || err?.message || String(err);
      setMsg({ type: "error", text: "Error creando transacción: " + detail });
    } finally {
      setLoading(false);
    }
  }

  const sanitized = stripScriptTags(description || "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Nueva Transacción</h2>
          <p className="text-gray-400 text-sm">
            Completa los campos para registrar una nueva transacción.
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sender ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                placeholder="ID de la cuenta origen"
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errorFields.senderId ? "border-red-500" : "border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100`}
              />
              {errorFields.senderId && (
                <p className="text-red-400 text-xs mt-1">{errorFields.senderId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Receiver ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="ID de la cuenta destino"
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errorFields.receiverId ? "border-red-500" : "border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100`}
              />
              {errorFields.receiverId && (
                <p className="text-red-400 text-xs mt-1">{errorFields.receiverId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monto <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monto (ej: 100.50)"
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errorFields.amount ? "border-red-500" : "border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100`}
              />
              {errorFields.amount && (
                <p className="text-red-400 text-xs mt-1">{errorFields.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la transacción"
                rows="4"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 resize-none"
              />
              <p className="text-gray-500 text-xs mt-1">
                Se permite HTML básico (sin scripts)
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
              >
                Vista previa
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Crear Transacción"}
              </button>
            </div>
          </form>

          {msg && (
            <div
              className={`mt-6 p-4 rounded-lg text-center ${
                msg.type === "error"
                  ? "bg-red-900/20 text-red-400 border border-red-800"
                  : "bg-green-900/20 text-green-400 border border-green-800"
              }`}
            >
              {msg.text}
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>

      {/* Modal de vista previa */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-blue-500/50 rounded-xl shadow-2xl w-full max-w-2xl animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-blue-400">
                Vista previa de descripción
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[150px] max-h-[400px] overflow-auto">
                {sanitized ? (
                  <div
                    className="text-gray-200 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitized }}
                  />
                ) : (
                  <p className="text-gray-500 italic">Sin contenido para mostrar</p>
                )}
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <strong>Nota:</strong> Los scripts han sido eliminados por seguridad
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
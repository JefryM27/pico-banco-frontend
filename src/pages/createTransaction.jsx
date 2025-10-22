// src/pages/CreateTransaction.jsx
import React, { useState } from "react";
import * as txService from "../services/transaction.service";

/**
 * CreateTransaction.jsx
 * - versión mejorada y funcional del formulario de creación de transacciones
 * - usa estilos desde src/index.css (clases CSS simples, no Tailwind)
 * - incluye opción de "Preview HTML" para demostrar la diferencia entre renderizar
 *   HTML sin filtrar (vulnerable) y una vista escapada (más segura)
 *
 * Nota: txService.create(...) debe estar implementado en ../services/transaction.service
 * y devolver una Promise que resuelve cuando la creación es exitosa.
 */

function stripScriptTags(html = "") {
  // eliminación simple de etiquetas <script> y su contenido (no es un sanitizer completo,
  // pero previene el caso más obvio). Para producción use DOMPurify u otro sanitizer.
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

function escapeHtml(html = "") {
  // Escapa caracteres especiales para mostrar HTML como texto
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
  const [description, setDescription] = useState("<b>test</b>"); // texto por defecto con HTML
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allowHtmlPreview, setAllowHtmlPreview] = useState(false); // controla preview vulnerable
  const [errorFields, setErrorFields] = useState({});

  function validate() {
    const errors = {};
    if (!senderId?.trim()) errors.senderId = "Sender ID required";
    if (!receiverId?.trim()) errors.receiverId = "Receiver ID required";
    if (!amount?.toString().trim()) errors.amount = "Amount required";
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      errors.amount = "Amount must be a positive number";
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
      // Nota: aquí se envía description tal cual (demostración de vulnerabilidad).
      // En un sistema real deberías validar/sanitizar en el servidor.
      await txService.create({
        senderId: senderId.trim(),
        receiverId: receiverId.trim(),
        amount: Number(amount),
        description: description,
      });
      setMsg({ type: "success", text: "Transacción creada correctamente." });
      // limpiar campos salvo sender para conveniencia
      setReceiverId("");
      setAmount("");
      setDescription("<b>test</b>");
      setErrorFields({});
    } catch (err) {
      // intenta mostrar mensaje útil
      const detail =
        err?.response?.data?.message || err?.message || String(err);
      setMsg({ type: "error", text: "Error creando transacción: " + detail });
    } finally {
      setLoading(false);
    }
  }

  // Preview seguro (quitar <script> y luego decidir si renderizar HTML o escaped)
  const sanitized = stripScriptTags(description || "");

  return (
    <div className="pg-container">
      <div className="card">
        <h2 className="title">Crear Transacción</h2>
        <p className="subtitle">
          Formulario (demo educativo). Algunos campos están deliberadamente
          vulnerables.
        </p>

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Sender ID (editable)
            <input
              className={`input ${errorFields.senderId ? "input-error" : ""}`}
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="senderId (editable)"
            />
            {errorFields.senderId && (
              <div className="field-error">{errorFields.senderId}</div>
            )}
          </label>

          <label className="label">
            Receiver ID
            <input
              className={`input ${errorFields.receiverId ? "input-error" : ""}`}
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="receiverId"
            />
            {errorFields.receiverId && (
              <div className="field-error">{errorFields.receiverId}</div>
            )}
          </label>

          <label className="label">
            Amount
            <input
              className={`input ${errorFields.amount ? "input-error" : ""}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="amount (ej: 100.50)"
            />
            {errorFields.amount && (
              <div className="field-error">{errorFields.amount}</div>
            )}
          </label>

          <label className="label">
            Description (HTML permitido en demo)
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description (HTML allowed)"
            />
          </label>

          <div className="row-between">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowHtmlPreview}
                onChange={(e) => setAllowHtmlPreview(e.target.checked)}
              />{" "}
              Mostrar preview con HTML (vulnerable)
            </label>

            <button className="btn-primary" type="submit" disabled={loading}>
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
        <h3 className="title-sm">Preview de description</h3>

        {/* Zona segura: se eliminan <script> */}
        {!allowHtmlPreview ? (
          <pre
            className="safe-preview"
            dangerouslySetInnerHTML={{ __html: escapeHtml(sanitized) }}
          />
        ) : (
          // Zona vulnerable: renderiza HTML (incluye bold, tags, y potencialmente XSS si el servidor/cliente no lo evita)
          <div
            className="unsafe-preview"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        )}

        <div className="helper">
          <strong>Nota:</strong> el preview elimina etiquetas &lt;script&gt;
          básicas. El modo con HTML activado demuestra cómo un campo de
          descripción sin filtrar puede introducir contenido activo.
        </div>
      </aside>
    </div>
  );
}

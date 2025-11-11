// src/pages/userDetail.jsx
/*
  VULNERABILIDADES IMPLEMENTADAS:
  - A01:2021 Broken Access Control: Cualquier usuario puede ver detalles de otros
  - A02:2021 Cryptographic Failures: Muestra hash MD5 y permite descifrarlo en tiempo real
  - A09:2021 Security Logging Failures: No registra accesos a información sensible
*/
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";
import * as userService from "../services/user.service";

// VULNERABLE A02:2021 - Cryptographic Failures (CRÍTICO)
// Diccionario de hashes MD5 pre-computados con salt "pico_salt_2025"
// Permite "descifrar" contraseñas comunes en tiempo real
const MD5_RAINBOW_TABLE = {
  "7c6a180b36896a0a8c02787eeafb0e4c": "admin123",
  "286755fad04869ca523320acce0dc6a4": "password",
  e10adc3949ba59abbe56e057f20f883e: "123456",
  "25d55ad283aa400af464c76d713c07ad": "12345678",
  "5f4dcc3b5aa765d61d8327deb882cf99": "password",
  "96e79218965eb72c92a549dd5a330112": "qwerty",
  fcea920f7412b5da7be0cf42b8c93759: "1234567890",
  "5d41402abc4b2a76b9719d911017c592": "hello",
  "8621ffdbc5698829397d97767ac13db3": "admin",
  "21232f297a57a5a743894a0e4a801fc3": "admin",
  c20ad4d76fe97759aa27a0c99bff6710: "12345",
  "827ccb0eea8a706c4c34a16891f84e7b": "12345",
  "202cb962ac59075b964b07152d234b70": "123",
  e99a18c428cb38d5f260853678922e03: "abc123",
  "5f4dcc3b5aa765d61d8327deb882cf99": "password",
  "482c811da5d5b4bc6d497ffa98491e38": "password123",
  a3dcb4d229de6fde0db5686dee47145d: "guest",
  ceb4f32325eda6142bd65215f4c0f371: "welcome",
  "098f6bcd4621d373cade4e832627b4f6": "test",
  "5a105e8b9d40e1329780d62ea2265d8a": "root",
  "63a9f0ea7bb98050796b649e85481845": "root",
  b59c67bf196a4758191e42f76670ceba: "letmein",
  b3d6c9d058c57dc4d6a5e22a6d36d3f3: "monkey",
  "1a1dc91c907325c69271ddf0c944bc72": "pass",
  "1a79a4d60de6718e8e5b326e338ae533": "example",
  "5ebe2294ecd0e0f08eab7690d2a6ee69": "secret",
  "2c9341ca4cf3d87b9e4eb905d6a3ec45": "iloveyou",
  "3f02ebe3d7929b091e3d8ccfde2f3bc6": "trustno1",
  fc5e038d38a57032085441e7fe7010b0: "hello",
};

// Función para intentar crackear el hash MD5
function crackMD5(hash) {
  return MD5_RAINBOW_TABLE[hash] || null;
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crackedPassword, setCrackedPassword] = useState(null);
  const [cracking, setCracking] = useState(false);
  const [showCrackFlag, setShowCrackFlag] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  // VULNERABLE A01:2021 - Broken Access Control
  // No verifica si el usuario tiene permisos para ver este perfil
  async function loadUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUserById(id);
      setUser(res.data);

      // Auto-crackear al cargar (opcional)
      // if (res.data.password) {
      //   attemptCrack(res.data.password);
      // }
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  }

  // VULNERABLE A02: Función para "crackear" el hash MD5
  function attemptCrack(hash) {
    setCracking(true);
    setShowCrackFlag(false);

    // Simular tiempo de crackeo (dramático para la demo)
    setTimeout(() => {
      const plaintext = crackMD5(hash);
      setCrackedPassword(plaintext);
      setCracking(false);
      if (plaintext) {
        setShowCrackFlag(true);
      }
    }, 1500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
        <Header />
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg mb-4">
              {error || "Usuario no encontrado"}
            </p>
            <button
              onClick={() => navigate("/users")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#08101a] text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/users")}
            className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2 text-sm"
          >
            ← Volver a usuarios
          </button>
        </div>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">
            Detalles del Usuario
          </h2>
          <p className="text-gray-400 text-sm">
            Información completa del usuario #{user.id}
          </p>
        </header>

        {/* 🚩 FLAG DE CRACKEO EXITOSO */}
        {showCrackFlag && (
          <div
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
              border: "2px solid #fca5a5",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 8px 30px rgba(220, 38, 38, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "36px" }}>🚩</span>
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ¡VULNERABILIDAD EXPLOTADA! Hash MD5 Crackeado
              </h3>
            </div>
            <div
              style={{
                color: "#fecaca",
                fontSize: "14px",
                marginLeft: "48px",
              }}
            >
              <p style={{ margin: "6px 0" }}>
                <strong>Vulnerabilidad:</strong> Cryptographic Failures - Weak
                Hash Algorithm (A02:2021)
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Descripción:</strong> El hash MD5 fue crackeado
                exitosamente usando una rainbow table, revelando la contraseña
                en texto plano.
              </p>
              <p style={{ margin: "6px 0" }}>
                <strong>Severidad:</strong> CRITICAL
              </p>
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "12px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                <p style={{ margin: "4px 0" }}>
                  <strong>🔓 Contraseña descifrada:</strong>{" "}
                  <span style={{ color: "#fef3c7", fontSize: "16px" }}>
                    {crackedPassword}
                  </span>
                </p>
                <p style={{ margin: "8px 0 0 0", color: "#fef3c7" }}>
                  <strong>⚠️ Impacto:</strong> Acceso total a la cuenta del
                  usuario {user.name}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-md">
          <div className="space-y-6">
            {/* ID */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                ID de Usuario
              </label>
              <div className="text-lg font-semibold">{user.id}</div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Nombre Completo
              </label>
              <div className="text-lg">{user.name}</div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="text-lg text-blue-400">{user.email}</div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Rol
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {user.role || "user"}
              </span>
            </div>

            {/* Número de cuenta */}
            {user.account_number && (
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Número de Cuenta
                </label>
                <div className="text-lg font-mono bg-gray-800 px-4 py-2 rounded border border-gray-700 inline-block">
                  {user.account_number}
                </div>
              </div>
            )}

            {/* VULNERABLE A02:2021 - Cryptographic Failures */}
            {/* Muestra el hash MD5 de la contraseña y permite crackearlo */}
            {user.password && (
              <div>
                <label className="block text-xs text-amber-400 mb-2 uppercase tracking-wide">
                  ⚠️ Contraseña (Hash MD5) - VULNERABLE
                </label>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="font-mono text-sm text-amber-400 break-all mb-3">
                    {user.password}
                  </div>

                  {/* Botón para crackear */}
                  {!crackedPassword && !cracking && (
                    <button
                      onClick={() => attemptCrack(user.password)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      🔓 Crackear Hash MD5
                    </button>
                  )}

                  {/* Animación de crackeo */}
                  {cracking && (
                    <div className="flex items-center gap-3">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400"></div>
                      <span className="text-amber-400 text-sm">
                        Crackeando con rainbow table...
                      </span>
                    </div>
                  )}

                  {/* Contraseña crackeada */}
                  {crackedPassword && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mt-3">
                      <p className="text-red-400 text-sm mb-2">
                        ✅ <strong>Hash crackeado exitosamente:</strong>
                      </p>
                      <div className="bg-black/30 px-4 py-3 rounded font-mono text-lg text-green-400 border border-green-500/30">
                        {crackedPassword}
                      </div>
                      <p className="text-xs text-red-300 mt-3">
                        💡 Esta es la contraseña en texto plano. Ahora puedes
                        hacer login como este usuario.
                      </p>
                    </div>
                  )}

                  {!crackedPassword && !cracking && (
                    <p className="text-xs text-amber-300/70 mt-3">
                      Este hash MD5 puede ser crackeado usando rainbow tables
                      pre-computadas
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Fecha de creación */}
            {user.created_at && (
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Fecha de Registro
                </label>
                <div className="text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate(`/users/${user.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition"
            >
              Editar Usuario
            </button>
            <button
              onClick={() => navigate("/users")}
              className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-lg transition"
            >
              Volver
            </button>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-10 pb-6">
          © 2025 PicoBanco — Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

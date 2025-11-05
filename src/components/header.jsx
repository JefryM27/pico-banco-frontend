import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <nav className="flex justify-between items-center bg-gray-900/90 border-b border-gray-800 backdrop-blur-sm px-8 py-3 mb-8 shadow-lg">
      <div className="flex items-center gap-8">
        <h1 className="text-blue-500 font-bold text-xl">💳 PicoBanco</h1>
        <ul className="flex gap-5 list-none m-0 p-0">
          <li>
            <Link
              to="/home"
              className="text-gray-300 hover:text-blue-400 text-sm transition no-underline"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/transactions"
              className="text-gray-300 hover:text-blue-400 text-sm transition no-underline"
            >
              Mis Transacciones
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              className="text-gray-300 hover:text-blue-400 text-sm transition no-underline"
            >
              Transferir
            </Link>
          </li>
          <li>
            <Link
              to="/savings"
              className="text-gray-300 hover:text-blue-400 text-sm transition no-underline"
            >
              Ahorros
            </Link>
          </li>
          <li>
            <Link
              to="/pay-services"
              className="text-gray-300 hover:text-blue-400 text-sm transition no-underline"
            >
              Pagar Servicios
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-700 transition"
        >
          Mi Perfil
        </button>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-500 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

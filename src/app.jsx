import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Páginas
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import UsersList from "./pages/userList.jsx";
import Transactions from "./pages/transactions.jsx";
import CreateTransaction from "./pages/createTransaction.jsx";
import UserTransactions from "./pages/userTransaction.jsx";
import SecurityDemo from "./pages/securityDemo.jsx";
import NotFound from "./pages/notFount.jsx";

// Servicios de autenticación
import { isAuthenticated } from "./services/auth.service.js";

export default function App() {
  const location = useLocation();

  // Oculta padding en login y registro
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <main className={isAuthPage ? "" : "p-0"}>
      <Routes>
        {/* Redirección raíz */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Páginas principales (solo accesibles si hay sesión activa) */}
        <Route
          path="/home"
          element={
            isAuthenticated() ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated() ? <UsersList /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated() ? (
              <Transactions />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/create"
          element={
            isAuthenticated() ? (
              <CreateTransaction />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transactions/user"
          element={
            isAuthenticated() ? (
              <UserTransactions />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/demo"
          element={
            isAuthenticated() ? (
              <SecurityDemo />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

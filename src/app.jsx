import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import CreateTransaction from "./pages/createTransaction.jsx";
import MyTransactions from "./pages/myTransactions.jsx";
import PayServices from "./pages/payServices.jsx";
import Profile from "./pages/profile.jsx";
import Savings from "./pages/savings.jsx";
import SavingsDetail from "./pages/savingsDetail.jsx";
import NotFound from "./pages/notFount.jsx";
import ServicePaymentsHistory from "./pages/servicePaymentsHistory.jsx";
import UsersList from "./pages/userList.jsx";
import UserDetail from "./pages/userDetail.jsx";
import { isAuthenticated } from "./services/auth.service.js";

export default function App() {
  return (
    <main>
      <Routes>
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

        <Route
          path="/users"
          element={
            isAuthenticated() ? <UsersList /> : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            isAuthenticated() ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated() ? (
              <MyTransactions />
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
          path="/pay-services"
          element={
            isAuthenticated() ? (
              <PayServices />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/savings"
          element={
            isAuthenticated() ? <Savings /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/savings/:id"
          element={
            isAuthenticated() ? (
              <SavingsDetail />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/service-payments-history"
          element={
            isAuthenticated() ? (
              <ServicePaymentsHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/users/:id"
          element={
            isAuthenticated() ? (
              <UserDetail />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

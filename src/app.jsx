import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import UsersList from "./pages/userList.jsx";
import Transactions from "./pages/transactions.jsx";
import CreateTransaction from "./pages/createTransaction.jsx";
import UserTransactions from "./pages/userTransaction.jsx";
import SecurityDemo from "./pages/securityDemo.jsx";
import NotFound from "./pages/notFount.jsx";

export default function App() {
  return (
    <div>
      <header className="p-4 border-b">
        <Link to="/" className="mr-4">PicoBanco</Link>
        <Link to="/users" className="mr-2">Users</Link>
        <Link to="/transactions" className="mr-2">Transactions</Link>
        <Link to="/create" className="mr-2">Create TX</Link>
        <Link to="/demo" className="mr-2">Security Demo</Link>
        <Link to="/login" className="mr-2">Login</Link>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/create" element={<CreateTransaction />} />
          <Route path="/transactions/user" element={<UserTransactions />} />
          <Route path="/demo" element={<SecurityDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

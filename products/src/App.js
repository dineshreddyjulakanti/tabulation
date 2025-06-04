// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductTable from "./components/ProductTable";
import Login from "./pages/login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("auth"));

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          localStorage.removeItem("auth");
          setIsAuthenticated(false);
        }}
      />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <ProductTable /> : <Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

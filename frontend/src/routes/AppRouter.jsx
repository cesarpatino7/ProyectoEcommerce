import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePages";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import CRUDPage from "../pages/CRUDPage";
import ProtectedRoute from "./ProtectedRoute";

// Definimos los roles de administrador en una constante para mantenerlo limpio
const ADMIN_ROLES = [
  "ROLE_SUPER_ADMIN",
  "ROLE_PRODUCT_MANAGER",
  "ROLE_ORDER_MANAGER",
];

const AppRouter = () => {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Rutas Protegidas para CUALQUIER usuario logueado --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<ProfilePage />} />
        {/* Aquí añadiremos /mis-pedidos en el futuro */}
      </Route>

      {/* --- Rutas Protegidas SOLO para roles de Administrador --- */}
      <Route element={<ProtectedRoute rolesPermitidos={ADMIN_ROLES} />}>
        <Route path="/admin" element={<CRUDPage />} />
        {/* Aquí irían otras rutas de admin como /admin/productos */}
      </Route>

      {/* --- Ruta para páginas no encontradas --- */}
      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
};

export default AppRouter;

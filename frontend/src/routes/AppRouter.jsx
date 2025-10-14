import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePages";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import CRUDPage from "../pages/CRUDPage";
import ProtectedRoute from "./ProtectedRoute";
import ProductDetailPage from "../pages/ProductDetailPage";
import AdminAddProduct from "../pages/AdminAddProduct";
import InventoryPage from "../pages/InventoryPage";
import AdminEditProduct from "../pages/AdminEditProduct";
import CartPage from "../pages/CartPage";
import MisPedidos from "../components/MisPedidos/MisPedidos";
import OrderManagerPage from "../pages/OrderManagerPage";

// Definimos los roles de administrador en una constante para mantenerlo limpio
const ADMIN_ROLES = ["ROLE_SUPER_ADMIN", "ROLE_ORDER_MANAGER"];

// Roles que pueden acceder a la gestión de inventario (agregar producto)
const INVENTORY_ROLES = [
  // Solo el rol de encargado de inventario y super admin pueden agregar productos
  "ROLE_PRODUCT_MANAGER",
  "ROLE_SUPER_ADMIN",
];

const AppRouter = () => {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* --- Rutas Protegidas para CUALQUIER usuario logueado --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        {/* Aquí añadiremos /mis-pedidos en el futuro */}
      </Route>

      {/* --- Rutas Protegidas SOLO para roles de Administrador --- */}
      <Route element={<ProtectedRoute rolesPermitidos={ADMIN_ROLES} />}>
        <Route path="/admin" element={<CRUDPage />} />
        <Route path="/admin/pedidos" element={<OrderManagerPage />} />
        {/* Aquí irían otras rutas de admin como /admin/productos */}
      </Route>

      {/* Rutas para gestión de inventario (agregar producto)*/}
      <Route element={<ProtectedRoute rolesPermitidos={INVENTORY_ROLES} />}>
        <Route path="/agregar-producto" element={<AdminAddProduct />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route
          path="/admin/productos/:id/editar"
          element={<AdminEditProduct />}
        />
      </Route>

      {/* --- Ruta para páginas no encontradas --- */}
      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
};

export default AppRouter;

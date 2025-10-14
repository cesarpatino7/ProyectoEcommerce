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
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import StripeWrapper from "../components/StripeWrapper/StripeWrapper";

// Definimos roles para secciones específicas
const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
const ROLE_ORDER_MANAGER = "ROLE_ORDER_MANAGER";
const ROLE_PRODUCT_MANAGER = "ROLE_PRODUCT_MANAGER";

// Solo super admin puede acceder a la gestión de usuarios (/admin)
const USER_MANAGEMENT_ROLES = [ROLE_SUPER_ADMIN];

// Order manager y super admin pueden ver la gestión de pedidos
const ORDER_MANAGEMENT_ROLES = [ROLE_ORDER_MANAGER, ROLE_SUPER_ADMIN];

// Roles que pueden acceder a la gestión de inventario (agregar producto)
const INVENTORY_ROLES = [ROLE_PRODUCT_MANAGER, ROLE_SUPER_ADMIN];

const AppRouter = () => {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      <Route
        path="/order-success"
        element={
          <StripeWrapper>
            <OrderSuccessPage />
          </StripeWrapper>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
      {/* --- Rutas Protegidas para gestión de usuarios (solo Super Admin) --- */}
      <Route element={<ProtectedRoute rolesPermitidos={USER_MANAGEMENT_ROLES} />}>
        <Route path="/admin" element={<CRUDPage />} />
      </Route>

      {/* --- Rutas Protegidas para gestión de pedidos (Order Manager y Super Admin) --- */}
      <Route element={<ProtectedRoute rolesPermitidos={ORDER_MANAGEMENT_ROLES} />}>
        <Route path="/admin/pedidos" element={<OrderManagerPage />} />
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

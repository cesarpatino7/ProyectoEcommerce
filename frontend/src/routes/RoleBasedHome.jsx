import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomePage from "../pages/HomePages";
import AdminDashboard from "../pages/AdminDashboard";

/**
 * Componente que redirige a la página apropiada según el rol del usuario
 */
const RoleBasedHome = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si es cliente, mostrar el catálogo
  if (user.role === "ROLE_CUSTOMER") {
    return <HomePage />;
  }

  // Si es cualquier tipo de administrador, mostrar el dashboard
  if (
    user.role === "ROLE_SUPER_ADMIN" ||
    user.role === "ROLE_ORDER_MANAGER" ||
    user.role === "ROLE_PRODUCT_MANAGER"
  ) {
    return <AdminDashboard />;
  }

  // Fallback: redirigir a login si el rol no es reconocido
  return <Navigate to="/login" replace />;
};

export default RoleBasedHome;

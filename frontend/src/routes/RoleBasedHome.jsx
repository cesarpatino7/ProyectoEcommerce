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

  // Si no hay usuario logueado, mostrar el catálogo público
  if (!user) {
    return <HomePage />;
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

  // Fallback: mostrar página principal para roles no reconocidos
  return <HomePage />;
};

export default RoleBasedHome;

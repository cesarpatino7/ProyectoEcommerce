import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  // Determinar qué opciones mostrar según el rol
  const isSuperAdmin = user?.role === "ROLE_SUPER_ADMIN";
  const isOrderManager = user?.role === "ROLE_ORDER_MANAGER";
  const isProductManager = user?.role === "ROLE_PRODUCT_MANAGER";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenido, {user?.nombre || user?.email}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Rol: {user?.role?.replace("ROLE_", "")}
          </p>
        </div>

        {/* Cards de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Super Admin - Gestión de Usuarios */}
          {isSuperAdmin && (
            <Link
              to="/admin"
              className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 transform"
            >
              <div className="card-body items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h2 className="card-title text-xl">Gestión de Usuarios</h2>
                <p className="text-gray-600 text-sm">
                  Administrar usuarios y roles del sistema
                </p>
              </div>
            </Link>
          )}

          {/* Order Manager y Super Admin - Gestión de Pedidos */}
          {(isOrderManager || isSuperAdmin) && (
            <Link
              to="/admin/pedidos"
              className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 transform"
            >
              <div className="card-body items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-green-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <h2 className="card-title text-xl">Gestión de Pedidos</h2>
                <p className="text-gray-600 text-sm">
                  Ver y administrar pedidos de clientes
                </p>
              </div>
            </Link>
          )}

          {/* Product Manager y Super Admin - Gestión de Inventario */}
          {(isProductManager || isSuperAdmin) && (
            <>
              <Link
                to="/inventario"
                className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 transform"
              >
                <div className="card-body items-center text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h2 className="card-title text-xl">Inventario</h2>
                  <p className="text-gray-600 text-sm">
                    Gestionar stock de productos
                  </p>
                </div>
              </Link>

              <Link
                to="/agregar-producto"
                className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 transform"
              >
                <div className="card-body items-center text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-orange-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <h2 className="card-title text-xl">Agregar Producto</h2>
                  <p className="text-gray-600 text-sm">
                    Añadir nuevos productos al catálogo
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Mensaje si no tiene permisos */}
        {!isSuperAdmin && !isOrderManager && !isProductManager && (
          <div className="text-center mt-12">
            <div className="alert alert-info shadow-lg inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Tu cuenta no tiene permisos de administrador activos.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

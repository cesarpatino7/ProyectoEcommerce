import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";
import { useCart } from "../../context/CartContext";
import CartModal from "../CartModal/CartModal"; // 1. Importamos el nuevo componente

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart(); // Solo necesitamos el total de items para la insignia

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate("/");
  };

  // Obtener el nombre a mostrar (nombre y apellido, o solo nombre, o email)
  const displayName =
    user?.nombre && user?.apellido
      ? `${user.nombre} ${user.apellido}`
      : user?.nombre || user?.apellido || user?.email || "Usuario";

  return (
    <header className="mb-8">
      <div className="navbar bg-base-100 px-0">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Trucho Tienda
          </Link>
        </div>

        <div className="flex-none gap-2">
          {/* Dropdown del Carrito - Solo para clientes */}
          {user?.role === "ROLE_CUSTOMER" && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="badge badge-sm badge-primary indicator-item">
                      {totalItems}
                    </span>
                  )}
                </div>
              </label>
              {/* 2. Aquí renderizamos nuestro nuevo componente */}
              <CartModal />
            </div>
          )}

          {/* Dropdown del Usuario */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm md:btn-md gap-2 hover:bg-gray-100 transition-colors"
              >
                {/* Ícono de usuario simple */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs text-gray-500">Hola,</span>
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {displayName}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-white rounded-xl w-64 border border-gray-100"
              >
                {/* Header del menú */}
                <li className="menu-title px-3 py-2 mb-2">
                  <div className="flex items-center gap-3">
                    {/* Ícono de usuario en el menú */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </li>
                <div className="divider my-1"></div>

                {/* Opciones para clientes */}
                {user.role === "ROLE_CUSTOMER" && (
                  <>
                    <li>
                      <Link
                        to="/perfil"
                        className="hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/mis-pedidos"
                        className="hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Mis Pedidos
                      </Link>
                    </li>
                  </>
                )}

                {/* Opciones para administradores - Dashboard principal */}
                {(user.role === "ROLE_SUPER_ADMIN" ||
                  user.role === "ROLE_ORDER_MANAGER" ||
                  user.role === "ROLE_PRODUCT_MANAGER") && (
                  <li>
                    <Link
                      to="/"
                      className="hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard Principal
                    </Link>
                  </li>
                )}

                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-ghost btn-sm">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

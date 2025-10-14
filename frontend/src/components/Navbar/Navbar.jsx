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

  return (
    <header className="mb-8">
      <div className="navbar bg-base-100 px-0">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Trucho Tienda
          </Link>
        </div>

        <div className="flex-none gap-2">
          {/* Dropdown del Carrito */}
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

          {/* Dropdown del Usuario */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost">
                <span className="hidden sm:inline text-gray-700">
                  Hola,{" "}
                  <span className="font-semibold text-blue-950">
                    {user.email}
                  </span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {user.role === "ROLE_CUSTOMER" && (
                  <>
                    <li>
                      <Link to="/perfil">Mi Perfil</Link>
                    </li>
                    <li>
                      <Link to="/mis-pedidos">Mis Pedidos</Link>
                    </li>
                  </>
                )}
                {(user.role === "ROLE_PRODUCT_MANAGER" ||
                  user.role === "ROLE_SUPER_ADMIN") && (
                  <li>
                    <Link to="/inventario">Inventario</Link>
                  </li>
                )}
                {(user.role === "ROLE_ORDER_MANAGER" ||
                  user.role === "ROLE_SUPER_ADMIN") && (
                  <li>
                    <Link to="/admin/pedidos">Pedidos</Link>
                  </li>
                )}
                {user.role === "ROLE_SUPER_ADMIN" && (
                  <li>
                    <Link to="/admin">Gestión de Usuarios</Link>
                  </li>
                )}
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="text-red-600">
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

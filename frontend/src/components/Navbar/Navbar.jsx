import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate("/");
  };

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center px-0 py-4 w-full">
        <div>
          <Link to="/" className="btn btn-ghost text-xl text-black">
            Trucho Tienda
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <span className="text-gray-700">
                    Hola,{" "}
                    <span className="font-semibold text-blue-950">
                      {user.email}
                    </span>
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {/* Solo mostramos estos enlaces si el rol es de cliente */}
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

                  {/* Lógica para mostrar enlaces de admin */}
                  {(user.role === "ROLE_SUPER_ADMIN" ||
                    user.role === "ROLE_PRODUCT_MANAGER") && (
                    <li>
                      <Link to="/admin/productos">Admin Productos</Link>
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
            </>
          ) : (
            // --- VISTA CUANDO EL USUARIO NO ESTÁ LOGUEADO ---
            <>
              <Link to="/login" className="btn btn-primary">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-ghost">
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

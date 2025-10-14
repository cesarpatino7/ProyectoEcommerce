import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems, totalItems, totalPrice, removeItem } = useCart();
  const { show } = useNotification();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate("/");
  };

  const closeDropdown = () => {
    try {
      const active = document.activeElement;
      if (active && typeof active.blur === 'function') active.blur();
    } catch {
      // noop
    }
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
          {/* Mini-dropdown del carrito (preview) */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost relative">
              <span>🛒</span>
              {totalItems > 0 && (
                <span className="badge badge-sm badge-primary absolute -top-2 -right-3">{totalItems}</span>
              )}
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-80">
              {(!cartItems || cartItems.length === 0) ? (
                <li className="p-2 text-center">Tu carrito está vacío</li>
              ) : (
                cartItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="p-2">
                    <div className="flex items-center gap-3">
                      <img src={item.imagen || item.image} alt={item.nombre || item.name} className="w-12 h-12 object-contain" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{item.nombre || item.name}</div>
                        <div className="text-xs text-gray-600">{item.quantity} × {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(item.precio ?? item.price ?? 0)}</div>
                      </div>
                      <button className="text-red-600 text-sm" onClick={() => { removeItem(item.id); show(`Eliminaste ${item.nombre || item.name} del carrito`, 'success'); }}>Eliminar</button>
                    </div>
                  </li>
                ))
              )}

              <div className="divider my-1" />

              <li className="p-2 flex justify-between items-center">
                <span className="text-sm">Total</span>
                <span className="font-semibold">{new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(totalPrice)}</span>
              </li>

              <li className="p-2 grid grid-cols-2 gap-2">
                <Link to="/cart" className="btn btn-sm btn-outline" onClick={() => closeDropdown()}>Ver carrito</Link>
                <button className="btn btn-sm btn-primary" onClick={() => { closeDropdown(); navigate('/cart'); }}>Pagar</button>
              </li>
            </ul>
          </div>
          
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
                  {/* Enlace Admin Productos eliminado por petición del usuario */}
                  {/* Enlace exclusivo para encargado de inventario */}
                  {(user.role === "ROLE_PRODUCT_MANAGER" || user.role === "ROLE_SUPER_ADMIN") && (
                    <li>
                      <Link to="/agregar-producto">Agregar Producto</Link>
                    </li>
                  )}
                  {(user.role === "ROLE_PRODUCT_MANAGER" || user.role === "ROLE_SUPER_ADMIN") && (
                    <li>
                      <Link to="/inventario">Inventario</Link>
                    </li>
                  )}
                  {/* Enlace a Pedidos visible para Super Admin y Order Manager */}
                  {(user.role === "ROLE_ORDER_MANAGER" || user.role === "ROLE_SUPER_ADMIN") && (
                    <li>
                      <Link to="/admin/pedidos">Pedidos</Link>
                    </li>
                  )}
                  {/* Enlace a Gestión de Usuarios visible solo para Super Admin */}
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
            </>
          ) : (
            // --- VISTA CUANDO EL USUARIO NO ESTÁ LOGUEADO ---
            <>
              <Link to="/login" className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-auto">
                Iniciar sesión
              </Link>
              <Link to="/register" className="bg-gray-300 border rounded border-gray-300 text-gray-800 font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-auto">
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

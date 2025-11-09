import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";
import { Link, useNavigate } from "react-router-dom";

const CartModal = () => {
  const { cartItems, totalPrice, totalItems, removeItem } = useCart();
  const { show: showNotification } = useNotification();
  const navigate = useNavigate();

  const handleRemoveItem = (item) => {
    removeItem(item.id);
    showNotification(
      `"${item.nombreProducto}" eliminado del carrito.`,
      "success"
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const closeDropdown = () => {
    try {
      const active = document.activeElement;
      if (active && typeof active.blur === "function") active.blur();
    } catch {}
  };

  const handleGoToCart = () => {
    closeDropdown();
    navigate("/cart");
  };

  const handleCheckout = () => {
    closeDropdown();
    // Aquí irá la lógica para navegar a la página de pago en el futuro
    navigate("/checkout"); // Asumimos que la ruta de pago será /checkout
  };

  return (
    <div
      tabIndex={0}
      className="mt-3 z-[50] card card-compact dropdown-content w-80 bg-base-100 shadow"
    >
      <div className="card-body">
        <span className="font-bold text-lg">{totalItems} Ítems</span>

        <div className="divider my-0"></div>

        {cartItems.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 py-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-14 rounded">
                    <img src={item.imagen} alt={item.nombreProducto} />
                  </div>
                </div>
                <div className="flex-1 text-sm overflow-hidden">
                  <p className="font-semibold truncate">
                    {item.nombreProducto}
                  </p>
                  <p className="text-gray-500">
                    {item.cantidad} × {formatPrice(item.precioUnitario)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="btn btn-ghost btn-xs text-red-500 cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Tu carrito está vacío.
          </p>
        )}

        <div className="divider my-0"></div>

        <div className="flex justify-between items-center py-2">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
        </div>

        <div className="card-actions mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={handleGoToCart}
            className="btn btn-outline btn-block"
          >
            Ver Carrito
          </button>
          <button
            onClick={handleCheckout}
            className="btn bg-blue-950 text-white hover:bg-blue-900 btn-block"
            disabled={cartItems.length === 0}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

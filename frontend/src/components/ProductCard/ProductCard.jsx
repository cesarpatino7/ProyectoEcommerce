import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ id, name, image, price, stock }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { show: showNotification } = useNotification();
  const { user } = useAuth();

  const handleCardClick = (e) => {
    if (
      e.target.closest(".quantity-control") ||
      e.target.closest(".add-to-cart")
    ) {
      return;
    }
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!user) {
      showNotification("Debes iniciar sesión para agregar productos al carrito", "info");
      navigate("/login");
      return;
    }
    
    if ((stock ?? 0) <= 0) {
      showNotification(`No hay stock disponible de ${name}`, "error");
      return;
    }
    const qty = Math.min(quantity, stock ?? quantity);

    // --- CAMBIO CLAVE Y ÚNICO ---
    // Ahora llamamos a `addItem` con los parámetros que el nuevo contexto espera: productId y quantity.
    addItem(id, qty);

    showNotification(`Agregaste ${qty} × ${name} al carrito`, "success");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // El resto del JSX no necesita cambios, solo añadimos la validación en los botones de cantidad
  // para una mejor experiencia de usuario.
  return (
    <div
      onClick={handleCardClick}
      className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
    >
      <figure className="px-4 pt-4">
        <img
          src={image}
          alt={name}
          className="rounded-xl h-48 w-full object-contain"
        />
      </figure>
      <div className="card-body items-center text-center p-4">
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {name}
        </h2>
        <p className="text-xl font-bold text-blue-900">{formatPrice(price)}</p>

        <div
          className="quantity-control flex items-center gap-2 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-square btn-sm btn-outline"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={(stock ?? 0) <= 0}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(stock, parseInt(e.target.value) || 1))
              )
            }
            className="input input-bordered input-sm w-16 text-center"
            disabled={(stock ?? 0) <= 0}
          />
          <button
            className="btn btn-square btn-sm btn-outline"
            onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
            disabled={quantity >= stock || (stock ?? 0) <= 0}
          >
            +
          </button>
        </div>

        {(stock ?? 0) > 0 ? (
          <button
            className="add-to-cart btn bg-blue-950 text-white hover:bg-blue-900 btn-sm mt-2 w-full"
            onClick={handleAddToCart}
          >
            🛒 Agregar al carrito
          </button>
        ) : (
          <button className="btn btn-disabled btn-sm mt-2 w-full">
            Sin stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

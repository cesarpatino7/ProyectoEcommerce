import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, name, image, price }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

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
    console.log(
      `Agregando ${quantity} unidad(es) del producto ${id} al carrito`
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      maximumFractionDigits: 0,
    }).format(price);
  };

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
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="input input-bordered input-sm w-16 text-center"
          />
          <button
            className="btn btn-square btn-sm btn-outline"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        <button
          className="add-to-cart btn btn-primary btn-sm mt-2 w-full"
          onClick={handleAddToCart}
        >
          🛒 Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

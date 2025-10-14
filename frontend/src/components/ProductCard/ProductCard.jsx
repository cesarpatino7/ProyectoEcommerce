import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";

const ProductCard = ({ id, name, image, price, stock }) => {
  const navigate = useNavigate();
  // quantity removed: overlay add-to-cart will add 1 by default
  const [hovered, setHovered] = useState(false);
  const [barHovered, setBarHovered] = useState(false);

  const handleCardClick = (e) => {
    // prevent navigation when clicking the overlay add-to-cart button
    if (e.target.closest(".add-to-cart-overlay")) {
      return;
    }
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if ((stock ?? 0) <= 0) {
      showNotification(`No hay stock disponible de ${name}`, 'error');
      return;
    }
    // add single unit by default from overlay
    addItem({ id, nombre: name, precio: price, imagen: image }, 1);
    showNotification(`Agregaste 1 × ${name} al carrito`, "success");
  };

  // cart
  const { addItem } = useCart();
  const { show: showNotification } = useNotification();

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
      className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer relative overflow-hidden"
    >
      <figure
        className="w-full h-64 relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setBarHovered(false); }}
      >
        <img
          src={image}
          alt={name}
          className="rounded-xl h-full w-full object-cover"
        />

        {/* Full-width overlay bar that appears from bottom on card hover */}
        { (stock ?? 0) > 0 && (
          <button
            onClick={handleAddToCart}
            className="add-to-cart-overlay absolute left-0 right-0 bottom-0 bg-[#1B2F54] text-white z-10 overflow-hidden"
            style={{
              backgroundColor: '#1B2F54',
              borderBottomLeftRadius: '0.75rem',
              borderBottomRightRadius: '0.75rem',
              opacity: barHovered ? 1 : (hovered ? 0.5 : 0),
              transform: 'translateY(0)',
              transition: 'opacity 200ms ease'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setBarHovered(true)}
            onMouseLeave={() => setBarHovered(false)}
          >
            {/* Full content (icon + label) */}
            <div
              className="full-content flex items-center justify-center gap-2 py-2 px-4 text-sm"
              style={{ opacity: barHovered ? 0 : 1, visibility: barHovered ? 'hidden' : 'visible', transition: 'opacity 160ms ease' }}
            >
              <span className="icon-only text-lg">🛒</span>
              <span className="label">Agregar</span>
              <span className="sr-only">Agregar</span>
            </div>
            {/* Centered icon-only layer (absolute) */}
            <div
              className="icon-layer absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ opacity: barHovered ? 1 : 0, transition: 'opacity 160ms ease, transform 160ms ease', zIndex: 20 }}
            >
              <span className="icon-only text-xl">🛒</span>
            </div>
          </button>
        )}
      </figure>

      <div className="card-body items-center text-center p-4">
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {name}
        </h2>
        <p className="text-xl font-bold text-blue-900">{formatPrice(price)}</p>

        {/* Only overlay add-to-cart is used now. Show stock label if needed */}
        { (stock ?? 0) <= 0 && (
          <div className="mt-2">
            <button className="btn btn-disabled btn-sm mt-2 w-full">Sin stock</button>
          </div>
        )}
      </div>
      {/* Inline styles to control overlay visibility when hovering the card */}
      <style>{`
        /* Initial: hidden (no vertical movement) */
        .add-to-cart-overlay {
          box-shadow: 0 8px 26px rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateY(0);
          transition: opacity 200ms ease;
          pointer-events: none;
        }
        /* Hover card: show at 50% opacity (no lift) */
        .card:hover .add-to-cart-overlay {
          opacity: 0.5;
          transform: translateY(0);
          pointer-events: auto;
        }
        /* Hover the bar itself: full opacity (solid background) */
        .add-to-cart-overlay:hover {
          opacity: 1;
          transform: translateY(0);
          background-color: rgba(27,47,84,1) !important; /* ensure fully opaque */
        }
  .add-to-cart-overlay .label { opacity: 1; transition: transform 160ms ease, opacity 160ms ease; }
  .add-to-cart-overlay:hover .label { opacity: 0; transform: translateY(-6px); }
  /* Hide full-content to avoid duplicate icon appearing; fade out and then hide */
  .add-to-cart-overlay .full-content { opacity: 1; transition: opacity 160ms ease, visibility 0s linear 160ms; }
  .add-to-cart-overlay:hover .full-content { opacity: 0; visibility: hidden; transition: opacity 160ms ease; }
  /* icon-layer becomes visible and sits above full-content */
  .add-to-cart-overlay .icon-layer { transition: opacity 160ms ease; z-index: 20; pointer-events: none; }
  .add-to-cart-overlay:hover .icon-layer { opacity: 1; pointer-events: auto; }
        .add-to-cart-overlay .icon-only { transition: transform 150ms ease; }
        .add-to-cart-overlay:hover .icon-only { transform: scale(1.28); }
      `}</style>
    </div>
  );
};

export default ProductCard;

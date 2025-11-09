import React from "react";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    totalItems,
    totalPrice,
    clearCart,
    isLoading,
  } = useCart();
  const { show } = useNotification();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block h-16 w-16 text-gray-300 mb-4"
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
          <h2 className="text-3xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">
            Parece que aún no has añadido ningún producto.
          </p>
          <Link to="/" className="btn bg-blue-950 text-white hover:bg-blue-900">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div
        className={`relative ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tu Carrito</h1>
          <button
            className="btn btn-ghost btn-sm text-gray-500 hover:bg-gray-200"
            onClick={() => {
              if (
                window.confirm(
                  "¿Estás seguro de que quieres vaciar el carrito?"
                )
              ) {
                clearCart();
                show("Carrito vaciado con éxito", "success");
              }
            }}
          >
            Vaciar Carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="card card-side bg-base-100 shadow-md border border-gray-200/80"
              >
                <figure className="p-4 w-32 flex-shrink-0">
                  <img
                    src={item.imagen}
                    alt={item.nombreProducto}
                    className="object-contain h-full w-full"
                  />
                </figure>
                <div className="card-body p-4 flex-col justify-between">
                  <div>
                    <h2 className="card-title text-lg font-semibold">
                      {item.nombreProducto}
                    </h2>
                    <p className="text-md text-gray-500">
                      {formatPrice(item.precioUnitario)}
                    </p>
                  </div>
                  <div className="card-actions items-center justify-between mt-2">
                    <div className="join">
                      <button
                        className="btn join-item btn-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.cantidad - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="text"
                        readOnly
                        className="input input-bordered join-item input-sm w-12 text-center"
                        value={item.cantidad}
                      />
                      <button
                        className="btn join-item btn-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.cantidad + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => {
                        removeItem(item.id);
                        show(`"${item.nombreProducto}" eliminado`, "success");
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-shrink-0 flex items-center">
                  <p className="font-semibold text-lg">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Resumen del Pedido</h2>
                <div className="space-y-2 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({totalItems} items)
                    </span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold text-success">Gratis</span>
                  </div>
                </div>
                <div className="divider my-4"></div>
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="card-actions mt-6">
                  <button
                    className="btn bg-blue-950 text-white hover:bg-blue-900 btn-block text-base"
                    onClick={() => navigate("/checkout")}
                    disabled={totalItems === 0}
                  >
                    Ir a Pagar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

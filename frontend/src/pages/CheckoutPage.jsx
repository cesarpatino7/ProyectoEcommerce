import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import addressService from "../api/addressService";
import { paymentService } from "../api/paymentService";
import StripeWrapper from "../components/StripeWrapper/StripeWrapper";
import PaymentForm from "../components/PaymentForm/PaymentForm";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const {
    cartItems,
    totalPrice,
    totalItems,
    isLoading: isCartLoading,
  } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Un único estado de carga
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userAddresses = await addressService.getMyAddresses();
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        }
      } catch (err) {
        setError("No se pudieron cargar tus direcciones.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddressId && cartItems.length > 0) {
      setClientSecret(""); // Reseteamos el secret si cambia la dirección
      const fetchPaymentIntent = async () => {
        try {
          const response = await paymentService.createPaymentIntent(
            selectedAddressId
          );
          setClientSecret(response.clientSecret);
        } catch (err) {
          setError(`Error al preparar el pago: ${err.message}`);
        }
      };
      fetchPaymentIntent();
    }
  }, [selectedAddressId, cartItems]);

  // Opciones para el proveedor de Stripe Elements
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  if (isLoading || isCartLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-primary">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="card bg-base-100 shadow-lg border border-gray-200/80">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">1. Dirección de Envío</h2>
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-primary ring-2 ring-primary"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <p className="font-semibold">
                        {address.descripcionCalle}
                      </p>
                      <p className="text-sm text-gray-500">{`${address.nombreCiudad}, ${address.nombreDepartamento}`}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">No tienes direcciones guardadas.</p>
                  <Link
                    to="/perfil/direcciones"
                    className="btn btn-sm btn-outline"
                  >
                    Añadir Dirección
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-gray-200/80">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">2. Método de Pago</h2>
              {clientSecret ? (
                <StripeWrapper options={stripeOptions}>
                  <PaymentForm />
                </StripeWrapper>
              ) : (
                <div className="flex justify-center items-center py-8">
                  {error ? (
                    <div className="text-error">{error}</div>
                  ) : (
                    <span className="loading loading-spinner"></span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-lg sticky top-24">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Resumen del Pedido</h2>
              <div className="space-y-2 text-sm max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center gap-2"
                  >
                    <div className="avatar">
                      <div className="w-12 rounded">
                        <img src={item.imagen} alt={item.nombreProducto} />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold truncate">
                        {item.nombreProducto}
                      </p>
                      <p className="text-xs">Cant: {item.cantidad}</p>
                    </div>
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat("es-PY", {
                        style: "currency",
                        currency: "PYG",
                        maximumFractionDigits: 0,
                      }).format(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="divider my-4"></div>
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-PY", {
                      style: "currency",
                      currency: "PYG",
                      maximumFractionDigits: 0,
                    }).format(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-success">Gratis</span>
                </div>
              </div>
              <div className="divider my-4"></div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    maximumFractionDigits: 0,
                  }).format(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

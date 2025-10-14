import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import addressService from "../api/addressService";
import { paymentService } from "../api/paymentService";
import { userService } from "../api/userService";
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
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar perfil del usuario y direcciones en paralelo
        const [profile, userAddresses] = await Promise.all([
          userService.getMyProfile(),
          addressService.getMyAddresses(),
        ]);

        setUserProfile(profile);
        setAddresses(userAddresses);

        if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        }
      } catch (err) {
        setError("No se pudieron cargar tus datos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  // Verificar si el usuario no tiene teléfono
  if (userProfile && !userProfile.telefono && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-warning mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <h2 className="card-title text-2xl mb-2">
              Falta tu número de teléfono
            </h2>
            <p className="text-gray-600 mb-6">
              Para continuar con tu compra, necesitas agregar un número de
              teléfono en tu perfil. Esto nos permitirá contactarte sobre tu
              pedido.
            </p>
            <div className="card-actions justify-center flex-col sm:flex-row gap-3 w-full">
              <Link to="/perfil" className="btn btn-primary btn-wide">
                Ir a Mi Perfil
              </Link>
              <Link to="/" className="btn btn-outline btn-wide">
                Volver a la Tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si el usuario no tiene direcciones
  if (addresses.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-warning mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h2 className="card-title text-2xl mb-2">
              No tienes direcciones registradas
            </h2>
            <p className="text-gray-600 mb-6">
              Para continuar con tu compra, necesitas agregar al menos una
              dirección de envío en tu perfil.
            </p>
            <div className="card-actions justify-center flex-col sm:flex-row gap-3 w-full">
              <Link to="/perfil" className="btn btn-primary btn-wide">
                Ir a Mi Perfil
              </Link>
              <Link to="/" className="btn btn-outline btn-wide">
                Volver a la Tienda
              </Link>
            </div>
          </div>
        </div>
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

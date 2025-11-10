import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { inventoryService } from "../api/inventoryService";

const OrderSuccessPage = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, succeeded, failed
  const [message, setMessage] = useState("Procesando tu pedido...");
  const [hasProcessedPurchase, setHasProcessedPurchase] = useState(false);
  const { processSuccessfulPurchase } = useCart();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      setStatus("failed");
      setMessage("Error: No se encontró el identificador del pago.");
      return;
    }

    // Verificar si ya se procesó este payment intent
    const processedPayments = JSON.parse(localStorage.getItem("processedPayments") || "[]");
    if (processedPayments.includes(clientSecret)) {
      console.log("🔄 Este pago ya fue procesado anteriormente");
      setStatus("succeeded");
      setMessage("¡Pago exitoso! Tu pedido ha sido confirmado.");
      setHasProcessedPurchase(true);
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setStatus("succeeded");
          setMessage("¡Pago exitoso! Tu pedido ha sido confirmado.");
          
          // Solo procesar la compra UNA vez
          if (!hasProcessedPurchase && !processedPayments.includes(clientSecret)) {
            console.log("💳 Pago exitoso detectado, procesando compra...");
            setHasProcessedPurchase(true);
            
            // Marcar como procesado
            processedPayments.push(clientSecret);
            localStorage.setItem("processedPayments", JSON.stringify(processedPayments));
            
            processSuccessfulPurchase();
          } else {
            console.log("🔄 Compra ya procesada, omitiendo...");
          }
          break;
        case "processing":
          setStatus("processing");
          setMessage(
            "Tu pago se está procesando. Te notificaremos cuando se complete."
          );
          break;
        case "requires_payment_method":
          setStatus("failed");
          setMessage(
            "El pago falló. Por favor, verifica tus datos e intenta de nuevo."
          );
          break;
        default:
          setStatus("failed");
          setMessage("Algo salió mal. Por favor, contacta a soporte.");
          break;
      }
    });
  }, [stripe, processSuccessfulPurchase, hasProcessedPurchase]);

  return (
    <div className="text-center py-20">
      <div className="max-w-lg mx-auto">
        {status === "succeeded" && (
          <svg
            className="inline-block h-16 w-16 text-success mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {status === "processing" && (
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        )}
        {status === "failed" && (
          <svg
            className="inline-block h-16 w-16 text-error mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}

        <h1 className="text-3xl font-bold mt-4">{message}</h1>

        {status === "succeeded" && (
          <p className="text-gray-500 mt-4">Gracias por tu compra.</p>
        )}

        <div className="mt-8">
          {status === "failed" ? (
            <button
              onClick={() => navigate("/checkout")}
              className="btn bg-blue-950 text-white hover:bg-blue-900"
            >
              Volver a Intentar
            </button>
          ) : (
            <Link to="/" className="btn bg-blue-950 text-white hover:bg-blue-900">
              Volver a la Tienda
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

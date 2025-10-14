import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("Ocurrió un error inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="btn btn-primary btn-block mt-6 text-base"
      >
        <span id="button-text">
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Pagar Ahora"
          )}
        </span>
      </button>

      {message && (
        <div id="payment-message" className="text-error mt-4 text-center">
          {message}
        </div>
      )}
    </form>
  );
};

export default PaymentForm;

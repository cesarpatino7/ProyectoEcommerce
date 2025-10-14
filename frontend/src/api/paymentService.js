import apiClient from "./apiClient";

/**
 * Llama al backend para crear una Intención de Pago (Payment Intent) en Stripe.
 * @param {number} idDireccion - El ID de la dirección de envío seleccionada por el usuario.
 * @returns {Promise<object>} La respuesta de la API, que debe contener el clientSecret.
 */
const createPaymentIntent = async (idDireccion) => {
  try {
    const payload = { idDireccion };
    const response = await apiClient.post("/payment/create-intent", payload);
    return response.data;
  } catch (error) {
    // Si el backend devuelve un error de validación (ej. falta el teléfono), lo lanzamos.
    throw (
      error.response?.data || { message: "Error al crear la intención de pago" }
    );
  }
};

export const paymentService = {
  createPaymentIntent,
};

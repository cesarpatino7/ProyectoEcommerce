import apiClient from "./apiClient";

const CART_ID_STORAGE_KEY = "anonymous_cart_id";

const getCartId = () => localStorage.getItem(CART_ID_STORAGE_KEY);
const setCartId = (id) => localStorage.setItem(CART_ID_STORAGE_KEY, id);
const removeCartId = () => localStorage.removeItem(CART_ID_STORAGE_KEY);

const getHeaders = () => {
  const headers = {};
  const cartId = getCartId();
  if (cartId) {
    headers["X-Cart-ID"] = cartId;
  }
  return headers;
};

const getCart = async () => {
  try {
    const response = await apiClient.get("/carrito", { headers: getHeaders() });
    if (response.data && response.data.id && !localStorage.getItem("token")) {
      setCartId(response.data.id);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener el carrito" };
  }
};

const addItemToCart = async (productId, quantity) => {
  try {
    const payload = { idProducto: productId, cantidad: quantity };
    const response = await apiClient.post("/carrito/items", payload, {
      headers: getHeaders(),
    });
    if (response.data && response.data.id && !localStorage.getItem("token")) {
      setCartId(response.data.id);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al agregar el item" };
  }
};

const updateCartItem = async (itemId, quantity) => {
  try {
    const payload = { cantidad: quantity };
    const response = await apiClient.put(`/carrito/items/${itemId}`, payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar el item" };
  }
};

const removeCartItem = async (itemId) => {
  try {
    const response = await apiClient.delete(`/carrito/items/${itemId}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al eliminar el item" };
  }
};

export const cartService = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  removeCartId, // La exportamos para usarla en el logout
};

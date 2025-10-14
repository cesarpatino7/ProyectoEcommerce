import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartService } from "../api/cartService";
import { productService } from "../api/productService"; // 1. Importamos el servicio de productos
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cartData = await cartService.getCart();

      // --- 2. LÓGICA DE ENRIQUECIMIENTO ---
      if (cartData && cartData.items && cartData.items.length > 0) {
        const enrichedItems = await Promise.all(
          cartData.items.map(async (item) => {
            try {
              const productDetails = await productService.getProductById(
                item.idProducto
              );
              // El campo 'imagenes' es un JSON string, necesitamos parsearlo.
              const images = JSON.parse(productDetails.imagenes || "[]");
              return {
                ...item,
                imagen: images[0] || null, // Asignamos la primera imagen o null si no hay
              };
            } catch (productError) {
              console.error(
                `Error al obtener detalles del producto ${item.idProducto}:`,
                productError
              );
              return { ...item, imagen: null }; // Devolvemos el item sin imagen si falla la petición
            }
          })
        );
        cartData.items = enrichedItems;
      }
      // --- FIN DE LA LÓGICA ---

      setCart(cartData);
    } catch (err) {
      console.error("Error al cargar el carrito:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [user, loadCart]);

  useEffect(() => {
    if (user) {
      cartService.removeCartId();
    }
  }, [user]);

  const handleApiCall = async (apiCall) => {
    setIsLoading(true);
    try {
      await apiCall();

      await loadCart();
    } catch (err) {
      console.error("Error en la operación del carrito:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = (productId, quantity = 1) => {
    handleApiCall(() => cartService.addItemToCart(productId, quantity));
  };

  const removeItem = (itemId) => {
    handleApiCall(() => cartService.removeCartItem(itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId);
    } else {
      handleApiCall(() => cartService.updateCartItem(itemId, quantity));
    }
  };

  const clearCart = async () => {
    if (!cart || !cart.items) return;
    setIsLoading(true);
    try {
      for (const item of cart.items) {
        await cartService.removeCartItem(item.id);
      }
      await loadCart();
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems: cart?.items || [],
    totalPrice: cart?.total || 0,
    totalItems: cart?.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    reloadCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

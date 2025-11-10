import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartService } from "../api/cartService";
import { productService } from "../api/productService"; // 1. Importamos el servicio de productos
import { inventoryService } from "../api/inventoryService"; // Importar servicio de inventario
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

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

  // Nueva función para procesar una compra exitosa
  const processSuccessfulPurchase = async () => {
    if (isProcessingPurchase) {
      console.log("� Ya se está procesando una compra, ignorando...");
      return;
    }
    
    setIsProcessingPurchase(true);
    console.log("�🛒 === INICIANDO PROCESO DE COMPRA EXITOSA ===");
    
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log("❌ No hay items en el carrito para procesar");
      setIsProcessingPurchase(false);
      return;
    }

    console.log("✅ Procesando compra exitosa, reduciendo stock...");
    console.log("📦 Items en el carrito:", cart.items);

    // Guardar items en localStorage para verificación posterior
    localStorage.setItem("ultimaCompra", JSON.stringify(cart.items));

    try {
      // En lugar de reducir stock (que ya se hizo en el backend), 
      // solo verificar y desactivar productos sin stock
      const resultados = await inventoryService.desactivarProductosSinStock(cart.items);
      
      console.log("📊 Resultados de desactivación:", resultados);
      
      // Verificar si hubo errores
      const errores = resultados.filter(r => !r.success);
      if (errores.length > 0) {
        console.warn("⚠️ Algunos productos no pudieron procesarse:", errores);
      }
      
      const exitos = resultados.filter(r => r.success);
      console.log(`✅ Procesados exitosamente ${exitos.length} productos`);
      
      // Mostrar detalles de productos desactivados
      const desactivados = exitos.filter(r => r.desactivado);
      if (desactivados.length > 0) {
        console.log(`🔴 Productos desactivados por stock = 0:`, desactivados.map(r => r.idProducto));
      }
      
      // Emitir eventos de stock actualizado para cada producto procesado
      exitos.forEach(resultado => {
        if (resultado.desactivado) {
          console.log(`📡 Emitiendo evento stockUpdated para producto desactivado ${resultado.idProducto}`);
          window.dispatchEvent(
            new CustomEvent("stockUpdated", {
              detail: {
                id: resultado.idProducto,
                stock: 0,
                deactivated: true,
                source: "purchase"
              },
            })
          );
        }
      });
      
      // Limpiar el carrito después de procesar
      console.log("🧹 Limpiando carrito...");
      await clearCart();
      console.log("✅ Proceso de compra exitosa completado");
      
    } catch (error) {
      console.error("❌ Error procesando la compra exitosa:", error);
      // Aún así limpiar el carrito para evitar doble procesamiento
      console.log("🧹 Limpiando carrito después del error...");
      await clearCart();
    } finally {
      setIsProcessingPurchase(false);
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
    processSuccessfulPurchase,
    reloadCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

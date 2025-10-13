import apiClient from "./apiClient";

/**
 * Obtiene una página del catálogo de productos (vista de cliente).
 * @param {object} params - Objeto con los parámetros de paginación, búsqueda y filtro.
 * @param {number} [params.page] - Número de la página a solicitar (empieza en 0).
 * @param {number} [params.size] - Cantidad de productos por página.
 * @param {string} [params.sort] - Criterio de ordenamiento (ej. "precio,desc").
 * @param {string} [params.busqueda] - Término de búsqueda por nombre.
 * @param {string} [params.categoria] - Nombre de la categoría para filtrar.
 * @returns {Promise<object>} El objeto de paginación con la lista de productos.
 */
const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get("/productos", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener los productos" };
  }
};

/**
 * Obtiene los detalles de un solo producto (vista de cliente).
 * Este endpoint es público.
 * @param {number} productId - El ID del producto.
 * @returns {Promise<object>} Los detalles del producto.
 */
const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/productos/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener el producto" };
  }
};

// Aquí podríamos añadir en el futuro los métodos de administración
// que están en ProductoAdminController, como createProduct, updateProduct, etc.

export const productService = {
  getProducts,
  getProductById,
};

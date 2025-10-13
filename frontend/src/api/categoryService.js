import apiClient from "./apiClient";

/**
 * Obtiene la lista completa de categorías.
 * Este endpoint es público.
 * @returns {Promise<Array>} La lista de categorías.
 */
const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/categorias");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error al obtener las categorías" }
    );
  }
};

export const categoryService = {
  getAllCategories,
};

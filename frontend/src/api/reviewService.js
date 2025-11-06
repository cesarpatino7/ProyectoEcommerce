import apiClient from './apiClient';

// Obtener reseñas de un producto (público, no requiere autenticación)
export const getProductReviews = async (productId) => {
  try {
    const response = await apiClient.get(`/resenas/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Error al obtener las reseñas');
  }
};

// Crear una nueva reseña
export const createReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/resenas', reviewData);
    return response.data;
  } catch (error) {
    let message = 'Error al crear la reseña';
    
    if (error.response?.status === 409) {
      message = 'Ya has publicado una reseña para este producto';
    } else if (error.response?.status === 400) {
      message = 'Datos de reseña inválidos';
    } else if (error.response?.status === 401) {
      message = 'No tienes permisos para crear una reseña';
    } else if (error.response?.data) {
      message = typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data.message || message;
    }
    
    throw new Error(message);
  }
};
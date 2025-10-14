import apiClient from './apiClient';

const getOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/pedidos', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener pedidos' };
  }
};

const updateOrderStatus = async (orderId, idEstado) => {
  try {
    const response = await apiClient.put(`/admin/pedidos/${orderId}/estado`, { idEstado });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar estado' };
  }
};

export const orderService = {
  getOrders,
  updateOrderStatus,
};

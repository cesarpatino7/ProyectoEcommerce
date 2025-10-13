import apiClient from './apiClient';

export const inventoryService = {
  // No existe endpoint público para listar inventarios en el backend; usaremos productos como base y permitiremos actualizar stock para cada producto
  actualizarStock: (idProducto, payload) => apiClient.put(`/admin/inventario/${idProducto}`, payload),
};

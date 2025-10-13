import apiClient from './apiClient';

const uploadImage = async (file) => {
  const form = new FormData();
  form.append('file', file);

  const response = await apiClient.post('/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data; // URL de la imagen
};

const createProduct = async (productoDTO) => {
  const response = await apiClient.post('/admin/productos', productoDTO);
  return response.data;
};

const getProductById = async (id) => {
  const response = await apiClient.get(`/admin/productos/${id}`);
  return response.data;
};

const updateProduct = async (id, productoDTO) => {
  const response = await apiClient.put(`/admin/productos/${id}`, productoDTO);
  return response.data;
};

export const adminProductService = {
  uploadImage,
  createProduct,
  getProductById,
  updateProduct,
};

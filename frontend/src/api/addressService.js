import apiClient from "./apiClient";

const BASE = "/me/direcciones";

const getMyAddresses = async () => {
  const resp = await apiClient.get(`${BASE}`);
  return resp.data;
};

const createAddress = async (address) => {
  // address: { descripcionCalle: string, idCiudad: number }
  const resp = await apiClient.post(`${BASE}`, address);
  return resp.data;
};

const updateAddress = async (id, address) => {
  const resp = await apiClient.put(`${BASE}/${id}`, address);
  return resp.data;
};

const deleteAddress = async (id) => {
  const resp = await apiClient.delete(`${BASE}/${id}`);
  return resp.data;
};

export default {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};

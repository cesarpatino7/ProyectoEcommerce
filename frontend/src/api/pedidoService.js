import apiClient from "./apiClient";

export const getMisPedidos = async () => {
  const response = await apiClient.get("/pedidos/mis-pedidos");
  return response.data;
};

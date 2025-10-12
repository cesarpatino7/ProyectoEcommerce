import axios from "axios";

// 1. Creamos una instancia de Axios con configuración centralizada.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Usamos un "interceptor" para adjuntar el token a cada petición.
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el token guardado en el localStorage del navegador.
    const token = localStorage.getItem("token");

    // Si el token existe, lo añadimos a la cabecera 'Authorization'.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

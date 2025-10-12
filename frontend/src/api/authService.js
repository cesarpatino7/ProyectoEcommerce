import apiClient from "./apiClient";

/**
 * Llama al endpoint de login de la API.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} La data del usuario y el token.
 */
const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error de conexión con el servidor" }
    );
  }
};

/**
 * Llama al endpoint de logout de la API.
 */
const logout = async () => {
  try {
    // El interceptor de apiClient se encargará de añadir el token necesario.
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Error durante el logout:", error);
    // Normalmente, el logout no debería fallar, pero manejamos el error por si acaso.
  }
};

/**
 * Llama al endpoint de registro de la API para crear un nuevo usuario cliente.
 * @param {object} userData - Datos del nuevo usuario (nombre, apellido, email, password).
 * @returns {Promise<object>} Los datos del usuario registrado.
 */
const register = async (userData) => {
  try {
    // Usamos el endpoint público para el registro de clientes
    const response = await apiClient.post("/usuarios/registro", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión al registrar" };
  }
};

export const authService = {
  login,
  logout,
  register,
};

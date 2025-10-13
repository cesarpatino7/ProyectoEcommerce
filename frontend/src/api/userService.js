import apiClient from "./apiClient";

/**
 * Obtiene la lista completa de usuarios.
 * Requiere rol de SUPER_ADMIN.
 * @returns {Promise<Array>} La lista de usuarios.
 */
const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener los usuarios" };
  }
};

/**
 * Crea un nuevo usuario con un rol de administrador.
 * Requiere rol de SUPER_ADMIN.
 * @param {object} userData - Datos del nuevo usuario (nombre, email, password, idRol).
 * @returns {Promise<object>} El perfil del usuario recién creado.
 */
const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/admin/users", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al crear el usuario" };
  }
};

/**
 * Actualiza los datos de un usuario existente.
 * Requiere rol de SUPER_ADMIN.
 * @param {number} userId - El ID del usuario a actualizar.
 * @param {object} userData - Los datos a actualizar (nombre, apellido, telefono).
 * @returns {Promise<object>} El perfil del usuario actualizado.
 */
const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar el usuario" };
  }
};

/**
 * Elimina un usuario del sistema.
 * Requiere rol de SUPER_ADMIN.
 * @param {number} userId - El ID del usuario a eliminar.
 * @returns {Promise<void>}
 */
const deleteUser = async (userId) => {
  try {
    await apiClient.delete(`/admin/users/${userId}`);
  } catch (error) {
    throw error.response?.data || { message: "Error al eliminar el usuario" };
  }
};

/**
 * Obtiene la lista de roles de administrador disponibles.
 * Requiere rol de SUPER_ADMIN.
 * @returns {Promise<Array>} La lista de roles (con id y descripcion).
 */
const getAdminRoles = async () => {
  try {
    const response = await apiClient.get("/admin/users/roles");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener los roles" };
  }
};

/**
 * Obtiene el perfil del usuario autenticado.
 * Endpoint: GET /api/v1/me/profile
 */
const getMyProfile = async () => {
  try {
    const response = await apiClient.get("/me/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener el perfil" };
  }
};

/**
 * Actualiza el perfil del usuario autenticado (solo campos permitidos por la API).
 * Endpoint: PUT /api/v1/me/profile
 * @param {object} profileData - { nombre, apellido, telefono }
 */
const updateMyProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/me/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar el perfil" };
  }
};

export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminRoles,
  getMyProfile,
  updateMyProfile,
};

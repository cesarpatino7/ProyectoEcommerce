import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserTable from "../components/userTable";
import EditUserModal from "../components/EditUserModal";
import RegisterAdminModal from "../components/RegisterAdminModal";
import Notification from "../components/Notification";

import { userService } from "../api/userService";
import { useAuth } from "../context/AuthContext";

const CRUDPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // 2. Obtenemos el usuario actual de nuestro contexto global
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Roles permitidos para ver esta página de gestión
  const ADMIN_ONLY = ["ROLE_SUPER_ADMIN", "ROLE_ORDER_MANAGER"];

  useEffect(() => {
    // Si el usuario no tiene los roles admin, lo redirigimos a Home
    if (currentUser && !ADMIN_ONLY.includes(currentUser.role)) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  // 3. La función para obtener usuarios ahora usa nuestro servicio
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      showNotification(err.message || "Error al obtener la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ya no necesitamos leer del localStorage, solo llamar a la función
    fetchUsers();
  }, [fetchUsers]);

  // 4. Todas las funciones de manejo de datos ahora usan el servicio
  const handleUpdateUser = async (data) => {
    try {
      await userService.updateUser(selectedUser.id, data);
      setSelectedUser(null);
      fetchUsers(); // Recargamos la lista
      showNotification("Usuario actualizado con éxito.", "success");
    } catch (err) {
      showNotification(err.message);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await userService.deleteUser(userId);
        fetchUsers();
        showNotification("Usuario eliminado con éxito.", "success");
      } catch (err) {
        showNotification(err.message);
      }
    }
  };

  // 5. El registro de admin ahora usa el nuevo endpoint y DTO
  const handleRegisterAdmin = async (data) => {
    try {
      // El 'data' del formulario ya debería incluir nombre, email, password y idRol
      await userService.createUser(data);
      setIsRegisterModalOpen(false);
      fetchUsers(); // Recargamos la lista
      showNotification(
        "Usuario administrador registrado con éxito.",
        "success"
      );
    } catch (err) {
      showNotification(err.message);
    }
  };

  // Filtramos al usuario actual de la lista para no verse a sí mismo
  const filteredUsers = currentUser
    ? users.filter((user) => user.email !== currentUser.email)
    : users;

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <span className="loading loading-spinner"></span> Cargando...
      </div>
    );
  }

  // El JSX no necesita grandes cambios, ya que la lógica está abstraída.
  return (
    <div className="p-4 md:p-8">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ show: false, message: "", type: "" })
          }
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="btn bg-blue-950 text-white hover:bg-blue-900"
        >
          Registrar Usuario Admin
        </button>
      </div>
      <UserTable
        users={filteredUsers}
        onEdit={setSelectedUser}
        onDelete={handleDeleteClick}
      />
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {isRegisterModalOpen && (
        <RegisterAdminModal
          onRegister={handleRegisterAdmin}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CRUDPage;

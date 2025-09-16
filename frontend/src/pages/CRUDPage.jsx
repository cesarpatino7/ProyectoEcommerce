import React, { useState, useEffect } from "react";
import UserTable from "../components/userTable";
import EditUserModal from "../components/EditUserModal";
import RegisterAdminModal from "../components/registerAdminModal";
import Notification from "../components/Notification";

const CRUDPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const API_URL = "http://localhost:8080/api/v1/usuarios";

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Error al obtener la lista de usuarios.");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      showNotification(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("usuario");
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
    fetchUsers();
  }, []);

  const handleUpdateUser = async (data) => {
    try {
      const response = await fetch(`${API_URL}/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario.");
      }
      setSelectedUser(null);
      fetchUsers();
      showNotification("Usuario actualizado con éxito.", "success");
    } catch (err) {
      showNotification(err.message);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Error al eliminar el usuario.");
        }
        fetchUsers();
        showNotification("Usuario eliminado con éxito.", "success");
      } catch (err) {
        showNotification(err.message);
      }
    }
  };

  const handleRegisterAdmin = async (data) => {
    try {
      const response = await fetch(`${API_URL}/registro-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || "Error al registrar administrador."
        );
      }
      setIsRegisterModalOpen(false);
      fetchUsers();
      showNotification("Administrador registrado con éxito.", "success");
    } catch (err) {
      showNotification(err.message);
    }
  };

  const filteredUsers = currentUser
    ? users.filter((user) => user.id !== currentUser.id)
    : users;

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <span className="loading loading-spinner"></span> Cargando...
      </div>
    );
  }

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
          className="btn btn-primary"
        >
          Registrar Admin
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

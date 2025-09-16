import React, { useState, useEffect } from "react";
import UserTable from "../components/userTable";
import EditUserModal from "../components/EditUserModal";

const CRUDPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/api/v1/usuarios";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok)
        throw new Error("Error al obtener la lista de usuarios.");
      const data = await response.json();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.message);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleUpdateUser = async (updatedUserData) => {
    try {
      const response = await fetch(`${API_URL}/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });
      if (!response.ok) throw new Error("Error al actualizar el usuario.");
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el usuario.");
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers = currentUser
    ? users.filter((user) => user.id !== currentUser.id)
    : users;

  if (loading)
    return (
      <div className="p-8">
        <span className="loading loading-spinner"></span> Cargando...
      </div>
    );
  if (error) return <div className="p-8 text-error">{error}</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <UserTable
        users={filteredUsers}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CRUDPage;

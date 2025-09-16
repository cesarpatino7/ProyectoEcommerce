import React from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>{user.telefono || "—"}</td>
              <td className="space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="btn btn-sm btn-outline btn-info"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

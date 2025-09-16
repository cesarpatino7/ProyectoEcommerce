import React, { useState, useEffect } from "react";

const EditUserModal = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <dialog id="edit_modal" className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-bold text-lg">
            Editar Usuario: {user.nombre} {user.apellido}
          </h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Apellido</span>
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Teléfono</span>
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Rol</span>
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Actualizar
            </button>
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditUserModal;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../api/userService";

const RegisterAdminModal = ({ onRegister, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // 1. Estado para guardar la lista de roles y posibles errores
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);

  // 2. Usamos useEffect para cargar los roles cuando el modal se monta
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await userService.getAdminRoles();
        setRoles(data);
      } catch (error) {
        setErrorRoles("No se pudieron cargar los roles. Inténtelo de nuevo.");
        console.error("Error al cargar roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <dialog id="register_modal" className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
          <h3 className="font-bold text-lg">Registrar Nuevo Usuario Admin</h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="input input-bordered w-full"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Apellido</span>
            </label>
            <input
              {...register("apellido", {
                required: "El apellido es obligatorio",
              })}
              className="input input-bordered w-full"
            />
            {errors.apellido && (
              <p className="text-red-500 text-sm mt-1">
                {errors.apellido.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de email inválido",
                },
              })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                maxLength: { value: 16, message: "Máximo 16 caracteres" },
              })}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Rol</span>
            </label>
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : errorRoles ? (
              <p className="text-red-500">{errorRoles}</p>
            ) : (
              <select
                {...register("idRol", { required: "Debe seleccionar un rol" })}
                className="select select-bordered w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione un rol
                </option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.descripcion}
                  </option>
                ))}
              </select>
            )}
            {errors.idRol && (
              <p className="text-red-500 text-sm mt-1">
                {errors.idRol.message}
              </p>
            )}
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || errorRoles}
            >
              Registrar
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

export default RegisterAdminModal;

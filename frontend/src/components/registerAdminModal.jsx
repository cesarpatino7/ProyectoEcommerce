import React from "react";
import { useForm } from "react-hook-form";

const RegisterAdminModal = ({ onRegister, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  return (
    <dialog id="register_modal" className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
          <h3 className="font-bold text-lg">Registrar Nuevo Administrador</h3>

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

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
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

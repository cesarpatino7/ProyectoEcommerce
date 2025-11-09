import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditUserModal = ({ user, onUpdate, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  return (
    <dialog id="edit_modal" className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          <h3 className="font-bold text-lg">
            Editar Usuario: {user.nombre} {user.apellido}
          </h3>

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
              <span className="label-text">Teléfono</span>
            </label>
            <input
              {...register("telefono")}
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn bg-blue-950 text-white hover:bg-blue-900">
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

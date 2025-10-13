import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../api/userService";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await userService.getMyProfile();
        if (mounted) {
          setProfile(data);
          // Inicializar el formulario con los valores
          reset({ nombre: data.nombre || "", apellido: data.apellido || "", telefono: data.telefono || "" });
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => (mounted = false);
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      const updated = await userService.updateMyProfile(values);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert(err.message || "No se pudo actualizar el perfil.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <div className="mt-4">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      {profile ? (
        <div className="mt-4 max-w-md">
          {/* Email (solo lectura) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-gray-800">{profile.email}</div>
          </div>

          {/* Mostrar formulario de edición o datos */}
          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  {...register("nombre", { required: true, minLength: 2 })}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  {...register("apellido", { required: true, minLength: 2 })}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  {...register("telefono", {
                    required: false,
                    pattern: {
                      value: /^\+?[0-9\s\-]{7,10}$/,
                      message: "Teléfono inválido. Use entre 7 y 10 dígitos.",
                    },
                  })}
                  className="mt-1 block w-full border rounded p-2"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={!isValid} className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-50">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset({ nombre: profile.nombre || "", apellido: profile.apellido || "", telefono: profile.telefono || "" });
                    setEditing(false);
                  }}
                  className="bg-gray-300 border rounded border-gray-300 text-gray-800 font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div>
                <strong>Nombre:</strong> {profile.nombre}
              </div>
              <div>
                <strong>Apellido:</strong> {profile.apellido}
              </div>
              <div>
                <strong>Teléfono:</strong> {profile.telefono || "-"}
              </div>

              <div className="mt-4">
                <button onClick={() => setEditing(true)} className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-50">
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">No se encontró el perfil del usuario.</div>
      )}
    </div>
  );
};

export default ProfilePage;

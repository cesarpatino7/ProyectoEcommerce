import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../api/userService";
import addressService from "../api/addressService";
import ciudadesData from "../data/ciudades.json";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: "onChange" });
  const {
    register: regAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    formState: { errors: errorsAddress, isValid: isAddressValid },
  } = useForm({ mode: "onChange" });

  const [addresses, setAddresses] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [addressEditingId, setAddressEditingId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

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

  useEffect(() => {
    if (!showAddresses) return;
    let mounted = true;
    const loadAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const data = await addressService.getMyAddresses();
        if (mounted) setAddresses(data || []);
      } catch (err) {
        console.error("Error al cargar direcciones:", err);
      } finally {
        if (mounted) setLoadingAddresses(false);
      }
    };

    loadAddresses();
    return () => (mounted = false);
  }, [showAddresses]);

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
                <div className="flex gap-2 items-center">
                  <button onClick={() => setEditing(true)} className="bg-blue-950 border rounded border-blue-950 text-white font-bold py-2 px-4 hover:scale-[1.1] transition-transform cursor-pointer mx-auto w-50">
                    Editar
                  </button>

                  <button
                    onClick={() => setShowAddresses((s) => !s)}
                    className="bg-green-600 border rounded border-green-600 text-white font-bold py-2 px-4 hover:scale-[1.05] transition-transform cursor-pointer mx-auto w-50"
                  >
                    Mis direcciones
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">No se encontró el perfil del usuario.</div>
      )}

      {/* Sección de Mis Direcciones */}
      {showAddresses && (
        <div className="mt-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-3">Mis direcciones</h2>

          {loadingAddresses ? (
            <div>Cargando direcciones...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => {
                    setAddressEditingId(null);
                    resetAddress({ descripcionCalle: "", idCiudad: "" });
                    setShowAddressForm(true);
                  }}
                  className="bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Nueva dirección
                </button>
              </div>

              {/* Formulario para crear/editar */}
              {showAddressForm && (
                <form onSubmit={handleSubmitAddress(async (vals) => {
                try {
                  if (addressEditingId) {
                    await addressService.updateAddress(addressEditingId, { descripcionCalle: vals.descripcionCalle, idCiudad: Number(vals.idCiudad) });
                    // actualizar en lista
                    const updated = await addressService.getMyAddresses();
                    setAddresses(updated || []);
                    setAddressEditingId(null);
                    setShowAddressForm(false);
                  } else {
                    await addressService.createAddress({ descripcionCalle: vals.descripcionCalle, idCiudad: Number(vals.idCiudad) });
                    const updated = await addressService.getMyAddresses();
                    setAddresses(updated || []);
                    setShowAddressForm(false);
                  }
                  resetAddress({ descripcionCalle: "", idCiudad: "" });
                } catch (err) {
                  console.error("Error guardar dirección:", err);
                  alert(err.message || "No se pudo guardar la dirección.");
                }
                })} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Descripción de la calle</label>
                  <input {...regAddress("descripcionCalle", { required: "La descripción es obligatoria" })} className="mt-1 block w-full border rounded p-2" />
                  {errorsAddress.descripcionCalle && <p className="text-red-500 text-sm">{errorsAddress.descripcionCalle.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Ciudad</label>
                  <select {...regAddress("idCiudad", { required: "Seleccione una ciudad" })} className="mt-1 block w-full border rounded p-2">
                    <option value="">-- Seleccione ciudad --</option>
                    {ciudadesData.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} - {c.departamento}</option>
                    ))}
                  </select>
                  {errorsAddress.idCiudad && <p className="text-red-500 text-sm">{errorsAddress.idCiudad.message}</p>}
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={!isAddressValid} className="bg-blue-600 text-white py-2 px-4 rounded">{addressEditingId ? 'Actualizar' : 'Crear'}</button>
                  <button type="button" onClick={() => { resetAddress({ descripcionCalle: "", idCiudad: "" }); setAddressEditingId(null); setShowAddressForm(false); }} className="bg-gray-300 py-2 px-4 rounded">Cancelar</button>
                </div>
                </form>
              )}

              {/* Lista de direcciones */}
              <div className="mt-4">
                {addresses.length === 0 ? (
                  <div>No tienes direcciones guardadas.</div>
                ) : (
                  <ul className="space-y-2">
                    {addresses.map((a) => (
                      <li key={a.id} className="p-3 border rounded flex justify-between items-start">
                        <div>
                          <div className="font-medium">{a.descripcionCalle}</div>
                          <div className="text-sm text-gray-600">{a.nombreCiudad} - {a.nombreDepartamento}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setAddressEditingId(a.id);
                            // intentar encontrar id por a.idCiudad o por nombreCiudad
                            let idCiudadVal = "";
                            if (a.idCiudad) {
                              idCiudadVal = String(a.idCiudad);
                            } else if (a.nombreCiudad) {
                              const found = ciudadesData.find((c) => c.nombre.toLowerCase() === String(a.nombreCiudad).toLowerCase());
                              if (found) idCiudadVal = String(found.id);
                            }
                            resetAddress({ descripcionCalle: a.descripcionCalle, idCiudad: idCiudadVal });
                            setShowAddressForm(true);
                          }} className="bg-yellow-500 text-white py-1 px-3 rounded">Editar</button>
                          <button onClick={async () => {
                            try {
                              await addressService.deleteAddress(a.id);
                              setAddresses((prev) => prev.filter((x) => x.id !== a.id));
                            } catch (err) {
                              console.error('Error eliminar:', err);
                              alert(err.message || 'No se pudo eliminar la dirección.');
                            }
                          }} className="bg-red-600 text-white py-1 px-3 rounded">Eliminar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from "react";
import { adminProductService } from "../api/adminProductService";
import { useNotification } from "../context/NotificationContext";
import { useCategories } from "../hooks/useCategories";

const AdminAddProduct = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // limpiar objectURL cuando cambie previewUrl o al desmontar
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {
          /* ignore */
        }
      }
    };
  }, [previewUrl]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const precioNum = Number(precio);
      if (Number.isNaN(precioNum) || precioNum < 0) {
        show("El precio debe ser un número mayor o igual a 0", "error");
        setIsSubmitting(false);
        return;
      }

      let imagenUrl = null;
      if (imagenFile) {
        imagenUrl = await adminProductService.uploadImage(imagenFile);
      }

      const dto = {
        nombre,
        descripcion,
        precio: Number(precio),
        activo: false, // Producto inactivo hasta que tenga stock
        categoriaIds: selectedCategoryIds,
        imagenes: imagenUrl ? [imagenUrl] : [],
      };

      await adminProductService.createProduct(dto);
      show("Producto creado correctamente", "success");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setSelectedCategoryIds([]);
      setImagenFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      show("Error al crear el producto (ver consola)", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Agregar Nuevo Producto
                </h1>
                <p className="text-gray-600 mt-1">
                  Completa los datos para crear un nuevo producto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información Básica
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Ej: Perfume Océano Fresco"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows="4"
                  placeholder="Describe las características y detalles del producto..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio (PYG) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₲
                  </span>
                  <input
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Imagen del Producto
              </h2>

              <div>
                <input
                  id="admin-add-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    setImagenFile(f);
                    if (f) {
                      const url = URL.createObjectURL(f);
                      setPreviewUrl(url);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />
                <label
                  htmlFor="admin-add-file"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Seleccionar Imagen
                </label>

                {previewUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Previsualización:
                    </p>
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="w-64 h-64 object-cover rounded-lg shadow-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagenFile(null);
                          setPreviewUrl(null);
                          document.getElementById("admin-add-file").value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Categorías */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Categorías
              </h2>

              {!categoriesLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCategoryIds.includes(cat.id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={cat.id}
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setSelectedCategoryIds((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {cat.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  <span className="text-sm">Cargando categorías...</span>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Crear Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;

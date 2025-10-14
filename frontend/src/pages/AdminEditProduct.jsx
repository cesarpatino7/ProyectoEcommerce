import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminProductService } from "../api/adminProductService";
import { useNotification } from "../context/NotificationContext";
import { useCategories } from "../hooks/useCategories";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useNotification();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [productCategoryNames, setProductCategoryNames] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminProductService.getProductById(id);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setPrecio(data.precio);
        setImagenes(data.imagenes || []);
        // inicializar categorías si vienen
        if (Array.isArray(data.categoriaIds) && data.categoriaIds.length > 0) {
          setSelectedCategoryIds(data.categoriaIds.map(Number));
        } else if (data.categorias && Array.isArray(data.categorias)) {
          // guardar nombres y mapear a ids cuando 'categories' esté disponible
          setProductCategoryNames(data.categorias);
          const ids = (categories || [])
            .filter((c) => data.categorias.includes(c.nombre))
            .map((c) => c.id);
          if (ids.length > 0) setSelectedCategoryIds(ids);
        }
      } catch (err) {
        console.error(err);
        show("Error cargando producto", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Si recibimos nombres de categorías en el producto y las categorías globales se cargan después,
  // mapear los nombres a ids para preseleccionar los checkboxes.
  useEffect(() => {
    if (
      (!selectedCategoryIds || selectedCategoryIds.length === 0) &&
      productCategoryNames &&
      categories &&
      categories.length > 0
    ) {
      const ids = categories
        .filter((c) => productCategoryNames.includes(c.nombre))
        .map((c) => c.id);
      if (ids.length > 0) setSelectedCategoryIds(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategoryNames, categories]);

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

      const dto = {
        nombre,
        descripcion,
        precio: precioNum,
        activo: true,
        categoriaIds: selectedCategoryIds,
        imagenes: imagenes,
      };

      await adminProductService.updateProduct(id, dto);
      show("Producto actualizado", "success");
      navigate("/inventario");
    } catch (err) {
      console.error(err);
      show("Error actualizando producto", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Editar Producto
                </h1>
                <p className="text-gray-600 mt-1">
                  Actualiza la información del producto
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
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
                Imágenes del Producto
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <input
                    id="admin-edit-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (!f) return;
                      setSelectedFile(f);
                      const url = URL.createObjectURL(f);
                      setPreviewUrl(url);
                    }}
                  />
                  <label
                    htmlFor="admin-edit-file"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg text-sm"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Agregar Imagen
                  </label>
                  {imagenes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("¿Eliminar todas las imágenes?")) {
                          setImagenes([]);
                        }
                      }}
                      className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg text-sm"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Quitar Todas
                    </button>
                  )}
                </div>

                {/* Preview de nueva imagen */}
                {previewUrl && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Nueva imagen seleccionada:
                    </p>
                    <div className="flex items-start gap-4">
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={async () => {
                            if (!selectedFile) return;
                            setUploading(true);
                            try {
                              const url = await adminProductService.uploadImage(
                                selectedFile
                              );
                              setImagenes((prev) => [...prev, url]);
                              show("Imagen subida exitosamente", "success");
                              setSelectedFile(null);
                              try {
                                URL.revokeObjectURL(previewUrl);
                              } catch {
                                // ignore
                              }
                              setPreviewUrl(null);
                            } catch (err) {
                              console.error(err);
                              show("Error subiendo imagen", "error");
                            } finally {
                              setUploading(false);
                            }
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Subiendo...
                            </>
                          ) : (
                            <>
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
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                              Subir Imagen
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (previewUrl) {
                              try {
                                URL.revokeObjectURL(previewUrl);
                              } catch {
                                // ignore
                              }
                            }
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Galería de imágenes actuales */}
                {imagenes.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Imágenes actuales ({imagenes.length}):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagenes.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`Imagen ${idx + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImagenes((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagenes.length === 0 && !previewUrl && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mx-auto mb-2"
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
                    <p className="text-gray-500 text-sm">
                      No hay imágenes. Agrega una nueva imagen.
                    </p>
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
                onClick={() => navigate("/admin/productos")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
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
                    Guardar Cambios
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

export default AdminEditProduct;

import React from "react";

const AdminProductCard = ({
  product,
  onDelete,
  onEdit,
  showActions = true,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const getImageUrl = () => {
    try {
      if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
        return product.imagenes[0];
      }
      if (
        typeof product.imagenes === "string" &&
        product.imagenes.trim().length > 0
      ) {
        const raw = product.imagenes.trim();
        if (raw.startsWith("[") || raw.startsWith("{")) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        }
        if (raw.includes(",")) {
          const parts = raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          if (parts.length > 0) return parts[0];
        }
        return raw;
      }
    } catch (err) {
      console.error("Error procesando imagen:", err);
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Imagen del producto */}
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nombre}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm mt-2">Sin imagen</p>
          </div>
        )}

        {/* Badge de estado */}
        {product.activo !== undefined && (
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                product.activo
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {product.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.nombre}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {product.descripcion || "Sin descripción"}
        </p>

        {/* Categorías */}
        {product.categorias && product.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.categorias.slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
              >
                {cat}
              </span>
            ))}
            {product.categorias.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                +{product.categorias.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Precio */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-purple-600">
            {formatPrice(product.precio)}
          </p>
          {product.stockActual !== undefined && (
            <p className="text-sm text-gray-500 mt-1">
              Stock:{" "}
              <span
                className={`font-semibold ${
                  product.stockActual > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stockActual}
              </span>{" "}
              unidades
            </p>
          )}
        </div>

        {/* Acciones */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => onEdit && onEdit(product)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </button>
            <button
              onClick={() => onDelete && onDelete(product)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm font-medium"
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
        )}
      </div>
    </div>
  );
};

export default AdminProductCard;

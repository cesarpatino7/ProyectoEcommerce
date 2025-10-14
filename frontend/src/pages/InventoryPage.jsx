import React, { useEffect, useState } from "react";
import { productService } from "../api/productService";
import { inventoryService } from "../api/inventoryService";
import { adminProductService } from "../api/adminProductService";
import { useNotification } from "../context/NotificationContext";
import { useCategories } from "../hooks/useCategories";

const InventoryPage = () => {
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(null); // idProducto en edición
  const [nuevoStock, setNuevoStock] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [editingCategories, setEditingCategories] = useState([]);
  const { show } = useNotification();
  const { categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    const load = async () => {
      try {
        // obtener productos (vista de catálogo paginada simple)
        const data = await productService.getProducts({ page: 0, size: 100 });
        // productService devuelve response.data; la lista puede estar en data.content o en data directamente
        const lista = data?.content || data?.items || data || [];
        // Intentar enriquecer cada producto con su detalle (que puede incluir stockActual desde el backend)
        try {
          const detalles = await Promise.all(
            lista.map(async (p) => {
              try {
                const detalle = await productService.getProductById(p.id);
                // Algunos endpoints devuelven stock en la propiedad stockActual u otros nombres; priorizamos stockActual
                return {
                  ...p,
                  stockActual: detalle.stockActual ?? detalle.stock ?? p.stock,
                };
              } catch (e) {
                // Si falla el detalle, devolvemos el producto tal cual
                return p;
              }
            })
          );
          setProductos(detalles);
        } catch (e) {
          // Si la enriquecimiento falla por cualquier motivo, usar la lista original
          setProductos(lista);
        }
      } catch (err) {
        console.error(err);
        show("Error cargando productos", "error");
      }
    };
    load();
  }, []);

  const startEdit = (id, currentStock, producto) => {
    setEditing(id);
    setNuevoStock(currentStock ?? 0);
    setEditingProduct(producto || null);

    // Inicializar categoría seleccionada a partir del producto
    try {
      // Si el producto trae ids de categorías, inicializar el array con ellos
      if (
        producto &&
        Array.isArray(producto.categoriaIds) &&
        producto.categoriaIds.length > 0
      ) {
        setEditingCategories(producto.categoriaIds.map(Number));
        return;
      }

      // Si el producto trae nombres de categorías en producto.categorias (string o array), mapear a id
      let nombres = [];
      if (producto) {
        if (Array.isArray(producto.categorias)) nombres = producto.categorias;
        else if (typeof producto.categorias === "string")
          nombres = producto.categorias
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      }

      if (nombres.length > 0 && categories && categories.length > 0) {
        const ids = categories
          .filter((c) => nombres.includes(c.nombre))
          .map((c) => c.id);
        setEditingCategories(ids);
      } else {
        setEditingCategories([]);
      }
    } catch (e) {
      setEditingCategoryId("");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setNuevoStock("");
    setEditingProduct(null);
    setEditingCategoryId("");
    setEditingCategories([]);
  };

  const saveStock = async (producto) => {
    try {
      const payload = {
        stockActual: Number(nuevoStock),
        stockMinimo: producto.stockMinimo ?? 0,
      };
      const resp = await inventoryService.actualizarStock(producto.id, payload);
      show("Stock actualizado", "success");
      // actualizar la lista localmente
      setProductos((p) =>
        p.map((pdt) =>
          pdt.id === producto.id
            ? { ...pdt, stockActual: resp.data.stockActual }
            : pdt
        )
      );
      cancelEdit();
      // Construir un objeto producto actualizado usando la respuesta de inventario
      try {
        const invent = resp.data; // InventarioResponseDTO
        const productoActualizado = {
          ...producto,
          stockActual: invent.stockActual,
          stockMinimo: invent.stockMinimo,
        };

        // Actualizar la lista local con el objeto combinado
        setProductos((p) =>
          p.map((pdt) => (pdt.id === producto.id ? productoActualizado : pdt))
        );

        // Emitir el producto combinado para que Home lo inserte inmediatamente
        // Guardar en localStorage para que Home lo inyecte aunque no esté montado
        try {
          const stored = JSON.parse(
            localStorage.getItem("freshProducts") || "{}"
          );
          if ((productoActualizado.stockActual ?? 0) > 0) {
            stored[productoActualizado.id] = productoActualizado;
          } else {
            // si quedó en 0, remover de freshProducts
            if (stored[productoActualizado.id])
              delete stored[productoActualizado.id];
          }
          localStorage.setItem("freshProducts", JSON.stringify(stored));
        } catch (e) {
          // ignore storage errors
        }

        window.dispatchEvent(
          new CustomEvent("stockUpdated", {
            detail: {
              id: producto.id,
              stock: invent.stockActual,
              product: productoActualizado,
            },
          })
        );
      } catch (e) {
        // Fallback: emitir sólo id/stock
        try {
          window.dispatchEvent(
            new CustomEvent("stockUpdated", {
              detail: { id: producto.id, stock: resp.data.stockActual },
            })
          );
        } catch (e2) {}
      }
      // Si se seleccionó categoría en la edición, enviar al endpoint admin
      try {
        if (
          editingCategories &&
          Array.isArray(editingCategories) &&
          editingCategories.length > 0
        ) {
          const dto = {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio ?? producto.price ?? 0,
            activo: producto.activo ?? true,
            categoriaIds: editingCategories,
            imagenes: producto.imagenes || [],
          };
          const updated = await adminProductService.updateProduct(
            producto.id,
            dto
          );
          if (updated) {
            setProductos((p) =>
              p.map((pdt) =>
                pdt.id === producto.id ? { ...pdt, ...updated } : pdt
              )
            );
          }
        }
      } catch (err) {
        console.error("Error actualizando categorías:", err);
        show("Error actualizando categorías (no crítico)", "warning");
      } finally {
        setEditingCategories([]);
        setEditingCategoryId("");
        setEditingProduct(null);
      }
    } catch (err) {
      console.error(err);
      show("Error actualizando stock", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Gestión de Inventario
                </h1>
                <p className="text-gray-600 mt-1">
                  Administra y actualiza el stock de tus productos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la tabla */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="flex items-center gap-3">
                      {(() => {
                        try {
                          if (
                            Array.isArray(prod.imagenes) &&
                            prod.imagenes.length > 0
                          )
                            return (
                              <img
                                src={prod.imagenes[0]}
                                alt={prod.nombre}
                                className="w-12 h-12 object-contain"
                              />
                            );
                          if (
                            typeof prod.imagenes === "string" &&
                            prod.imagenes.trim().length > 0
                          ) {
                            const raw = prod.imagenes.trim();
                            // intentar parsear JSON
                            if (raw.startsWith("[") || raw.startsWith("{")) {
                              try {
                                const parsed = JSON.parse(raw);
                                if (Array.isArray(parsed) && parsed.length > 0)
                                  return (
                                    <img
                                      src={parsed[0]}
                                      alt={prod.nombre}
                                      className="w-12 h-12 object-contain"
                                    />
                                  );
                              } catch (e) {
                                // ignore
                              }
                            }
                            // intentar CSV
                            if (raw.includes(",")) {
                              const parts = raw
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              if (parts.length > 0)
                                return (
                                  <img
                                    src={parts[0]}
                                    alt={prod.nombre}
                                    className="w-12 h-12 object-contain"
                                  />
                                );
                            }
                            // fallback a la cadena completa
                            return (
                              <img
                                src={raw}
                                alt={prod.nombre}
                                className="w-12 h-12 object-contain"
                              />
                            );
                          }
                        } catch (err) {
                          console.error("Error procesando miniatura:", err);
                        }
                        return null;
                      })()}
                      <div>
                        <div className="font-semibold">{prod.nombre}</div>
                        <div className="text-xs text-gray-600">
                          {prod.descripcion}
                        </div>
                      </div>
                    </td>
                    <td>
                      {new Intl.NumberFormat("es-PY", {
                        style: "currency",
                        currency: "PYG",
                        maximumFractionDigits: 0,
                      }).format(prod.precio ?? prod.price ?? 0)}
                    </td>
                    <td>
                      {editing === prod.id ? (
                        <div className="flex flex-col">
                          <input
                            type="number"
                            value={nuevoStock}
                            onChange={(e) => setNuevoStock(e.target.value)}
                            className="input input-sm w-28"
                          />
                        </div>
                      ) : (
                        <span>{prod.stockActual ?? prod.stock ?? "N/A"}</span>
                      )}
                    </td>
                    <td>
                      {editing === prod.id ? (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => saveStock(prod)}
                          >
                            Guardar
                          </button>
                          <button className="btn btn-sm" onClick={cancelEdit}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm"
                            onClick={() =>
                              startEdit(
                                prod.id,
                                prod.stockActual ?? prod.stock ?? 0,
                                prod
                              )
                            }
                          >
                            Editar Stock
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              (window.location.href = `/admin/productos/${prod.id}/editar`)
                            }
                          >
                            Editar Producto
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

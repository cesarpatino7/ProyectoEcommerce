import React, { useEffect, useState } from 'react';
import { productService } from '../api/productService';
import { inventoryService } from '../api/inventoryService';
import { adminProductService } from '../api/adminProductService';
import { useNotification } from '../context/NotificationContext';

const InventoryPage = () => {
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(null); // idProducto en edición
  const [nuevoStock, setNuevoStock] = useState('');
  const { show } = useNotification();

  useEffect(() => {
    const load = async () => {
      try {
  // obtener productos (vista de catálogo paginada simple)
  const data = await productService.getProducts({ page:0, size:100 });
  // productService devuelve response.data; la lista puede estar en data.content o en data directamente
  const lista = data?.content || data?.items || data || [];
  // Intentar enriquecer cada producto con su detalle (que puede incluir stockActual desde el backend)
  try {
    const detalles = await Promise.all(lista.map(async (p) => {
      try {
        const detalle = await productService.getProductById(p.id);
        // Algunos endpoints devuelven stock en la propiedad stockActual u otros nombres; priorizamos stockActual
        return { ...p, stockActual: detalle.stockActual ?? detalle.stock ?? p.stock };
      } catch (e) {
        // Si falla el detalle, devolvemos el producto tal cual
        return p;
      }
    }));
    setProductos(detalles);
  } catch (e) {
    // Si la enriquecimiento falla por cualquier motivo, usar la lista original
    setProductos(lista);
  }
      } catch (err) {
        console.error(err);
        show('Error cargando productos', 'error');
      }
    };
    load();
  }, []);

  const startEdit = (id, currentStock) => {
    setEditing(id);
    setNuevoStock(currentStock ?? 0);
  };

  const cancelEdit = () => {
    setEditing(null);
    setNuevoStock('');
  };


  const saveStock = async (producto) => {
    try {
      const payload = { stockActual: Number(nuevoStock), stockMinimo: producto.stockMinimo ?? 0 };
      const resp = await inventoryService.actualizarStock(producto.id, payload);
      show('Stock actualizado', 'success');
      // actualizar la lista localmente
      setProductos(p => p.map(pdt => pdt.id === producto.id ? { ...pdt, stockActual: resp.data.stockActual } : pdt));
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
        setProductos(p => p.map(pdt => pdt.id === producto.id ? productoActualizado : pdt));

        // Emitir el producto combinado para que Home lo inserte inmediatamente
        // Guardar en localStorage para que Home lo inyecte aunque no esté montado
        try {
          const stored = JSON.parse(localStorage.getItem('freshProducts') || '{}');
          if ((productoActualizado.stockActual ?? 0) > 0) {
            stored[productoActualizado.id] = productoActualizado;
          } else {
            // si quedó en 0, remover de freshProducts
            if (stored[productoActualizado.id]) delete stored[productoActualizado.id];
          }
          localStorage.setItem('freshProducts', JSON.stringify(stored));
        } catch (e) {
          // ignore storage errors
        }

        window.dispatchEvent(new CustomEvent('stockUpdated', { detail: { id: producto.id, stock: invent.stockActual, product: productoActualizado } }));
      } catch (e) {
        // Fallback: emitir sólo id/stock
        try { window.dispatchEvent(new CustomEvent('stockUpdated', { detail: { id: producto.id, stock: resp.data.stockActual } })); } catch (e2) {}
      }
    } catch (err) {
      console.error(err);
      show('Error actualizando stock', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>
      <p className="text-sm text-gray-600 mb-4">Administra el stock de productos. Solo accesible para Product Manager.</p>

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
            {productos.map(prod => (
              <tr key={prod.id}>
                <td className="flex items-center gap-3">
                  {prod.imagenes && prod.imagenes[0] && (<img src={prod.imagenes[0]} alt={prod.nombre} className="w-12 h-12 object-contain" />)}
                  <div>
                    <div className="font-semibold">{prod.nombre}</div>
                    <div className="text-xs text-gray-600">{prod.descripcion}</div>
                  </div>
                </td>
                <td>{new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(prod.precio ?? prod.price ?? 0)}</td>
                <td>
                  {editing === prod.id ? (
                    <input type="number" value={nuevoStock} onChange={e => setNuevoStock(e.target.value)} className="input input-sm w-28" />
                  ) : (
                    <span>{prod.stockActual ?? prod.stock ?? 'N/A'}</span>
                  )}
                </td>
                <td>
                  {editing === prod.id ? (
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => saveStock(prod)}>Guardar</button>
                      <button className="btn btn-sm" onClick={cancelEdit}>Cancelar</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button className="btn btn-sm" onClick={() => startEdit(prod.id, prod.stockActual ?? prod.stock ?? 0)}>Editar Stock</button>
                      <button className="btn btn-sm btn-outline" onClick={() => window.location.href = `/admin/productos/${prod.id}/editar`}>Editar Producto</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;

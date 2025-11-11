import React, { useEffect, useState, useCallback } from 'react';
import { orderService } from '../api/orderService';
import { useNotification } from '../context/NotificationContext';

const ESTADOS = [
  { id: 1, descripcion: 'Pendiente' },
  { id: 2, descripcion: 'Procesando' },
  { id: 3, descripcion: 'Enviado' },
  { id: 4, descripcion: 'Entregado' },
  { id: 5, descripcion: 'Cancelado' },
];

const OrderManagerPage = () => {
  const [ordersPage, setOrdersPage] = useState(null);
  const [allOrders, setAllOrders] = useState([]); // Nuevo estado para todos los pedidos
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('todos'); // Nuevo estado para filtro
  const { show } = useNotification();
  const [modalAnimating, setModalAnimating] = useState(false);

  const formatGs = (value) => {
    try {
      const num = Number(value ?? 0);
      return `Gs. ${new Intl.NumberFormat('es-PY').format(num)}`;
    } catch {
      return `Gs. ${value}`;
    }
  };

  // Función para filtrar pedidos por estado con paginación
  const getFilteredOrders = () => {
    const ordersToFilter = allOrders;
    
    let filtered;
    if (selectedFilter === 'todos') {
      filtered = ordersToFilter;
    } else {
      filtered = ordersToFilter.filter(order => order.estado === selectedFilter);
    }
    
    // Aplicar paginación a los resultados filtrados
    const startIndex = page * size;
    const endIndex = startIndex + size;
    return filtered.slice(startIndex, endIndex);
  };

  // Función para obtener el total de pedidos filtrados
  const getTotalFilteredOrders = () => {
    if (selectedFilter === 'todos') {
      return allOrders.length;
    }
    return allOrders.filter(order => order.estado === selectedFilter).length;
  };

  // Función para obtener el número total de páginas para los resultados filtrados
  const getTotalFilteredPages = () => {
    const total = getTotalFilteredOrders();
    return Math.ceil(total / size);
  };

  // Función para obtener todos los pedidos de todas las páginas
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Primero obtenemos la primera página para conocer el total
      const firstPage = await orderService.getOrders({ page: 0, size });
      const totalPages = firstPage.totalPages;
      
      // Si hay más de una página, obtenemos todas las páginas
      if (totalPages > 1) {
        const allRequests = [];
        for (let i = 0; i < totalPages; i++) {
          allRequests.push(orderService.getOrders({ page: i, size }));
        }
        
        const allPages = await Promise.all(allRequests);
        const allOrdersFlat = allPages.flatMap(pageData => pageData.content);
        setAllOrders(allOrdersFlat);
        setOrdersPage(firstPage); // Mantenemos la estructura de páginas para navegación
      } else {
        setAllOrders(firstPage.content);
        setOrdersPage(firstPage);
      }
    } catch (err) {
      console.error('Error fetching all orders', err);
      show('Error al cargar los pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, [size, show]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ page, size });
      setOrdersPage(data);
      // Solo actualizamos allOrders si no tenemos filtro aplicado
      if (selectedFilter === 'todos') {
        // Solo actualizar la página actual en allOrders para navegación normal
        const startIndex = page * size;
        const newAllOrders = [...allOrders];
        data.content.forEach((order, index) => {
          newAllOrders[startIndex + index] = order;
        });
        setAllOrders(newAllOrders.slice(0, data.totalElements));
      }
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setLoading(false);
    }
  }, [page, size, selectedFilter, allOrders]);

  useEffect(() => {
    // Cargar todos los pedidos al montar el componente
    fetchAllOrders();
  }, []);

  // Efecto para recargar cuando se actualiza un pedido
  const refreshOrders = useCallback(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Resetear página cuando cambia el filtro
  useEffect(() => {
    setPage(0);
  }, [selectedFilter]);

  const handleChangeEstado = async (orderId, nuevoEstadoId) => {
    try {
      await orderService.updateOrderStatus(orderId, nuevoEstadoId);
      show('Estado actualizado', 'success');
      refreshOrders(); // Usar refreshOrders en lugar de fetchOrders
    } catch (err) {
      console.error('Error updating estado', err);
      show(err.message || 'Error al actualizar estado', 'error');
    }
  };

  const openDetalle = (order) => {
    setSelectedOrder(order);
    // trigger animation on next tick
    setTimeout(() => setModalAnimating(true), 20);
  };

  const closeDetalle = () => {
    // animate out then close
    setModalAnimating(false);
    setTimeout(() => setSelectedOrder(null), 260);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Manager</h1>

      {loading && <p>Cargando pedidos...</p>}

      {!loading && ordersPage && (
        <div>
          {/* Filtro de estados */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-4 flex-wrap">
              <label htmlFor="estado-filter" className="text-sm font-medium text-gray-700">
                Filtrar por estado:
              </label>
              <select
                id="estado-filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="select select-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                <option value="todos">Todos los estados</option>
                {ESTADOS.map((estado) => (
                  <option key={estado.id} value={estado.descripcion}>
                    {estado.descripcion}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Mostrando <strong>{getFilteredOrders().length}</strong> de <strong>{getTotalFilteredOrders()}</strong> pedidos
                  {selectedFilter !== 'todos' && (
                    <span className="text-blue-600 font-medium"> (filtrado por "{selectedFilter}")</span>
                  )}
                </span>
                
                {selectedFilter !== 'todos' && (
                  <button
                    onClick={() => setSelectedFilter('todos')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Limpiar filtro
                  </button>
                )}
              </div>
            </div>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Usuario</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredOrders().length === 0 ? (
                <tr>
                  <td colSpan="5" className="border px-4 py-8 text-center text-gray-500">
                    {selectedFilter === 'todos' 
                      ? 'No hay pedidos para mostrar' 
                      : `No hay pedidos con estado "${selectedFilter}"`
                    }
                  </td>
                </tr>
              ) : (
                getFilteredOrders().map((o) => (
                <tr key={o.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openDetalle(o)}>
                  <td className="border px-2 py-1">{o.id}</td>
                  <td className="border px-2 py-1">{new Date(o.fechaPedido).toLocaleString()}</td>
                  <td className="border px-2 py-1">{o.nombreUsuario} ({o.emailUsuario})</td>
                  <td className="border px-2 py-1">{formatGs(o.total)}</td>
                <td className="border px-2 py-1">
                  <div className="flex items-center gap-3">
                    <select
                      value={ESTADOS.find(s => s.descripcion === o.estado)?.id ?? ''}
                      onChange={(e) => handleChangeEstado(o.id, Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="select select-sm max-w-xs transition-colors duration-200"
                      aria-label={`Cambiar estado pedido ${o.id}`}
                    >
                      {ESTADOS.map((s) => (
                        <option key={s.id} value={s.id}>{s.descripcion}</option>
                      ))}
                    </select>

                    {/* detalle abre al click en la fila; el select usa stopPropagation para evitarlo */}
                  </div>
                </td>
                </tr>
              )))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1 bg-gray-200 rounded mr-2 disabled:opacity-50"
              >Anterior</button>
              <button
                disabled={page + 1 >= getTotalFilteredPages()}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >Siguiente</button>
            </div>

            <div>Página {page + 1} de {getTotalFilteredPages()}</div>

            <div>
              <label className="mr-2">Ir a página:</label>
              <input
                type="number"
                min={1}
                max={getTotalFilteredPages()}
                value={page + 1}
                onChange={(e) => {
                  const v = Number(e.target.value) - 1;
                  if (!isNaN(v)) {
                    setPage(Math.max(0, Math.min(v, getTotalFilteredPages() - 1)));
                  }
                }}
                className="input input-sm w-20"
              />
            </div>
          </div>
        </div>
      )}

      {!loading && !ordersPage && <p>No hay pedidos para mostrar.</p>}

      {/* Modal de detalle */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          style={{ backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`order-${selectedOrder.id}-title`}
        >
          <div className={`bg-white rounded shadow-lg max-w-2xl w-full p-6 transform transition-all duration-250 ${modalAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalle Orden #{selectedOrder.id}</h2>
              <button className="btn btn-ghost" onClick={closeDetalle}>Cerrar</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Usuario</h3>
                <p>{selectedOrder.nombreUsuario}</p>
                <p className="text-sm text-gray-600">{selectedOrder.emailUsuario}</p>
                <p className="text-sm">Teléfono: {selectedOrder.telefonoUsuario || 'N/A'}</p>
              </div>

              <div>
                <h3 className="font-semibold">Envío</h3>
                <p>{selectedOrder.direccionEnvio}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Resumen</h3>
              <p>Fecha: {new Date(selectedOrder.fechaPedido).toLocaleString()}</p>
              <p>Total: {selectedOrder.total}</p>
              <p>Estado: {selectedOrder.estado}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagerPage;

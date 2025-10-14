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
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ page, size });
      setOrdersPage(data);
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleChangeEstado = async (orderId, nuevoEstadoId) => {
    try {
      await orderService.updateOrderStatus(orderId, nuevoEstadoId);
      show('Estado actualizado', 'success');
      fetchOrders();
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
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Usuario</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Estado</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordersPage.content.map((o) => (
                <tr key={o.id}>
                  <td className="border px-2 py-1">{o.id}</td>
                  <td className="border px-2 py-1">{new Date(o.fechaPedido).toLocaleString()}</td>
                  <td className="border px-2 py-1">{o.nombreUsuario} ({o.emailUsuario})</td>
                  <td className="border px-2 py-1">{formatGs(o.total)}</td>
                  <td className="border px-2 py-1">{o.estado}</td>
                  <td className="border px-2 py-1">
                    <select
                      value={ESTADOS.find(s => s.descripcion === o.estado)?.id ?? ''}
                      onChange={(e) => handleChangeEstado(o.id, Number(e.target.value))}
                      className="select select-sm max-w-xs transition-all duration-200"
                    >
                      {ESTADOS.map((s) => (
                        <option key={s.id} value={s.id}>{s.descripcion}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <button className="btn btn-sm btn-ghost transform transition-transform duration-150 hover:scale-105" onClick={() => openDetalle(o)}>Detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <button
                disabled={!ordersPage || page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1 bg-gray-200 rounded mr-2"
              >Anterior</button>
              <button
                disabled={!ordersPage || page + 1 >= ordersPage.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >Siguiente</button>
            </div>

            <div>Página {ordersPage.number + 1} de {ordersPage.totalPages}</div>

            <div>
              <label className="mr-2">Ir a página:</label>
              <input
                type="number"
                min={1}
                max={ordersPage.totalPages}
                value={page + 1}
                onChange={(e) => {
                  const v = Number(e.target.value) - 1;
                  if (!isNaN(v)) {
                    setPage(Math.max(0, Math.min(v, ordersPage.totalPages - 1)));
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
